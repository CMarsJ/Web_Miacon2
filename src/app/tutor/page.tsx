"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import {
  Bot,
  User,
  Send,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Wrench,
  Activity,
} from "lucide-react";
import FormattedMathText from "@/components/chat/FormattedMathText";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isDemo?: boolean;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  {
    label: "Oscilación en la planta",
    prompt: "¿Por qué la salida del sistema oscila demasiado al subir la ganancia proporcional Kp y cómo lo corrijo?",
    icon: Activity,
  },
  {
    label: "Fallo de conexión MQTT",
    prompt: "El panel de laboratorio aparece desconectado y no recibe datos del módulo MIACON 2.0, ¿qué debo revisar?",
    icon: Wrench,
  },
  {
    label: "Error en estado estacionario",
    prompt: "¿Cómo actúa la acción integral para eliminar el error en estado estacionario sin volver inestable el lazo?",
    icon: HelpCircle,
  },
  {
    label: "Ruido en el sensor",
    prompt: "La señal medida tiene mucho ruido y la acción derivativa satura el actuador, ¿qué me recomiendas hacer?",
    icon: Sparkles,
  },
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interactionId, setInteractionId] = useState<string | undefined>(undefined);
  const [connectionMode, setConnectionMode] = useState<"ready" | "live" | "demo">("ready");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: formatTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) {
      setInput("");
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          previousInteractionId: interactionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error al procesar la consulta con el Tutor.");
      }

      if (data.interactionId) {
        setInteractionId(data.interactionId);
      }

      if (data.mode === "demo") {
        setConnectionMode("demo");
      } else if (data.mode === "live") {
        setConnectionMode("live");
      }

      const assistantMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: formatTime(),
        isDemo: data.mode === "demo",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          err?.message ||
          "No fue posible conectar con el asistente en este momento. Intenta nuevamente en unos segundos.",
        timestamp: formatTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInteractionId(undefined);
    setInput("");
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-dot-matrix pt-28 pb-16 px-4 sm:px-6 flex flex-col items-center">
      {/* Encabezado compacto */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-primary text-xs font-mono-data font-semibold mb-2.5">
            <Bot className="w-3.5 h-3.5" />
            <span>ASISTENTE DE DIAGNÓSTICO Y TEORÍA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Tutor <span className="text-primary">MIACON 2.0</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Resuelve dudas conceptuales de control automático o diagnostica fallos durante tus prácticas de laboratorio.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleResetChat}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-navy hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            title="Limpiar conversación actual"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar chat</span>
          </button>
        )}
      </div>

      {/* Contenedor tipo consola técnica centrada (sin barra lateral) */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col h-[68vh] min-h-[520px] max-h-[760px]">
        {/* Barra superior de estado de la consola */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-data uppercase tracking-wider text-slate-200 font-semibold">
                  CONSOLA DE CONSULTA TÉCNICA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sesión temporal activa • Sin almacenamiento de historial lateral
              </p>
            </div>
          </div>

          {/* Indicador de estado */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono-data">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionMode === "demo"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-emerald-400 animate-pulse"
              }`}
            />
            <span className="text-slate-300 text-[11px]">
              {connectionMode === "demo"
                ? "MODO VISTA PREVIA (SIN API KEY)"
                : "GOOGLE AI STUDIO • LISTO"}
            </span>
          </div>
        </div>

        {/* Área central de mensajes con scroll interno fijo */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary mb-4 shadow-2xs">
                <Bot className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-navy mb-1.5">
                ¿En qué te puedo orientar hoy?
              </h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Escribe tu duda sobre sintonización PID, comportamiento de la planta o posibles fallos de instrumentación en el módulo MIACON 2.0. Recuerda que soy un asistente conceptual y de diagnóstico, por lo que te guiaré paso a paso sin generar código por ti.
              </p>

              {/* Chips de preguntas rápidas */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {QUICK_PROMPTS.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="group p-3.5 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-300 transition-all text-left flex items-start gap-3 shadow-2xs cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-primary flex items-center justify-center shrink-0 transition-colors mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy group-hover:text-primary transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-secondary line-clamp-2 mt-0.5 leading-snug">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isUser
                          ? "bg-navy text-white"
                          : msg.isError
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-blue-50 text-primary border border-blue-200/80"
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : msg.isError ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Burbuja de texto */}
                    <div
                      className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? "bg-primary text-white rounded-tr-xs"
                          : msg.isError
                          ? "bg-red-50 text-red-800 border border-red-200 rounded-tl-xs"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words font-sans">
                          {msg.content}
                        </p>
                      ) : (
                        <FormattedMathText content={msg.content} />
                      )}
                      <div
                        className={`mt-1.5 flex items-center justify-end gap-2 text-[10px] font-mono-data ${
                          isUser ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {msg.isDemo && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            DEMO (Configura GEMINI_API_KEY en Vercel)
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Indicador de respuesta en curso */}
              {isLoading && (
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" />
                    </div>
                    <span className="text-xs font-mono-data text-slate-500">
                      Analizando consulta...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Barra inferior de escritura */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3.5 sm:p-4 bg-white border-t border-slate-200/90"
        >
          <div className="flex items-end gap-2.5 bg-slate-50 border border-slate-200/90 focus-within:border-primary focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-500/10 rounded-2xl px-3.5 py-2.5 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Describe el fallo que observas en la planta o escribe tu duda conceptual..."
              className="w-full h-auto min-h-[1.5lh] max-h-[6lh] [field-sizing:content] resize-none bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none disabled:opacity-60 leading-relaxed"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-magnetic h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
              aria-label="Enviar consulta"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 px-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono-data text-[10px]">Enter</kbd> para enviar o <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono-data text-[10px]">Shift + Enter</kbd> para salto de línea.
            </span>
            <span className="hidden sm:inline font-mono-data">
              Solo respuestas de orientación y diagnóstico
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
