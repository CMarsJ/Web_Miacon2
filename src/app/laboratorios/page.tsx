import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  FlaskConical,
  Lock,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Laboratorios() {
  const labs = [
    {
      id: 0,
      title: "Construcción y Comprobación",
      subtitle: "Miacon 2.0 Hardware & Diagnostics",
      description:
        "Ensamblaje del puente H, conexión de sensores de encoder, alimentación del motor DC y validación del enlace serial con el microcontrolador.",
      status: "available", // 'completed', 'available', 'locked'
      time: "45 min",
      difficulty: "Básico",
      path: "/laboratorios/lab0",
      badge: "Módulo Inicial",
    },
    {
      id: 1,
      title: "Identificación de la Planta",
      subtitle: "Modelado Matemático del Motor DC",
      description:
        "Captura de datos en lazo abierto ante escalón y obtención de la función de transferencia de primer y segundo orden.",
      status: "locked",
      time: "60 min",
      difficulty: "Intermedio",
      path: "#",
      badge: "Próximamente",
    },
    {
      id: 2,
      title: "Sintonización y Control PID",
      subtitle: "Implementación en Hardware Real",
      description:
        "Cálculo de ganancias Kp, Ki, Kd mediante el método de Ziegler-Nichols y control de velocidad en tiempo real.",
      status: "locked",
      time: "90 min",
      difficulty: "Avanzado",
      path: "#",
      badge: "Próximamente",
    },
    {
      id: 3,
      title: "Control de Posición y Filtros",
      subtitle: "Rechazo de Perturbaciones",
      description:
        "Control de ángulo de precisión, filtrado de ruido en encoder y pruebas de carga externa.",
      status: "locked",
      time: "90 min",
      difficulty: "Avanzado",
      path: "#",
      badge: "Próximamente",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Ruta de Experimentación Práctica</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ruta de <span className="text-indigo-600">Laboratorios Miacon</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Sigue el camino secuencial de aprendizaje práctico. Comienza construyendo el hardware en el{" "}
          <strong className="text-indigo-700">Laboratorio 0</strong> para desbloquear las siguientes etapas de modelado y control avanzado.
        </p>
      </div>

      {/* Interactive Path Map */}
      <div className="relative">
        {/* Glowing Central Connector Line */}
        <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-1 md:-ml-0.5 bg-gradient-to-b from-indigo-500 via-cyan-400 to-slate-200 rounded-full z-0 shadow-sm" />

        <div className="space-y-12 relative z-10">
          {labs.map((lab, index) => {
            const isEven = index % 2 === 0;
            const isLocked = lab.status === "locked";
            const isAvailable = lab.status === "available";

            return (
              <div
                key={lab.id}
                className={`flex flex-col md:flex-row items-start md:items-center w-full gap-6 md:gap-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Lab Card Container */}
                <div
                  className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                    isEven ? "md:pl-12 md:text-left" : "md:pr-12 md:text-left"
                  }`}
                >
                  <div
                    className={`p-6 sm:p-7 rounded-3xl border-2 transition-all relative overflow-hidden ${
                      isAvailable
                        ? "glass-panel bg-white/95 border-indigo-300 shadow-xl shadow-indigo-100/80 hover:shadow-2xl hover:border-indigo-400 hover:-translate-y-1"
                        : "bg-white/60 border-slate-200/80 opacity-80"
                    }`}
                  >
                    {isAvailable && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
                    )}

                    {/* Meta Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        LAB 0{lab.id}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center text-slate-500 gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {lab.time}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            lab.difficulty === "Básico"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lab.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-1">
                      {lab.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mb-2">
                      {lab.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {lab.description}
                    </p>

                    {/* Action Button */}
                    {isLocked ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                        Completar Laboratorios Anteriores
                      </div>
                    ) : (
                      <Link
                        href={lab.path}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Comenzar Laboratorio
                      </Link>
                    )}
                  </div>
                </div>

                {/* Central Milestone Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white shadow-lg transition-transform hover:scale-110 z-20">
                  {isAvailable && (
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-indigo-400 opacity-60"></span>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white text-[10px] font-black shadow">
                        0
                      </div>
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
