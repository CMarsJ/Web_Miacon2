import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Cachear la base de conocimiento en memoria para no leer disco en cada petición
let cachedSystemInstruction: string | null = null;

function loadSystemInstruction(): string {
  if (cachedSystemInstruction) {
    return cachedSystemInstruction;
  }
  try {
    const filePath = path.join(process.cwd(), "Guias", "conocimiento.txt");
    if (fs.existsSync(filePath)) {
      cachedSystemInstruction = fs.readFileSync(filePath, "utf-8").trim();
      return cachedSystemInstruction;
    }
  } catch (err) {
    console.error("No se pudo leer Guias/conocimiento.txt:", err);
  }

  return `ROL Y PERSONALIDAD:
- Eres el Asistente Virtual Especializado del Proyecto Miacon y Sistemas de Control.
- Tono: Extremadamente amable, paciente, empático, profesional y educativo.
- Objetivo: Guiar al usuario con explicaciones claras, detalladas y fáciles de entender, adaptándose a su nivel técnico.
- LÍMITES ESTRICTOS: SOLO TEXTO, LISTAS Y FÓRMULAS LATEX ($...$ o $$...$$). PROHIBIDO GENERAR CÓDIGO (nada de Python, C++, MATLAB, etc.) ni imágenes o diagramas visuales. Si piden código, declina con cortesía y explica la teoría o lógica algorítmica con palabras.`;
}

// Función para ejecutar una llamada con límite de tiempo (timeout) para evitar esperas largas
async function createInteractionWithTimeout(
  client: GoogleGenAI,
  params: any,
  timeoutMs: number
) {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`TIMEOUT_${timeoutMs}MS`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      client.interactions.create(params),
      timeoutPromise,
    ]);
  } finally {
    clearTimeout(timeoutHandle!);
  }
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

    // Empezar directamente en el modelo ligero y estable (gemini-3.5-flash-lite)
    // para evitar errores 503 de alta demanda en gemini-3.8-flash
    const rawModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
    const primaryModel =
      rawModel.startsWith("gemini-2.") || rawModel.startsWith("gemini-1.")
        ? "gemini-3.5-flash-lite"
        : rawModel;

    // Modelo de respaldo configurable desde Vercel
    const customFallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim();

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

    // Cadena de modelos empezando directamente en el nivel ligero y estable:
    // 1. Modelo principal: gemini-3.5-flash-lite (equivalente actual y estable a la línea X.5, sin los picos 503 del 3.8)
    // 2. Respaldo inferior: gemini-3.1-flash-lite
    const candidateModels = Array.from(
      new Set(
        [
          primaryModel,
          customFallbackModel || "gemini-3.1-flash-lite",
        ].filter(Boolean)
      )
    );

    let interaction: any = null;
    let lastError: any = null;

    for (const candidateModel of candidateModels) {
      try {
        // Por defecto los modelos Gemini 3/4 usan thinking_level="high", lo que demora varios segundos extra.
        // Usamos thinking_level="low" para que responda mucho más rápido en el chat sin perder calidad.
        interaction = await createInteractionWithTimeout(
          client,
          {
            model: candidateModel,
            input: formattedInput,
            system_instruction: systemInstruction,
            generation_config: {
              thinking_level: "low",
            },
            ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
          },
          12000 // Si un modelo tarda más de 12s, salta automáticamente al modelo de respaldo
        );
        break;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "").toLowerCase();
        const status = Number(err?.status || err?.statusCode || 0);
        const shouldFallback =
          status === 429 ||
          status === 503 ||
          status === 500 ||
          status === 404 ||
          msg.includes("timeout_") ||
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("500") ||
          msg.includes("404") ||
          msg.includes("resource_exhausted") ||
          msg.includes("quota") ||
          msg.includes("rate limit") ||
          msg.includes("too many requests") ||
          msg.includes("high demand") ||
          msg.includes("overloaded") ||
          msg.includes("unavailable");

        if (!shouldFallback) {
          throw err;
        }
        console.warn(
          `Modelo ${candidateModel} alcanzó límite de cuota o alta demanda (${err?.message}), bajando al modelo de respaldo...`
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
          "Ocurrió un error al comunicarse con el servicio de IA. Verifica tu GEMINI_API_KEY en Vercel.",
      },
      { status: 500 }
    );
  }
}
