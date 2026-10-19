import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Cargar la base de conocimiento oficial desde Guias/conocimiento.txt con fallback
function loadSystemInstruction(): string {
  try {
    const filePath = path.join(process.cwd(), "Guias", "conocimiento.txt");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return fileContent.trim();
    }
  } catch (err) {
    console.error("No se pudo leer Guias/conocimiento.txt:", err);
  }

  // Fallback seguro en caso de que el archivo no esté disponible
  return `ROL Y PERSONALIDAD:
- Eres el Asistente Virtual Especializado del Proyecto Miacon y Sistemas de Control.
- Tono: Extremadamente amable, paciente, empático, profesional y educativo.
- Objetivo: Guiar al usuario con explicaciones claras, detalladas y fáciles de entender, adaptándose a su nivel técnico.
- LÍMITES ESTRICTOS: SOLO TEXTO, LISTAS Y FÓRMULAS LATEX ($...$ o $$...$$). PROHIBIDO GENERAR CÓDIGO (nada de Python, C++, MATLAB, etc.) ni imágenes o diagramas visuales. Si piden código, declina con cortesía y explica la teoría o lógica algorítmica con palabras.`;
}

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
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Actualizar modelos obsoletos según los estándares actuales de la API de Gemini
    const rawModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
    const primaryModel =
      rawModel.startsWith("gemini-2.") || rawModel.startsWith("gemini-1.")
        ? "gemini-3.8-flash"
        : rawModel;

    // Modo demo / aviso cuando aún no se ha configurado GEMINI_API_KEY en Vercel o .env.local
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "¡Hola! Soy tu Asistente Virtual del Proyecto Miacon. Modo de vista previa activo (GEMINI_API_KEY aún no detectada en las variables de entorno del proyecto). En cuanto agregues tu clave en Vercel o en tu archivo .env.local, responderé en tiempo real según el manual oficial de Miacon y teoría de control automático.",
        mode: "demo",
      });
    }

    const client = new GoogleGenAI({ apiKey });
    const systemInstruction = loadSystemInstruction();

    // Mantener el hilo de conversación en la sesión activa
    const formattedInput =
      !previousInteractionId && messages.length > 1
        ? messages
            .map((m) => `${m.role === "user" ? "Usuario" : "Asistente Miacon"}: ${m.content}`)
            .join("\n\n")
        : lastUserMessage;

    // Modelos con respaldo ante picos de demanda (503 / 429)
    const candidateModels = Array.from(
      new Set([primaryModel, "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"])
    );

    let interaction: any = null;
    let lastError: any = null;

    for (const candidateModel of candidateModels) {
      try {
        interaction = await client.interactions.create({
          model: candidateModel,
          input: formattedInput,
          system_instruction: systemInstruction,
          ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
        });
        break;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "");
        const isHighDemand =
          msg.includes("503") ||
          msg.includes("429") ||
          msg.toLowerCase().includes("high demand") ||
          msg.toLowerCase().includes("overloaded");

        if (!isHighDemand) {
          throw err;
        }
        console.warn(
          `Modelo ${candidateModel} con alta demanda (503/429), reintentando con modelo de respaldo...`
        );
      }
    }

    if (!interaction) {
      throw lastError || new Error("El servicio de IA está experimentando alta demanda temporal.");
    }

    // Limpiar bloques de código que violen las directivas de formato
    const cleanReply = (interaction.output_text || "No se pudo obtener una respuesta del asistente en este momento.")
      .replace(/```[\s\S]*?```/g, "")
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
