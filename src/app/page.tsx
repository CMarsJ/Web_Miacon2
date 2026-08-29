"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Eye,
  FlaskConical,
  Gauge,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Home() {
  const [systemMode, setSystemMode] = useState<"stable" | "oscillating" | "aggressive">("stable");
  const [disturbance, setDisturbance] = useState<number>(0);

  // Generate dynamic live waveform data for hero widget
  const generateWaveform = () => {
    return Array.from({ length: 30 }, (_, i) => {
      const t = i * 0.3;
      let val = 1.0;
      if (systemMode === "stable") {
        // Overdamped/critically damped: fast rise, no overshoot
        val = 1.0 - Math.exp(-t * 1.2) * Math.cos(t * 0.8) + (t > 4 ? disturbance * 0.15 : 0);
      } else if (systemMode === "oscillating") {
        // Underdamped with overshoot and oscillations
        val = 1.0 - Math.exp(-t * 0.5) * Math.cos(t * 3.0) + (t > 4 ? disturbance * 0.2 : 0);
      } else {
        // High gain / fast response
        val = 1.0 - Math.exp(-t * 2.0) * Math.cos(t * 1.5) + (t > 4 ? disturbance * 0.1 : 0);
      }
      return {
        time: t.toFixed(1),
        target: 1.0,
        response: Math.max(0, Number(val.toFixed(2))),
      };
    });
  };

  const chartData = generateWaveform();

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Nueva Versión • Miacon 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span className="text-slate-500">Ingeniería & Control</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Aprende Teoría de Control{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              de forma visual e interactiva
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Experimenta con sistemas en lazo abierto y cerrado, ajusta controladores 
            <span className="font-semibold text-indigo-700"> P, PI y PID </span> 
            en tiempo real, y aprende a construir tu propia planta de experimentación con Miacon 2.0.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link
              href="/aprendizaje"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explorar Aprendizaje
            </Link>

            <Link
              href="/laboratorios"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-2xl text-slate-800 bg-white/90 hover:bg-white border border-slate-200/80 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <FlaskConical className="w-5 h-5 mr-2 text-indigo-600" />
              Ruta de Laboratorios
              <ChevronRight className="w-4 h-4 ml-1 text-slate-400" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Interactivo</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-600">4</p>
              <p className="text-xs text-slate-500 font-medium">Módulos Dinámicos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-600">Lab 0</p>
              <p className="text-xs text-slate-500 font-medium">Listo para Armar</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Hero Widget */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-6 shadow-xl border border-indigo-100/80 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">
                  Osciloscopio Virtual en Vivo
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                Planta de 2do Orden
              </span>
            </div>

            {/* Live Chart */}
            <div className="h-[220px] w-full mb-4 bg-slate-950/95 rounded-2xl p-2.5 border border-slate-800 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 2]} />
                  <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Setpoint', fill: '#22c55e', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="response"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Selector Buttons */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-600 flex justify-between">
                <span>Modo de Control Seleccionado:</span>
                <span className="font-bold text-indigo-600 uppercase font-mono">{systemMode}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSystemMode("stable")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    systemMode === "stable"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Subamortiguado
                </button>
                <button
                  onClick={() => setSystemMode("oscillating")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    systemMode === "oscillating"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Oscilatorio
                </button>
                <button
                  onClick={() => setSystemMode("aggressive")}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    systemMode === "aggressive"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Rápido (PID)
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setDisturbance((prev) => (prev === 0 ? 1 : 0))}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {disturbance === 0 ? "Inyectar Perturbación" : "Quitar Perturbación"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED SECTION: ¿QUÉ ES MIACON 2.0? */}
      <section className="py-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-xl bg-gradient-to-b from-white/90 via-white/70 to-indigo-50/30">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/70 rounded-full">
              Arquitectura del Proyecto
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ¿Qué es <span className="text-indigo-600">Miacon 2.0</span>?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              <strong>Miacon 2.0</strong> es una plataforma integral de ingeniería que combina 
              <strong> hardware de adquisición y control</strong> con una <strong>suite web interactiva</strong>.
              Permite a los estudiantes conectar conceptos matemáticos abstractos con sistemas físicos reales.
            </p>
          </div>

          {/* 3 Pillars of Miacon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 p-6 rounded-2xl border border-slate-200/80 shadow-sm glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Hardware & Sensores</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Módulo físico con microcontrolador, puente H para potencia, motor DC con encoder de cuadratura y sensores para retroalimentación en tiempo real.
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border border-slate-200/80 shadow-sm glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Simulación en Vivo</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Algoritmos que calculan en el navegador la respuesta matemática exacta ante escalones, impulsos y perturbaciones externas.
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border border-slate-200/80 shadow-sm glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Sintonización PID</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Aprende a calibrar las ganancias Proporcional ($K_p$), Integral ($K_i$) y Derivativa ($K_d$) analizando tiempos de respuesta y sobrepasos.
              </p>
            </div>
          </div>

          {/* Architecture Visual Diagram Flow */}
          <div className="mt-12 p-6 bg-slate-900 rounded-2xl text-white">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 text-center">
              Flujo del Lazo de Control en Miacon 2.0
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-center font-mono text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-indigo-400 font-bold">Setpoint</p>
                <p className="text-[10px] text-slate-400">Referencia Deseada</p>
              </div>
              <div className="hidden sm:block text-slate-500">➔</div>
              <div className="bg-slate-800 p-3 rounded-xl border border-indigo-500/50 shadow-sm shadow-indigo-500/20">
                <p className="text-cyan-400 font-bold">Controlador PID</p>
                <p className="text-[10px] text-slate-400">Acción de Control u(t)</p>
              </div>
              <div className="hidden sm:block text-slate-500">➔</div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-emerald-400 font-bold">Planta Miacon</p>
                <p className="text-[10px] text-slate-400">Motor DC + Sensores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Todo lo que necesitas para dominar control
          </h2>
          <p className="text-slate-600 mt-2">
            Diseñado para que los conceptos complejos se vuelvan intuitivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Módulos Teóricos</h3>
            <p className="text-xs text-slate-600">Fundamentos, Control P, PI y PID divididos en tarjetas didácticas dinámicas.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Métricas en Vivo</h3>
            <p className="text-xs text-slate-600">Calcula al instante sobrepaso máximo ($M_p$), tiempo de subida ($t_r$) y asentamiento ($t_s$).</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Laboratorios Guiados</h3>
            <p className="text-xs text-slate-600">Comienza con el Lab 0 para construir y diagnosticar tu hardware Miacon paso a paso.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Simulación Instantánea</h3>
            <p className="text-xs text-slate-600">Sin instalaciones pesadas: todo se ejecuta directamente en tu navegador web.</p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 inline-block">
            Miacon 2026 Ready
          </span>
          <h2 className="text-3xl sm:text-4xl font-black">
            ¿Listo para construir tu primer sistema de control?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Empieza explorando la teoría en los 4 módulos interactivos o ve directo al Laboratorio 0 para ensamblar y comprobar tu plataforma física.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/aprendizaje"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Tarjetas de Teoría
            </Link>
            <Link
              href="/laboratorios/lab0"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2 text-cyan-400" />
              Ir al Lab 0 (Construcción)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
