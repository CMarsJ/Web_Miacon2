"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Check,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  Gauge,
  KeyRound,
  Layers,
  Lock,
  Play,
  Radio,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";

type TrackType = "control1" | "control2" | "avanzado";

interface LabItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  status: "available" | "locked";
  time: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado" | "Competencia";
  path: string;
  badge: string;
  isCompetition?: boolean;
  tags?: string[];
}

export default function Laboratorios() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<TrackType>("control1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("miacon_completed_labs");
      if (saved) {
        try {
          setCompletedLabs(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const markAsCompleted = (trackId: string, labId: number) => {
    const key = `${trackId}-${labId}`;
    setCompletedLabs((prev) => {
      const newSet = new Set(prev);
      newSet.add(key);
      if (typeof window !== "undefined") {
        localStorage.setItem("miacon_completed_labs", JSON.stringify([...newSet]));
      }
      return newSet;
    });
  };

  const isCompleted = (trackId: string, labId: number) =>
    completedLabs.has(`${trackId}-${labId}`);

  const trackConfigs = {
    control1: {
      name: "Control 1: Principiantes",
      tagline: "Fundamentos y Regulación de Temperatura",
      badge: "Principiante",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      accent: "from-blue-700 to-blue-800",
      description:
        "Ruta diseñada para estudiantes de Control 1. Aborda la práctica de armado inicial adaptada a sensores térmicos, modelado en MATLAB, control de temperatura y la competencia final de regulación.",
      labs: [
        {
          id: 0,
          title: "Construcción y Comprobación Térmica",
          subtitle: "Hardware Miacon • Módulo de Temperatura",
          description:
            "Ensamblaje del circuito térmico, acondicionamiento de termistores/sensores y comprobación de lazo abierto con el microcontrolador.",
          status: "available",
          time: "45 min",
          difficulty: "Básico",
          path: "/laboratorios/lab0",
          badge: "Práctica Inicial",
          tags: ["🛠️ Hardware", "⚡ Termistor", "💻 Arduino IDE"]
        },
        {
          id: 1,
          title: "Modelado y Simulación en MATLAB",
          subtitle: "Identificación de Función de Transferencia Térmica",
          description:
            "Adquisición de la curva de calentamiento en lazo abierto, cálculo de la constante de tiempo (tau) y diseño del controlador en Simulink.",
          status: "locked",
          time: "60 min",
          difficulty: "Básico",
          path: "#",
          badge: "Próximamente",
          tags: ["💻 MATLAB", "📊 Simulink", "📈 Curva Reacción"]
        },
        {
          id: 2,
          title: "Control de Temperatura en Tiempo Real",
          subtitle: "Implementación PID y Rechazo de Perturbaciones",
          description:
            "Sintonización de ganancias en hardware real para mantener la temperatura objetivo frente a variaciones de ventilación externa.",
          status: "locked",
          time: "75 min",
          difficulty: "Intermedio",
          path: "#",
          badge: "Próximamente",
          tags: ["⚙️ PID Térmico", "🛠️ Hardware", "🔥 PWM"]
        },
        {
          id: 3,
          title: "Competencia: Regulación Térmica",
          subtitle: "Módulo Docente • Telemetría Grupal",
          description:
            "Módulo de evaluación y competencia para profesores. Envío de setpoint en vivo a todos los equipos y evaluación de rapidez y estabilidad térmica.",
          status: "available",
          time: "40 min",
          difficulty: "Competencia",
          path: "/laboratorios/competencia?track=control1",
          badge: "Módulo de Competencia",
          isCompetition: true,
          tags: ["📡 MQTT", "🏆 Ranking en Vivo", "👨‍🏫 Docente"]
        },
      ] as LabItem[],
    },
    control2: {
      name: "Control 2: Intermedios",
      tagline: "Sistemas Dinámicos, Velocidad y Movimiento",
      badge: "Intermedio",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accent: "from-blue-700 to-blue-800",
      description:
        "Ruta orientada a Control 2. Enfocada en la dinámica electromecánica con motor DC, encoder de cuadratura, análisis en espacio de estados en MATLAB y competencia de velocidad y movimiento.",
      labs: [
        {
          id: 0,
          title: "Construcción y Comprobación Electromecánica",
          subtitle: "Hardware Miacon • Motor DC & Encoder",
          description:
            "Ensamblaje del puente H de potencia, alineación del encoder de cuadratura y validación de lectura de pulsos y PWM.",
          status: "available",
          time: "45 min",
          difficulty: "Básico",
          path: "/laboratorios/lab0",
          badge: "Práctica Inicial",
          tags: ["🛠️ Hardware", "⚙️ Motor DC", "⚡ Encoder"]
        },
        {
          id: 1,
          title: "Espacio de Estados y Respuesta Temporal en MATLAB",
          subtitle: "Modelado Matemático Dinámico",
          description:
            "Formulación de ecuaciones de estado del motor DC, análisis de polos y ceros, y simulación de respuesta al escalón.",
          status: "locked",
          time: "60 min",
          difficulty: "Intermedio",
          path: "#",
          badge: "Próximamente",
          tags: ["💻 MATLAB", "📐 Espacio Estados", "📊 Simulink"]
        },
        {
          id: 2,
          title: "Control de Velocidad y Movimiento",
          subtitle: "Algoritmos PID y Seguimiento de Trayectorias",
          description:
            "Implementación de control de velocidad en RPM y control de ángulo/posición con compensación de fricción y carga.",
          status: "locked",
          time: "90 min",
          difficulty: "Avanzado",
          path: "#",
          badge: "Próximamente",
          tags: ["⚙️ PID Velocidad", "🛠️ Hardware", "🔄 RPM"]
        },
        {
          id: 3,
          title: "Competencia: Velocidad y Movimiento",
          subtitle: "Módulo Docente • Telemetría Grupal",
          description:
            "Competencia en vivo de seguimiento de consigna de velocidad y asentamiento ante cambios de setpoint enviados por el profesor.",
          status: "available",
          time: "45 min",
          difficulty: "Competencia",
          path: "/laboratorios/competencia?track=control2",
          badge: "Módulo de Competencia",
          isCompetition: true,
          tags: ["📡 MQTT", "🏆 Ranking en Vivo", "👨‍🏫 Docente"]
        },
      ] as LabItem[],
    },
    avanzado: {
      name: "Avanzado: MIACON Completo",
      tagline: "Plataforma Integral Multivariable",
      badge: "Avanzado",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "from-purple-700 to-blue-800",
      description:
        "La experiencia completa de Miacon 2.0. Integra simultáneamente lazo térmico y electromecánico, modelado multivariable en MATLAB y la gran competencia final integral.",
      labs: [
        {
          id: 0,
          title: "Construcción Integral MIACON 2.0",
          subtitle: "Ensamble Completo • Sensores & Actuadores",
          description:
            "Integración física completa de todos los módulos: potencia, motor DC, encoder, resistencia calefactora y sensores térmicos.",
          status: "available",
          time: "60 min",
          difficulty: "Básico",
          path: "/laboratorios/lab0",
          badge: "Práctica Inicial",
          tags: ["🛠️ Full Hardware", "⚡ Térmico + Motor", "💻 Setup"]
        },
        {
          id: 1,
          title: "Identificación Multivariable en MATLAB",
          subtitle: "Modelos MIMO y Acoplamientos Cruzados",
          description:
            "Análisis de interacción entre subsistemas, desacoplamiento de lazos y optimización de controladores avanzados.",
          status: "locked",
          time: "75 min",
          difficulty: "Avanzado",
          path: "#",
          badge: "Próximamente",
          tags: ["💻 MATLAB MIMO", "📊 Desacoplamiento"]
        },
        {
          id: 2,
          title: "Control de Temperatura en Tiempo Real",
          subtitle: "Lazo Térmico Miacon",
          description:
            "Calibración y sintonización PID para el control térmico de precisión con monitoreo en vivo.",
          status: "locked",
          time: "60 min",
          difficulty: "Avanzado",
          path: "#",
          badge: "Próximamente",
          tags: ["⚙️ PID Térmico", "🔥 PWM"]
        },
        {
          id: 3,
          title: "Control de Velocidad y Movimiento",
          subtitle: "Lazo Electromecánico Miacon",
          description:
            "Control de alta precisión para seguimiento de perfiles dinámicos de velocidad y posicionamiento angular.",
          status: "locked",
          time: "75 min",
          difficulty: "Avanzado",
          path: "#",
          badge: "Próximamente",
          tags: ["⚙️ PID Motor", "🔄 Encoder"]
        },
        {
          id: 4,
          title: "Competencia: MIACON Integral Multivariable",
          subtitle: "Módulo Docente • Gran Competencia Grupal",
          description:
            "Desafío integral multivariable para profesores: transmisión de setpoints combinados, control simultáneo y evaluación del podio dinámico.",
          status: "available",
          time: "60 min",
          difficulty: "Competencia",
          path: "/laboratorios/competencia?track=avanzado",
          badge: "Módulo de Competencia",
          isCompetition: true,
          tags: ["📡 MQTT Multivariable", "🏆 Gran Podio", "👨‍🏫 Docente"]
        },
      ] as LabItem[],
    },
  };

  const currentTrack = trackConfigs[selectedTrack];

  const handleCompetitionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPasswordInput("");
    setIsModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === "Miacon2") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("miacon_prof_auth", "true");
      }
      setIsModalOpen(false);
      router.push(`/laboratorios/competencia?track=${selectedTrack}`);
    } else {
      setErrorMsg("Contraseña incorrecta. Por favor verifícala con el docente.");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-32 pb-16 space-y-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Retos de <span className="text-blue-700">MIACON</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Selecciona tu área técnica para desplegar la secuencia interactiva de prácticas.
          Tu progreso se guarda automáticamente en tu navegador. Cada ruta culmina con el módulo de <strong className="text-blue-800">Competencia Docente</strong>.
        </p>
      </div>

      {/* 3 TRACK SELECTOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono-tech">
            Paso 1: Selecciona tu Ruta de Especialización
          </h2>
          <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            3 Rutas Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Control 1 */}
          <button
            onClick={() => setSelectedTrack("control1")}
            className={`text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden group cursor-pointer ${selectedTrack === "control1"
              ? "bg-white border-blue-600 shadow-xl shadow-blue-900/10 ring-2 ring-blue-500/20 scale-[1.02]"
              : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Principiante • Control 1
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedTrack === "control1"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                  }`}
              >
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Fundamentos Térmicos
            </h3>
            <p className="text-xs text-blue-700 font-semibold mb-2 font-mono-tech">
              Armado + MATLAB + Temperatura
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enfocado en sistemas térmicos, adquisición de temperatura, modelado en MATLAB y competencia de regulación.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
              <span>4 Módulos en total</span>
              <span className={`font-bold flex items-center gap-1 ${selectedTrack === "control1" ? "text-blue-700" : "text-slate-400"}`}>
                {selectedTrack === "control1" ? "✓ Seleccionado" : "Seleccionar"}
              </span>
            </div>
          </button>

          {/* 2. Control 2 */}
          <button
            onClick={() => setSelectedTrack("control2")}
            className={`text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden group cursor-pointer ${selectedTrack === "control2"
              ? "bg-white border-blue-600 shadow-xl shadow-blue-900/10 ring-2 ring-blue-500/20 scale-[1.02]"
              : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Intermedio • Control 2
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedTrack === "control2"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                  }`}
              >
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Control Electromecánico
            </h3>
            <p className="text-xs text-blue-700 font-semibold mb-2 font-mono-tech">
              Motor DC + Espacio Estados + Velocidad
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enfocado en control cinemático, encoder de cuadratura, espacio de estados y competencia de velocidad y posición.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
              <span>4 Módulos en total</span>
              <span className={`font-bold flex items-center gap-1 ${selectedTrack === "control2" ? "text-blue-700" : "text-slate-400"}`}>
                {selectedTrack === "control2" ? "✓ Seleccionado" : "Seleccionar"}
              </span>
            </div>
          </button>

          {/* 3. Avanzado */}
          <button
            onClick={() => setSelectedTrack("avanzado")}
            className={`text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden group cursor-pointer ${selectedTrack === "avanzado"
              ? "bg-white border-blue-600 shadow-xl shadow-blue-900/10 ring-2 ring-blue-500/20 scale-[1.02]"
              : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Avanzado • MIACON Total
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedTrack === "avanzado"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                  }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Integración Multivariable
            </h3>
            <p className="text-xs text-blue-700 font-semibold mb-2 font-mono-tech">
              Térmico + Dinámico + Multivariable
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Plataforma integral con todos los lazos activos, identificación MIMO en MATLAB y competencia integral multivariable.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
              <span>5 Módulos en total</span>
              <span className={`font-bold flex items-center gap-1 ${selectedTrack === "avanzado" ? "text-blue-700" : "text-slate-400"}`}>
                {selectedTrack === "avanzado" ? "✓ Seleccionado" : "Seleccionar"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* TRACK DESCRIPTION BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentTrack.badgeColor}`}>
              {currentTrack.badge}
            </span>
            <h3 className="text-lg font-black">{currentTrack.name}</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {currentTrack.description}
          </p>
        </div>
        <div className="text-right whitespace-nowrap">
          <span className="text-xs font-mono-tech text-blue-400 font-bold block">
            {currentTrack.labs.length} Etapas en la Línea
          </span>
          <span className="text-[11px] text-slate-400">Incluye Competencia Docente</span>
        </div>
      </div>

      {/* DYNAMIC TIMELINE PATH */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono-tech">
          Paso 2: Línea de Tiempo de Prácticas
        </h2>

        <div className="relative">
          {/* Central Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-1 md:-ml-0.5 bg-gradient-to-b from-blue-700 via-blue-500 to-blue-900 rounded-full z-0 shadow-sm" />

          <div className="space-y-12 relative z-10">
            {currentTrack.labs.map((lab, index) => {
              const isEven = index % 2 === 0;
              const isLocked = lab.status === "locked";
              const isAvailable = lab.status === "available";
              const isComp = lab.isCompetition;
              const completed = isCompleted(selectedTrack, lab.id);

              return (
                <div
                  key={`${selectedTrack}-${lab.id}`}
                  className={`flex flex-col md:flex-row items-start md:items-center w-full gap-6 md:gap-0 ${isEven ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Lab Card */}
                  <div
                    className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pl-12 md:text-left" : "md:pr-12 md:text-left"
                      }`}
                  >
                    <div
                      className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${isComp
                        ? "glass-panel bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white border-blue-500 shadow-2xl shadow-blue-950/50 hover:scale-[1.01]"
                        : completed
                          ? "glass-panel bg-white border-blue-500 shadow-xl shadow-blue-900/5 hover:-translate-y-1"
                          : isAvailable
                            ? "glass-panel bg-white border-blue-200 shadow-xl shadow-blue-900/5 hover:border-blue-600 hover:-translate-y-1"
                            : "bg-white/60 border-slate-200/80 opacity-60"
                        }`}
                    >
                      {/* Decorative gradient blob */}
                      {isComp ? (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-bl-full pointer-events-none blur-xl" />
                      ) : isAvailable ? (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
                      ) : null}

                      {/* Header Meta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-xs font-mono-tech font-black px-2.5 py-1 rounded-lg border ${isComp
                            ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                            : completed
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                        >
                          {isComp ? "COMPETENCIA FINAL" : `LAB 0${lab.id}`}
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`flex items-center gap-1 font-medium ${isComp ? "text-slate-300" : "text-slate-500"
                              }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {lab.time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isComp
                              ? "bg-amber-400 text-slate-950 font-black"
                              : lab.difficulty === "Básico"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : lab.difficulty === "Intermedio"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                          >
                            {lab.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3
                        className={`text-xl font-black mb-1 ${isComp ? "text-white" : "text-slate-900"
                          }`}
                      >
                        {lab.title}
                      </h3>
                      <p
                        className={`text-xs font-semibold mb-2 font-mono-tech ${isComp ? "text-blue-300" : "text-blue-700"
                          }`}
                      >
                        {lab.subtitle}
                      </p>
                      <p
                        className={`text-xs leading-relaxed mb-4 ${isComp ? "text-slate-300" : "text-slate-600"
                          }`}
                      >
                        {lab.description}
                      </p>

                      {/* Tool Chips */}
                      {lab.tags && lab.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {lab.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isComp
                                ? "bg-slate-800/80 text-blue-300 border-slate-700"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {isComp ? (
                        <button
                          onClick={handleCompetitionClick}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all cursor-pointer"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Acceso Docente a Competencia</span>
                          <Lock className="w-3.5 h-3.5 opacity-70" />
                        </button>
                      ) : isLocked ? (
                        <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5" />
                          Completar Prácticas Anteriores
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            href={lab.path}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-200 hover:shadow-lg transition-all"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            Comenzar Laboratorio
                          </Link>

                          {!completed ? (
                            <button
                              onClick={() => markAsCompleted(selectedTrack, lab.id)}
                              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Marcar como Completado</span>
                            </button>
                          ) : (
                            <div className="w-full py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>¡Completado! (Guardado)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Central Milestone Node */}
                  <div
                    className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-20 ${isComp
                      ? "bg-amber-400 border-amber-200 text-slate-900"
                      : completed
                        ? "bg-blue-600 border-blue-200 text-white shadow-blue-200"
                        : isAvailable
                          ? "bg-white border-blue-200 animate-pulse-node"
                          : "bg-white border-slate-200"
                      }`}
                  >
                    {isComp ? (
                      <Trophy className="w-5 h-5 text-slate-900" />
                    ) : completed ? (
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    ) : isAvailable ? (
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60"></span>
                        <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[10px] font-black shadow">
                          {lab.id}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
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

      {/* PASSWORD AUTH MODAL FOR PROFESSORS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 p-7 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Acceso a Módulo de Competencia
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Este panel es de uso exclusivo para docentes. Ingresa la clave de acceso para gestionar setpoints y telemetría de equipos.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contraseña de Docente
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Ingresa la contraseña..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 font-semibold mt-1.5">
                    {errorMsg}
                  </p>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs text-blue-800">
                <span className="font-semibold">Ruta Destino:</span>
                <span className="font-mono-tech font-bold uppercase">{selectedTrack}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ingresar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
