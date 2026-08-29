"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  Sliders,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Aprendizaje() {
  // Active Card Tab
  const [activeTab, setActiveTab] = useState<number>(1);

  // Card 1 State: Fundamentos y Lazo
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [plantGain, setPlantGain] = useState<number>(1.0);
  const [loopDisturbance, setLoopDisturbance] = useState<number>(0.3);

  // Card 2 State: Control P
  const [kp_P, setKp_P] = useState<number>(2.5);

  // Card 3 State: Control PI
  const [kp_PI, setKp_PI] = useState<number>(2.0);
  const [ki_PI, setKi_PI] = useState<number>(1.2);

  // Card 4 State: Control PID
  const [kp_PID, setKp_PID] = useState<number>(3.0);
  const [ki_PID, setKi_PID] = useState<number>(1.5);
  const [kd_PID, setKd_PID] = useState<number>(0.8);

  // -------------------------------------------------------------
  // SIMULATION GENERATORS
  // -------------------------------------------------------------

  // 1. Data for Fundamentos y Lazo
  const generateLoopData = () => {
    return Array.from({ length: 40 }, (_, i) => {
      const t = i * 0.25;
      const target = 1.0;
      let output = 0;

      if (isClosedLoop) {
        // Closed loop: feedback rejects disturbance and approaches target
        const naturalResp = 1.0 - Math.exp(-t * 1.5 * plantGain);
        const distEffect = t > 4 ? loopDisturbance * Math.exp(-(t - 4) * 1.2) : 0;
        output = naturalResp + distEffect;
      } else {
        // Open loop: steady state depends strictly on gain and disturbance shifts output permanently
        const naturalResp = plantGain * 0.8 * (1.0 - Math.exp(-t * 1.0));
        const distEffect = t > 4 ? loopDisturbance : 0;
        output = naturalResp + distEffect;
      }

      return {
        time: t.toFixed(1),
        target,
        output: Number(Math.max(0, output).toFixed(3)),
        error: Number(Math.abs(target - output).toFixed(3)),
      };
    });
  };

  // 2. Data for Control P (First order with P controller: y(t) = (Kp / (1 + Kp)) * (1 - e^(-t(1+Kp)/Tau)))
  const generatePData = () => {
    const tau = 1.5;
    const closedLoopPole = (1 + kp_P) / tau;
    const finalVal = kp_P / (1 + kp_P); // Steady state error = 1 - finalVal

    return Array.from({ length: 40 }, (_, i) => {
      const t = i * 0.25;
      const target = 1.0;
      const output = finalVal * (1.0 - Math.exp(-t * closedLoopPole));
      return {
        time: t.toFixed(1),
        target,
        output: Number(output.toFixed(3)),
        error: Number((target - output).toFixed(3)),
      };
    });
  };

  // 3. Data for Control PI (Second order dynamics created by integral action)
  const generatePIData = () => {
    return Array.from({ length: 40 }, (_, i) => {
      const t = i * 0.25;
      const target = 1.0;
      // Damped harmonic oscillator with integral term driving error to 0
      const damping = Math.max(0.2, 1.8 - ki_PI * 0.4);
      const freq = Math.sqrt(Math.max(0.1, kp_PI * 1.5 + ki_PI * 0.8));
      const envelope = Math.exp(-damping * t * 0.9);
      const output = target - envelope * (Math.cos(freq * t) + (damping / freq) * Math.sin(freq * t));

      return {
        time: t.toFixed(1),
        target,
        output: Number(Math.max(0, output).toFixed(3)),
        error: Number(Math.abs(target - output).toFixed(3)),
      };
    });
  };

  // 4. Data for Control PID (Full 2nd order with derivative damping)
  const generatePIDData = () => {
    // Damping increases with Kd, frequency increases with Kp, Ki removes steady state
    const effectiveDamping = Math.max(0.1, 0.6 + kd_PID * 0.8 - ki_PID * 0.15);
    const naturalFreq = Math.sqrt(Math.max(0.2, kp_PID * 2.0));

    return Array.from({ length: 40 }, (_, i) => {
      const t = i * 0.25;
      const target = 1.0;
      const decay = Math.exp(-effectiveDamping * t * 1.2);
      const osc = Math.cos(naturalFreq * t) + (effectiveDamping / naturalFreq) * Math.sin(naturalFreq * t);
      const output = target - decay * osc;

      return {
        time: t.toFixed(1),
        target,
        output: Number(Math.max(0, output).toFixed(3)),
      };
    });
  };

  // Calculate live metrics for Card 4 (PID)
  const pidData = generatePIDData();
  const maxOutput = Math.max(...pidData.map((d) => d.output));
  const overshoot = Math.max(0, ((maxOutput - 1.0) / 1.0) * 100).toFixed(1);
  const riseTime = (1.8 / Math.sqrt(kp_PID * 2.0)).toFixed(2);
  const settlingTime = (4 / (Math.max(0.1, 0.6 + kd_PID * 0.8) * 1.2)).toFixed(2);

  // Cards metadata
  const topicCards = [
    {
      id: 1,
      title: "1. Fundamentos y Lazo",
      tag: "Conceptos Básicos",
      desc: "Comprende la diferencia fundamental entre el lazo abierto y el lazo cerrado ante perturbaciones.",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accentColor: "border-blue-500",
    },
    {
      id: 2,
      title: "2. Control Proporcional (P)",
      tag: "Acción Básica",
      desc: "Analiza el efecto de la ganancia Kp en la velocidad de respuesta y el error en estado estacionario.",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      accentColor: "border-amber-500",
    },
    {
      id: 3,
      title: "3. Control PI",
      tag: "Eliminación de Error",
      desc: "Descubre cómo la acción integral elimina el error permanente pero puede aumentar el sobreimpulso.",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      accentColor: "border-purple-500",
    },
    {
      id: 4,
      title: "4. Control PID Completo",
      tag: "Control Total",
      desc: "Sintoniza Kp, Ki y Kd en conjunto para lograr respuestas rápidas, estables y sin oscilaciones.",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accentColor: "border-emerald-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Módulos de Aprendizaje Interactivo</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Teoría de Control por <span className="text-indigo-600">Tarjetas Dinámicas</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Selecciona una tarjeta para interactuar con los simuladores en tiempo real y observar el comportamiento dinámico.
        </p>
      </div>

      {/* 4 TOPIC CARDS SELECTOR GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topicCards.map((card) => {
          const isSelected = activeTab === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border-2 ${
                isSelected
                  ? `glass-panel ${card.accentColor} shadow-lg shadow-indigo-100 ring-2 ring-indigo-400/20 -translate-y-1`
                  : "bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
              }`}
            >
              {isSelected && (
                <span className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border mb-3 ${card.badgeColor}`}
                >
                  {card.tag}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? "text-indigo-600" : "text-slate-400"}>
                  {isSelected ? "Visualizando" : "Hacer clic para abrir"}
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? "text-indigo-600 translate-x-1" : "text-slate-300"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CARD DETAILED INTERACTIVE BENCH */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xl bg-white/90">
        {/* ========================================================================= */}
        {/* CARD 1: FUNDAMENTOS Y LAZO */}
        {/* ========================================================================= */}
        {activeTab === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Módulo 1
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Fundamentos y Lazo de Control
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Explora por qué el lazo cerrado (con retroalimentación) es fundamental para corregir errores y rechazar perturbaciones.
                </p>
              </div>

              {/* Toggle Lazo Abierto / Cerrado */}
              <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
                <button
                  onClick={() => setIsClosedLoop(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isClosedLoop
                      ? "bg-amber-500 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lazo Abierto
                </button>
                <button
                  onClick={() => setIsClosedLoop(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isClosedLoop
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lazo Cerrado (Feedback)
                </button>
              </div>
            </div>

            {/* Interactive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-4 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Parámetros de la Planta
                </h3>

                {/* Gain Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Ganancia de la Planta (K)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-600">
                      {plantGain.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={plantGain}
                    onChange={(e) => setPlantGain(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    En lazo abierto, un cambio en la ganancia altera el valor final permanentemente.
                  </p>
                </div>

                {/* Disturbance Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Magnitud de Perturbación en t = 4s</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-600">
                      {loopDisturbance.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.05"
                    value={loopDisturbance}
                    onChange={(e) => setLoopDisturbance(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Simula una fuerza externa (como fricción o carga en el motor).
                  </p>
                </div>

                {/* Status Callout */}
                <div
                  className={`p-3.5 rounded-xl text-xs ${
                    isClosedLoop
                      ? "bg-indigo-50 border border-indigo-200 text-indigo-900"
                      : "bg-amber-50 border border-amber-200 text-amber-900"
                  }`}
                >
                  <p className="font-bold mb-1">
                    {isClosedLoop ? "✓ Modo Lazo Cerrado Activo:" : "⚠️ Modo Lazo Abierto Activo:"}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {isClosedLoop
                      ? "El sensor mide la salida real y la compara con la referencia, corrigiendo la perturbación automáticamente."
                      : "No hay retroalimentación. El sistema no sabe si ocurrió una perturbación y queda con error permanente."}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-8 h-[340px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateLoopData()} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: "Tiempo (s)", position: "insideBottomRight", offset: -5, fill: "#64748b", fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 2.0]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                    <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Referencia r(t)=1.0", fill: "#22c55e", fontSize: 11 }} />
                    <ReferenceLine x="4.0" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Perturbación", fill: "#f59e0b", fontSize: 10 }} />
                    <Line type="monotone" dataKey="output" name="Salida y(t)" stroke={isClosedLoop ? "#6366f1" : "#f59e0b"} strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CARD 2: CONTROL PROPORCIONAL (P) */}
        {/* ========================================================================= */}
        {activeTab === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Módulo 2
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Controlador Proporcional (P)
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Ley de control: <code className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">u(t) = Kp · e(t)</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-4 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  Ajuste de Ganancia Proporcional
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Ganancia Proporcional (Kp)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-600 font-bold">
                      {kp_P.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.5"
                    value={kp_P}
                    onChange={(e) => setKp_P(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Mathematical Insight Box */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <p className="font-bold text-slate-800">Comportamiento Clave de P:</p>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <strong>Mayor Kp:</strong> Respuesta más rápida.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <strong>Error en Estado Estacionario (ess):</strong>{" "}
                      <span className="font-mono text-rose-600 font-bold">
                        {(100 / (1 + kp_P)).toFixed(1)}%
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <strong>Limitación:</strong> El control P puro <em>nunca</em> elimina el error al 100%.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-8 h-[340px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatePData()} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 1.2]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                    <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Referencia r(t)=1.0", fill: "#22c55e", fontSize: 11 }} />
                    <Line type="monotone" dataKey="output" name="Respuesta y(t)" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CARD 3: CONTROL PROPORCIONAL INTEGRAL (PI) */}
        {/* ========================================================================= */}
        {activeTab === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  Módulo 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Controlador Proporcional Integral (PI)
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Ley de control: <code className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">u(t) = Kp · e(t) + Ki · ∫ e(τ) dτ</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-4 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  Ajuste de Parámetros PI
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Ganancia Proporcional (Kp)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-purple-600 font-bold">
                      {kp_PI.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.5"
                    value={kp_PI}
                    onChange={(e) => setKp_PI(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Ganancia Integral (Ki)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-purple-600 font-bold">
                      {ki_PI.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.5"
                    step="0.1"
                    value={ki_PI}
                    onChange={(e) => setKi_PI(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-purple-900 text-xs">
                  <p className="font-bold mb-1">Efecto del Integrador:</p>
                  <p className="text-[11px] leading-relaxed">
                    La integral acumula el error pasado. Mientras exista error, la señal de control seguirá creciendo hasta que la salida alcance <strong>exactamente</strong> la referencia (<span className="font-mono font-bold">ess = 0%</span>).
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-8 h-[340px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatePIData()} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 1.6]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                    <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Referencia r(t)=1.0", fill: "#22c55e", fontSize: 11 }} />
                    <Line type="monotone" dataKey="output" name="Respuesta y(t)" stroke="#a855f7" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CARD 4: CONTROL PID COMPLETO */}
        {/* ========================================================================= */}
        {activeTab === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Módulo 4
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Controlador PID Completo
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Ley de control: <code className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">u(t) = Kp · e(t) + Ki · ∫ e(τ) dτ + Kd · de(t)/dt</code>
                </p>
              </div>

              {/* Reset to Defaults */}
              <button
                onClick={() => {
                  setKp_PID(3.0);
                  setKi_PID(1.5);
                  setKd_PID(0.8);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors self-start md:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar Parámetros
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders & Metrics */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    Sintonización de Ganancias
                  </h3>

                  {/* Kp */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Proporcional (Kp)</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">
                        {kp_PID.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="8.0"
                      step="0.5"
                      value={kp_PID}
                      onChange={(e) => setKp_PID(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Ki */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Integral (Ki)</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-purple-600 font-bold">
                        {ki_PID.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="4.0"
                      step="0.2"
                      value={ki_PID}
                      onChange={(e) => setKi_PID(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {/* Kd */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Derivativo (Kd)</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-600 font-bold">
                        {kd_PID.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="3.0"
                      step="0.1"
                      value={kd_PID}
                      onChange={(e) => setKd_PID(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Live Calculated Engineering Metrics */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Métricas de Desempeño en Vivo
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Sobrepaso (Mp)</p>
                      <p className="text-base font-black text-rose-600">{overshoot}%</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">T. Subida (tr)</p>
                      <p className="text-base font-black text-indigo-600">{riseTime}s</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">T. Asent. (ts)</p>
                      <p className="text-base font-black text-emerald-600">{settlingTime}s</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-8 h-[400px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pidData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 1.8]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                    <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Referencia Setpoint", fill: "#22c55e", fontSize: 11 }} />
                    <Line type="monotone" dataKey="output" name="Respuesta PID y(t)" stroke="#10b981" strokeWidth={3.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
