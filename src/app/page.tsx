"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Eye,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Play,
  Radio,
  Sliders,
  Sparkles,
  Target,
  Trophy,
  Wifi,
  Wrench,
  GraduationCap,
  Zap,
} from "lucide-react";

interface ComponentInfo {
  id: string;
  name: string;
  category: string;
  tag: string;
  icon: any;
  color: string;
  badgeBg: string;
  pos: { top: string; left: string };
  specs: string;
  role: string;
}

const HARDWARE_COMPONENTS: ComponentInfo[] = [
  {
    id: "micro",
    name: "Microcontrolador & Puerto Serie",
    category: "Procesamiento & Comunicaciones",
    tag: "Controlador Digital",
    icon: Cpu,
    color: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    pos: { top: "35%", left: "48%" },
    specs: "Procesador de 32 bits a alta frecuencia, conversores ADC de 12 bits y enlace serial de baja latencia.",
    role: "Ejecuta los algoritmos de control PID en tiempo determinístico y transmite variables de proceso en vivo.",
  },
  {
    id: "motor",
    name: "Motor DC & Encoder Óptico",
    category: "Actuador Electromecánico",
    tag: "Lazo de Movimiento",
    icon: Gauge,
    color: "text-cyan-600",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    pos: { top: "60%", left: "28%" },
    specs: "Motor de corriente continua con caja reductora y disco de encoder de cuadratura de alta resolución.",
    role: "Permite experimentar control de velocidad (RPM) y posicionamiento angular con rechazo a fricción y carga.",
  },
  {
    id: "power",
    name: "Puente H & Etapa de Potencia",
    category: "Electrónica de Potencia",
    tag: "Driver PWM",
    icon: Zap,
    color: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    pos: { top: "52%", left: "68%" },
    specs: "Drivers MOSFET con aislamiento y modulación por ancho de pulsos (PWM) hasta 20 kHz.",
    role: "Modula la energía entregada al motor y los elementos calefactores con máxima eficiencia térmica.",
  },
  {
    id: "temp",
    name: "Sensor Térmico & Calefactor",
    category: "Proceso Térmico",
    tag: "Lazo de Temperatura",
    icon: Flame,
    color: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    pos: { top: "25%", left: "75%" },
    specs: "Sensor de temperatura de precisión rápida acoplado a un resistor disipador de calentamiento controlado.",
    role: "Permite modelar sistemas térmicos de primer orden con retardo y sintonizar regulación estable.",
  },
  {
    id: "iot",
    name: "Conectividad IoT & Telemetría",
    category: "Nube & Redes",
    tag: "Telemetría MQTT",
    icon: Radio,
    color: "text-purple-600",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    pos: { top: "18%", left: "30%" },
    specs: "Protocolo MQTT sobre WebSockets con publicación en tiempo real de estados y recepción de setpoints.",
    role: "Sincroniza la planta física con la plataforma web para competencias grupales y monitoreo docente en vivo.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    tag: "Fase 01: Hardware",
    title: "Conexión y Verificación de la Planta",
    icon: Cpu,
    summary:
      "Ensamble guiado del hardware, verificación del puente H, alineación del encoder y validación del enlace serial con el microcontrolador.",
    details:
      "Aprende cómo interactúan las etapas de potencia, sensado y control físico sin riesgos de sobrecarga gracias al diagnóstico inicial guiado.",
    metricLabel: "Frecuencia de Muestreo",
    metricValue: "1000 Hz (1 ms)",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    activeColor: "from-blue-700 to-blue-800",
    flow: [
      { name: "Plataforma Miacon", sub: "Hardware Físico" },
      { name: "Enlace Serial / USB", sub: "Lectura ADC" },
      { name: "Suite Web Miacon", sub: "Verificación en Vivo" },
    ],
  },
  {
    step: "02",
    tag: "Fase 02: Modelado",
    title: "Modelado Matemático & MATLAB",
    icon: Layers,
    summary:
      "Captura de curvas de reacción en lazo abierto ante escalones para estimar la función de transferencia y diseñar controladores en Simulink.",
    details:
      "Calcula con datos reales la ganancia estática (K), la constante de tiempo (τ) y el tiempo muerto (θ) para validar modelos teóricos.",
    metricLabel: "Identificación de Modelo",
    metricValue: "1er y 2do Orden",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    activeColor: "from-blue-600 to-blue-700",
    flow: [
      { name: "Escalón u(t)", sub: "Lazo Abierto" },
      { name: "Curva y(t)", sub: "Captura de Datos" },
      { name: "Función G(s)", sub: "MATLAB & Simulink" },
    ],
  },
  {
    step: "03",
    tag: "Fase 03: Control PID",
    title: "Sintonización PID en Tiempo Real",
    icon: Sliders,
    summary:
      "Calibra ganancias Proporcional (Kp), Integral (Ki) y Derivativa (Kd) observando al instante el sobrepaso y el tiempo de establecimiento.",
    details:
      "Comprende de forma intuitiva el compromiso entre velocidad de respuesta y estabilidad dinámica mientras el hardware responde frente a ti.",
    metricLabel: "Tiempo de Respuesta",
    metricValue: "Sub-segundo",
    badgeColor: "bg-green-50 text-green-700 border-green-200",
    activeColor: "from-green-600 to-emerald-600",
    flow: [
      { name: "Setpoint r(t)", sub: "Referencia Deseada" },
      { name: "Controlador PID", sub: "Acción de Control u(t)" },
      { name: "Planta Física", sub: "Motor / Temperatura" },
    ],
  },
  {
    step: "04",
    tag: "Fase 04: Telemetría IoT",
    title: "Telemetría en Vivo & Competencias",
    icon: Radio,
    summary:
      "Transmisión de telemetría por protocolo MQTT hacia la nube. Habilita competencias grupales y monitoreo docente centralizado.",
    details:
      "El profesor transmite consignas en tiempo real a todas las plantas conectadas y la plataforma calcula automáticamente el podio dinámico según estabilidad y rapidez.",
    metricLabel: "Protocolo de Red",
    metricValue: "MQTT / WebSockets",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    activeColor: "from-purple-600 to-blue-700",
    flow: [
      { name: "Consigna Docente", sub: "Setpoint Remoto" },
      { name: "Broker MQTT", sub: "Telemetría Grupal" },
      { name: "Podio Dinámico", sub: "Ranking en Tiempo Real" },
    ],
  },
];

export default function Home() {
  const [selectedCompId, setSelectedCompId] = useState<string>("micro");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeComponent =
    HARDWARE_COMPONENTS.find((c) => c.id === selectedCompId) ||
    HARDWARE_COMPONENTS[0];
  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <div className="space-y-24 py-8 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1600px] mx-auto">
      {/* 1. HERO SECTION: MOTIVATION + MIACON HARDWARE WITH INTERACTIVE HOTSPOTS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center pt-2">
        {/* Left Column: Vision & CTAs */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Aprende Teoría de Control{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
              de forma visual e interactiva
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Construye tu propio controlador. Valida tu modelo. Compite en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link
              href="/laboratorios"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold rounded-2xl text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Explorar Laboratorios
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/aprendizaje"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold rounded-2xl border border-blue-700 text-blue-700 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Teoría
            </Link>
          </div>

          {/* ¿Qué es MIACON 2.0? — 3-column card grid */}
          <div className="pt-8 border-t border-slate-200/80">
            <div className="text-center lg:text-left mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ¿Qué es <span className="text-blue-700">MIACON 2.0</span>?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Un ecosistema completo de aprendizaje activo para ingeniería de control
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {/* Tarjeta 1: Arma */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: "#1E40AF" }}>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-sm">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Arma tu Plataforma</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ensambla el hardware guiado paso a paso. Conecta el circuito, verifica sensores y activa el microcontrolador.
                </p>
              </div>
              {/* Tarjeta 2: Aprende */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: "#1E40AF" }}>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Aprende con Simulaciones</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Domina la teoría de control con simulaciones interactivas de lazos P, PI y PID en tiempo real.
                </p>
              </div>
              {/* Tarjeta 3: Aplica */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: "#16A34A" }}>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 shadow-sm">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Aplica y Compite</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pon a prueba tu controlador en competencias reales con telemetría IoT y ranking dinámico en vivo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Centerpiece (Hardware Image + Interactive Hotspots) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-blue-100/90 shadow-xl bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-mono font-bold text-slate-800 uppercase tracking-wide">
                  Plataforma Física Miacon 2.0
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                Selecciona los puntos para explorar
              </span>
            </div>

            {/* Hardware Showcase with Hotspot Overlays */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-inner group">
              <Image
                src="/miacon.png"
                alt="Plataforma de Control Miacon 2.0"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />

              {/* Interactive Hotspot Pins */}
              {HARDWARE_COMPONENTS.map((comp) => {
                const isSelected = selectedCompId === comp.id;
                const CompIcon = comp.icon;

                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    style={{ top: comp.pos.top, left: comp.pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin transition-all duration-200 cursor-pointer ${
                      isSelected ? "scale-110 z-30" : "hover:scale-105"
                    }`}
                    title={comp.name}
                  >
                    <span className="relative flex items-center justify-center">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-700 border-white text-white ring-4 ring-blue-500/40 shadow-blue-500/30"
                            : "bg-slate-900/90 border-white/90 text-blue-300 hover:bg-blue-700 hover:text-white hover:ring-4 hover:ring-blue-400/30"
                        }`}
                      >
                        <CompIcon className="w-3.5 h-3.5" />
                      </span>
                    </span>

                    {/* Tooltip Badge */}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-700">
                      {comp.tag}
                    </span>
                  </button>
                );
              })}

              {/* Bottom Card Overlay inside image */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm">
                    <activeComponent.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight text-xs">
                      {activeComponent.name}
                    </p>
                    <p className="text-[10px] text-blue-300 font-mono">
                      {activeComponent.category}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-1 rounded-md text-slate-300">
                  {activeComponent.tag}
                </span>
              </div>
            </div>

            {/* Component Selector Chips */}
            <div className="pt-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Explora los Módulos de la Planta:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HARDWARE_COMPONENTS.map((comp) => {
                  const isSelected = selectedCompId === comp.id;
                  const Icon = comp.icon;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-400 text-blue-900 shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${comp.color} shrink-0`} />
                      <span className="truncate">{comp.tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Component Detailed Role Box */}
              <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {activeComponent.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeComponent.badgeBg}`}>
                    {activeComponent.category}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeComponent.specs}
                </p>
                <p className="text-blue-950 font-medium text-[11px] pt-1 border-t border-slate-200/60">
                  <strong>Rol en el Control:</strong> {activeComponent.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED SECTION: METODOLOGÍA -> PASO A PASO INTERACTIVO */}
      <section className="py-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 rounded-full">
              Metodología de Experimentación
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Del Modelo Teórico al <span className="text-blue-700">Hardware en Red</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explora a continuación el recorrido integral de 4 etapas que conecta la adquisición de datos, el modelado en MATLAB, la sintonización PID y la telemetría en tiempo real.
            </p>
          </div>

          {/* 4 Interactive Steps Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? "bg-white border-blue-700 shadow-lg shadow-blue-100 scale-[1.02]"
                      : "bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-slate-400">
                      {step.step}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                      }`}
                    >
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-snug mb-1">
                    {step.title.split("&")[0]}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {step.tag}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Showcase Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Step Information */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30">
                    {activeStep.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Paso {activeStep.step} de 04
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {activeStep.title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeStep.summary}
                </p>

                <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-blue-300">
                    Enfoque Práctico & Metodología:
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {activeStep.details}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {activeStep.metricLabel}
                    </p>
                    <p className="text-lg font-black text-blue-400 font-mono">
                      {activeStep.metricValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Signal Flow Diagram */}
              <div className="lg:col-span-5 space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 text-center pb-2 border-b border-slate-800">
                  Flujo Operativo de la Etapa {activeStep.step}
                </h4>

                <div className="space-y-2 pt-2 font-mono text-xs">
                  {activeStep.flow.map((node, i) => (
                    <div key={node.name}>
                      <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-center flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold">
                          0{i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs">{node.name}</p>
                          <p className="text-[10px] text-blue-300">{node.sub}</p>
                        </div>
                        <span className="w-3" />
                      </div>
                      {i < activeStep.flow.length - 1 && (
                        <div className="text-center text-slate-500 py-0.5 text-xs">
                          ▼
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID: 4 PILLARS FOR ENGINEERS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Todo lo que necesitas para dominar control
          </h2>
          <p className="text-slate-600 text-sm">
            Diseñado para que los conceptos matemáticos complejos se comprendan de forma intuitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 glass-card-hover bg-white/80">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 mb-1">Módulos Teóricos</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fundamentos de lazo cerrado, polos y estabilidad explicados con tarjetas visuales dinámicas.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 glass-card-hover bg-white/80">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 shadow-sm">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 mb-1">Métricas en Vivo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cálculo automático de sobrepaso máximo (Mp), tiempo de subida (tr) y tiempo de asentamiento (ts).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 glass-card-hover bg-white/80">
            <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-4 shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 mb-1">3 Rutas de Laboratorio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secuencias de aprendizaje para Control 1 (Térmico), Control 2 (Velocidad) y Avanzado Multivariable.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 glass-card-hover bg-white/80">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 mb-1">Competencia Docente IoT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transmisión de consignas en vivo por MQTT, gráfica multi-equipo con zoom y podio automático.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BIFURCACIÓN DE CAMINOS: TEORÍA VS PRÁCTICA */}
      <section className="py-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 rounded-full">
              Rutas de Aprendizaje
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Elige tu modalidad de <span className="text-blue-700">formación</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tanto si necesitas afianzar la fundamentación matemática como validar un controlador en el banco de pruebas físico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Estudio Teórico */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 hover:border-blue-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono-tech text-blue-700 uppercase">Ruta Conceptual</span>
                  <h3 className="text-2xl font-black text-slate-900">Fundamentos & Simulación</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Interactúa con simulaciones en tiempo real para entender el efecto de las ganancias Kp, Ki, Kd, lazo abierto vs lazo cerrado, polos y estabilidad sin necesidad de hardware conectado.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    <span>Simulaciones con gráficas dinámicas paso a paso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    <span>Cálculo interactivo de sobrepaso Mp y tiempo ts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    <span>Guías de interpretación física de modelos dinámicos</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/aprendizaje"
                className="w-full py-3.5 px-6 rounded-xl border-2 border-blue-800 text-blue-800 hover:bg-blue-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Explorar Teoría Interactiva</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Ejecución Práctica */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 hover:border-green-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono-tech text-green-700 uppercase">Ruta Práctica ABR</span>
                  <h3 className="text-2xl font-black text-slate-900">Laboratorios & Competencia</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Aprende haciendo bajo la metodología de Aprendizaje Basado en Retos (ABR). Conecta la planta física, adquiere datos en MATLAB, sintoniza tu PID y compite en vivo.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>3 Rutas: Control 1 (Térmico), Control 2 (Velocidad) y Avanzado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Línea de tiempo de progreso guardada en tu navegador</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Módulo de competencia docente con ranking MQTT en vivo</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/laboratorios"
                className="w-full py-3.5 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-green-200 transition-colors"
              >
                <span>Ingresar a los Laboratorios</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
