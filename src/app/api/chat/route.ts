import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `Eres el Tutor Técnico de MIACON 2.0, un asistente especializado en resolución de dudas conceptuales y diagnóstico de fallos para estudiantes de sistemas de control automático en la plataforma MIACON 2.0.

REGLAS ESTRICTAS DE RESPUESTA:
1. Tu único propósito es responder dudas conceptuales (control PID, lazo cerrado, sensores, actuadores, estabilidad, sintonización) y orientar en el diagnóstico de fallos o problemas comunes durante las prácticas en el módulo MIACON 2.0 o en su configuración con MATLAB/Simulink y comunicación MQTT.
2. NO generes ni escribas bloques de código (ni scripts de MATLAB, ni código Python/C++/Arduino), ni generes imágenes, diagramas ni tablas complejas.
3. Responde SIEMPRE en texto plano claro, directo, conciso y conversacional (máximo 2 o 3 párrafos breves por respuesta). Evita usar sintaxis Markdown como bloques de código (\`\`\`), encabezados (#) o formato innecesario.
4. Si el usuario te pide que le hagas un código o script completo, indícale amablemente que tu función es guiarlo conceptualmente y ayudarle a diagnosticar fallos paso a paso, explicándole la lógica con palabras sencillas.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const previousInteractionId: string | undefined = body?.previousInteractionId;

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron mensajes para procesar." },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content?.trim() || "";
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Upgrade deprecated gemini-2.5-* models to gemini-3.8-flash per current Gemini API standards
    const rawModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const model = rawModel.startsWith("gemini-2.") || rawModel.startsWith("gemini-1.")
      ? "gemini-3.8-flash"
      : rawModel;

    // Modo demo / aviso cuando aún no se ha configurado GEMINI_API_KEY en Vercel o .env.local
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Modo de vista previa activo (GEMINI_API_KEY aún no detectada en las variables de entorno). Una vez configures tu clave de Google AI Studio en Vercel, responderé en tiempo real a tu consulta sobre el equipo MIACON 2.0, diagnóstico de fallos en planta y conceptos de control PID.",
        mode: "demo",
      });
    }

    const client = new GoogleGenAI({ apiKey });

    // Si aún no hay previousInteractionId pero hay varios mensajes en la sesión,
    // condensamos el hilo de la sesión activa para mantener el contexto.
    const formattedInput =
      !previousInteractionId && messages.length > 1
        ? messages
            .map((m) => `${m.role === "user" ? "Estudiante" : "Tutor"}: ${m.content}`)
            .join("\n\n")
        : lastUserMessage;

    const interaction = await client.interactions.create({
      model,
      input: formattedInput,
      system_instruction: SYSTEM_INSTRUCTION,
      ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
    });

    const cleanReply = (interaction.output_text || "No se pudo obtener una respuesta del tutor en este momento.")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[*#`_~]/g, "")
      .trim();

    return NextResponse.json({
      reply: cleanReply,
      interactionId: interaction.id,
      mode: "live",
    });
  } catch (error: any) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Ocurrió un error al comunicarse con el servicio de Google AI Studio. Verifica tu GEMINI_API_KEY en Vercel.",
      },
      { status: 500 }
    );
  }
}
