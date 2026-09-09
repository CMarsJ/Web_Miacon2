"use client";

import { useState } from "react";
import {
  BookOpen, ArrowRight, Layers, Sliders, Activity, Target, Zap, AlertCircle, Waves, Cpu,
  TrendingUp, RotateCcw, Lock
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

export default function Aprendizaje() {
  const [activeTab, setActiveTab] = useState<number>(1);

  // State for unified simulator (Tab 3)
  const [controlMode, setControlMode] = useState<"P" | "PI" | "PD" | "PID">("P");
  const [kp, setKp] = useState<number>(3.0);
  const [ki, setKi] = useState<number>(0.5);
  const [kd, setKd] = useState<number>(1.0);

  // Generate Simulation Data for G(s) = 2 / ((10s+1)(2s+1)) = 2 / (20s^2 + 12s + 1)
  const generateUnifiedPIDData = () => {
    const dt = 0.05;
    const timeEnd = 40; // Simulate 40 seconds
    const data = [];

    let y = 0;
    let dy = 0;
    let ie = 0;
    let prev_e = 1;

    const activeKp = ["P", "PI", "PD", "PID"].includes(controlMode) ? kp : 0;
    const activeKi = ["PI", "PID"].includes(controlMode) ? ki : 0;
    const activeKd = ["PD", "PID"].includes(controlMode) ? kd : 0;

    for (let t = 0; t <= timeEnd; t += dt) {
      const target = 1.0;
      const e = target - y;

      // Integral calculation
      ie += e * dt;

      // Derivative calculation (backward diff)
      const de = (e - prev_e) / dt;

      // PID Control Law
      const u = activeKp * e + activeKi * ie + activeKd * de;

      // Plant differential equation: 20y'' + 12y' + y = 2u
      const ddy = (2 * u - 12 * dy - y) / 20.0;

      // Euler Integration
      dy += ddy * dt;
      y += dy * dt;
      prev_e = e;

      // Sample data every 0.25s for the chart
      if (Math.abs(t % 0.25) < dt / 2) {
        data.push({
          time: t.toFixed(2),
          output: Number(Math.max(0, y).toFixed(3)),
          target: target,
        });
      }
    }
    return data;
  };

  const simData = activeTab === 3 ? generateUnifiedPIDData() : [];

  // Calculate live metrics if in Tab 3
  let overshoot = "0.0";
  let settlingTime = "> 40.0";
  let steadyError = "0.0";

  if (activeTab === 3 && simData.length > 0) {
    const maxOutput = Math.max(...simData.map((d) => d.output));
    overshoot = maxOutput > 1.0 ? ((maxOutput - 1.0) * 100).toFixed(1) : "0.0";

    for (let i = simData.length - 1; i >= 0; i--) {
      if (Math.abs(simData[i].output - 1.0) > 0.02) {
        if (i < simData.length - 1) {
          settlingTime = simData[i + 1].time;
        }
        break;
      }
    }
    if (Math.abs(simData[simData.length - 1].output - 1.0) <= 0.02 && settlingTime === "> 40.0") {
      settlingTime = "40.0"; // fallback if it settled exactly at the end
    }

    const lastOutput = simData[simData.length - 1].output;
    steadyError = (Math.abs(1.0 - lastOutput) * 100).toFixed(1);
  }

  const topicCards = [
    { id: 1, title: "Vocabulario Base", tag: "Fundamentos", icon: BookOpen, active: true },
    { id: 2, title: "Arquitecturas de Lazos", tag: "Estructura", icon: Layers, active: true },
    { id: 3, title: "El Controlador PID", tag: "Interactivo", icon: Sliders, active: true },
    { id: 4, title: "Errores y Dinámica", tag: "Desempeño", icon: Activity, active: true },
    { id: 5, title: "Conceptos IoT", tag: "Próximamente", icon: Lock, active: false },
  ];

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-32 pb-16 space-y-10">

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Teoría de <span className="text-blue-700">Control Clásico e IoT</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Domina los conceptos clave y experimenta con la dinámica de control en tiempo real.
        </p>
      </div>

      {/* Tabs / Card Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {topicCards.map((card) => {
          const isSelected = activeTab === card.id;
          const CardIcon = card.icon;

          if (!card.active) {
            return (
              <div key={card.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 opacity-70 flex flex-col items-start gap-2">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-100 text-slate-500 border-slate-200">
                  {card.tag}
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                  <CardIcon className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm">{card.title}</h3>
                </div>
              </div>
            );
          }

          return (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`p-4 rounded-2xl text-left transition-all relative flex flex-col gap-2 border-2 cursor-pointer ${isSelected
                ? "bg-white border-blue-600 shadow-lg shadow-blue-900/5 ring-2 ring-blue-500/10 -translate-y-1"
                : "bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
                }`}
            >
              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {card.tag}
              </span>
              <div className={`flex items-center gap-2 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                <CardIcon className={`w-5 h-5 ${isSelected ? 'text-blue-700' : ''}`} />
                <h3 className="font-extrabold text-sm">{card.title}</h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-xl min-h-[500px]">

        {/* TAB 1: VOCABULARIO */}
        {activeTab === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Vocabulario Base y Variables de un Sistema</h2>
              <p className="text-slate-600 mt-2">El punto de partida. Antes de intentar controlar o medir cualquier fenómeno, es indispensable definir sus partes y las variables involucradas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <Cpu className="w-5 h-5" /> Planta / Proceso
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Es el sistema físico, químico o matemático que deseamos analizar y controlar (por ejemplo, un módulo térmico, un motor, o la dinámica de fluidos en un tanque).
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Target className="w-5 h-5" /> Setpoint (Referencia)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  El valor objetivo, consigna o meta deseada que queremos que alcance nuestra planta de forma autónoma.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                  <Activity className="w-5 h-5" /> Variable Controlada (Salida)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Es la variable real del sistema que estamos monitoreando a través de la telemetría o sensores y que comparamos constantemente con el setpoint.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <Zap className="w-5 h-5" /> Variable Manipulada (Entrada de control)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Es la señal, magnitud o energía que el actuador modifica directamente para influir en la planta y forzar a la variable controlada hacia el setpoint.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center gap-2 text-rose-600 font-bold">
                  <AlertCircle className="w-5 h-5" /> Perturbaciones
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fuerzas o señales indeseadas (ruido, cambios térmicos externos, fricción) que desvían a la variable controlada de su estado ideal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARQUITECTURAS */}
        {activeTab === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Arquitecturas de Control (Lazos)</h2>
              <p className="text-slate-600 mt-2">Una vez definidas las variables, esta sección abarca cómo interactúa el sistema con la información que fluye a través de él.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              <div className="border-2 border-slate-200 rounded-3xl p-6 sm:p-8 bg-white relative overflow-hidden group hover:border-amber-400 transition-colors flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="text-amber-500" /> Lazo Abierto
                </h3>
                <p className="text-slate-600 leading-relaxed flex-1">
                  El controlador actúa de forma secuencial o calculada sin recibir información de retorno. <strong>Es ciego a la salida;</strong> no hay sensores midiendo si se alcanzó el setpoint. No corrige sus propios errores frente a perturbaciones.
                </p>
                {/* Lazo Abierto Diagram */}
                <div className="mt-6 flex items-center justify-between text-[10px] sm:text-xs font-bold text-center w-full bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-col items-center w-1/4">
                    <div className="bg-slate-200 p-2 rounded-lg text-slate-700 w-full shadow-sm">Setpoint</div>
                  </div>
                  <ArrowRight className="text-slate-400 w-4 h-4 mx-1" />
                  <div className="flex flex-col items-center w-1/4">
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-800 border border-amber-200 w-full shadow-sm">Control</div>
                  </div>
                  <ArrowRight className="text-slate-400 w-4 h-4 mx-1" />
                  <div className="flex flex-col items-center w-1/4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-800 border border-blue-200 w-full shadow-sm">Planta</div>
                  </div>
                  <ArrowRight className="text-slate-400 w-4 h-4 mx-1" />
                  <div className="flex flex-col items-center w-1/4">
                    <div className="bg-slate-200 p-2 rounded-lg text-slate-700 w-full shadow-sm">Salida</div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-slate-200 rounded-3xl p-6 sm:p-8 bg-white relative overflow-hidden group hover:border-blue-600 transition-colors flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <RotateCcw className="text-blue-600" /> Lazo Cerrado (Feedback)
                </h3>
                <p className="text-slate-600 leading-relaxed flex-1">
                  Incorpora realimentación. La salida se mide y se compara continuamente con el setpoint para generar una señal de error. Esto permite al sistema tomar decisiones autónomas y corregir desviaciones.
                </p>
                {/* Lazo Cerrado Diagram */}
                <div className="mt-6 flex flex-col gap-2 text-[10px] sm:text-xs font-bold text-center w-full bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 relative">
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex flex-col items-center w-1/5">
                      <div className="bg-slate-200 p-2 rounded-lg text-slate-700 w-full shadow-sm">+ Ref</div>
                    </div>
                    <div className="w-1/5 flex justify-center text-rose-500 relative">
                      <span className="absolute -top-4 text-[9px] bg-rose-100 text-rose-700 px-1 rounded">Error</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center w-1/5">
                      <div className="bg-emerald-100 p-2 rounded-lg text-emerald-800 border border-emerald-200 w-full z-10 shadow-sm">Control</div>
                    </div>
                    <ArrowRight className="text-slate-400 w-4 h-4 mx-1" />
                    <div className="flex flex-col items-center w-1/5">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-800 border border-blue-200 w-full z-10 shadow-sm">Planta</div>
                    </div>
                    <ArrowRight className="text-slate-400 w-4 h-4 mx-1" />
                    <div className="flex flex-col items-center w-1/5">
                      <div className="bg-slate-200 p-2 rounded-lg text-slate-700 w-full shadow-sm">Salida</div>
                    </div>
                  </div>
                  {/* Feedback path */}
                  <div className="w-full flex justify-end pr-[10%]">
                    <div className="h-6 w-[75%] border-b-2 border-l-2 border-r-2 border-slate-300 rounded-b-lg border-dashed flex justify-center items-end pb-1 relative">
                      <span className="text-slate-500 bg-slate-50 px-2 absolute -bottom-2 text-[9px]">Sensor (Feedback)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EL CONTROLADOR PID Y SIMULADOR */}
        {activeTab === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900">El Controlador y la Acción PID</h2>
              <p className="text-slate-600 mt-2">
                El "cerebro" del lazo cerrado. Procesa el error para calcular y ejecutar el esfuerzo de control necesario.
                Interactúa con los parámetros para controlar una planta de segundo orden: <strong>G(s) = 2 / ((10s+1)(2s+1))</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">

              {/* Panel de Controles */}
              <div className="xl:col-span-4 flex flex-col gap-6">

                {/* Selector de Modo */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Estrategia de Control</p>
                    <div className="grid grid-cols-4 gap-2">
                      {["P", "PI", "PD", "PID"].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setControlMode(mode as any)}
                          className={`py-2 rounded-lg font-bold text-sm transition-all ${controlMode === mode
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Explanation */}
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100 text-xs leading-relaxed text-slate-600 shadow-sm">
                    {controlMode === "P" && <span><strong className="text-blue-700">Control Proporcional (P):</strong> Multiplica el error actual por una constante (Kp). Es rápido, pero <strong>nunca logra eliminar el error estacionario por completo</strong> (siempre queda un pequeño desfase).</span>}
                    {controlMode === "PI" && <span><strong className="text-emerald-700">Control Proporcional Integral (PI):</strong> Suma la acción Integral (Ki) que <strong>acumula el error pasado</strong>. Esto garantiza que el error estacionario se reduzca a cero. Su desventaja es que puede causar oscilaciones.</span>}
                    {controlMode === "PD" && <span><strong className="text-purple-700">Control Proporcional Derivativo (PD):</strong> Suma la acción Derivativa (Kd) que <strong>predice el error futuro</strong> (actúa como un freno). Mejora la estabilidad y frena el sobreimpulso, pero es muy sensible al ruido.</span>}
                    {controlMode === "PID" && <span><strong className="text-slate-900">Controlador PID Completo:</strong> Combina las tres acciones. El <strong>Proporcional</strong> da fuerza actual, el <strong>Integral</strong> elimina el error acumulado, y el <strong>Derivativo</strong> frena las oscilaciones futuras.</span>}
                  </div>
                </div>

                {/* Sliders PID */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-6 flex-1">

                  {/* Proporcional */}
                  <div className={["P", "PI", "PD", "PID"].includes(controlMode) ? "opacity-100" : "opacity-30 pointer-events-none"}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Acción Proporcional (P)</p>
                        <p className="text-[10px] text-slate-500">Actúa sobre el error Presente.</p>
                      </div>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-bold">{kp.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0.1" max="15.0" step="0.1" value={kp} onChange={(e) => setKp(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>

                  {/* Integral */}
                  <div className={["PI", "PID"].includes(controlMode) ? "opacity-100" : "opacity-30 pointer-events-none"}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Acción Integral (I)</p>
                        <p className="text-[10px] text-slate-500">Elimina el error Pasado (Acumulado).</p>
                      </div>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-600 font-bold">{ki.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0.0" max="5.0" step="0.1" value={ki} onChange={(e) => setKi(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>

                  {/* Derivativa */}
                  <div className={["PD", "PID"].includes(controlMode) ? "opacity-100" : "opacity-30 pointer-events-none"}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Acción Derivativa (D)</p>
                        <p className="text-[10px] text-slate-500">Freno predictivo sobre el error Futuro.</p>
                      </div>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-purple-600 font-bold">{kd.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0.0" max="10.0" step="0.1" value={kd} onChange={(e) => setKd(Number(e.target.value))} className="w-full accent-purple-500" />
                  </div>
                </div>

              </div>

              {/* Panel de Simulación y Gráfica */}
              <div className="xl:col-span-8 flex flex-col gap-4">

                {/* Métricas en vivo */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Sobreimpulso</span>
                    <span className="text-xl font-black text-slate-900">{overshoot}%</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">T. Establecimiento</span>
                    <span className="text-xl font-black text-slate-900">{settlingTime}s</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Error Estacionario</span>
                    <span className="text-xl font-black text-slate-900">{steadyError}%</span>
                  </div>
                </div>

                {/* Gráfica */}
                <div className="flex-1 min-h-[350px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 2.0]} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                      <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Setpoint (r = 1)", fill: "#22c55e", fontSize: 11 }} />
                      <Line type="monotone" dataKey="output" name="Salida y(t)" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ERRORES Y DINAMICA */}
        {activeTab === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Tipos de Errores y Dinámica de la Respuesta</h2>
              <p className="text-slate-600 mt-2">Métricas clave para evaluar el desempeño, la viabilidad y la calidad de un diseño de control observando su comportamiento en el tiempo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div className="border-l-4 border-rose-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 text-lg">Error Instantáneo / Actuante e(t)</h3>
                <p className="text-sm text-slate-600 mt-1">La diferencia matemática exacta en cada milisegundo de tiempo entre el Setpoint y el valor medido de la Variable Controlada.</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 text-lg">Error en Estado Estacionario (Offset)</h3>
                <p className="text-sm text-slate-600 mt-1">La diferencia persistente que queda entre el setpoint y la salida final después de que toda la dinámica transitoria ha desaparecido y el sistema se ha estabilizado.</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 text-lg">Sobreimpulso (Overshoot)</h3>
                <p className="text-sm text-slate-600 mt-1">El valor pico en el que la respuesta sobrepasa por primera vez el setpoint antes de devolverse a estabilizarse. Suele medirse en porcentaje y es crítico evitarlo en procesos delicados.</p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 text-lg">Tiempo de Establecimiento (Settling Time)</h3>
                <p className="text-sm text-slate-600 mt-1">El tiempo total requerido para que la respuesta de la planta alcance y se mantenga dentro de una franja de tolerancia estrecha (usualmente 2% o 5%) alrededor del valor final.</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
