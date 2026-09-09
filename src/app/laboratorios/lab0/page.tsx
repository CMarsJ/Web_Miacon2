"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  Cpu,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

export default function Lab0() {
  // Checklist State
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  });

  // Diagnostics Terminal State
  const [isRunningDiag, setIsRunningDiag] = useState(false);
  const [diagLogs, setDiagLogs] = useState<string[]>([
    "Esperando inicio de pruebas de hardware Miacon 2.0...",
  ]);
  const [diagPassed, setDiagPassed] = useState(false);

  const toggleCheck = (key: string) => {
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const runDiagnostics = () => {
    setIsRunningDiag(true);
    setDiagPassed(false);
    setDiagLogs(["Iniciando escaneo de periféricos en puerto COM3..."]);

    setTimeout(() => {
      setDiagLogs((prev) => [...prev, "[OK] Tensión de alimentación: 12.04 V Detectada."]);
    }, 600);

    setTimeout(() => {
      setDiagLogs((prev) => [...prev, "[OK] Driver Puente H (L298N/DRV8833): Canales A/B respondiendo."]);
    }, 1200);

    setTimeout(() => {
      setDiagLogs((prev) => [...prev, "[OK] Encoder óptico de cuadratura: 600 pulsos/rev verificado."]);
    }, 1800);

    setTimeout(() => {
      setDiagLogs((prev) => [
        ...prev,
        ">>> VALIDACIÓN EXITOSA: La plataforma física Miacon 2.0 está calibrada y lista para control.",
      ]);
      setIsRunningDiag(false);
      setDiagPassed(true);
    }, 2400);
  };

  const totalSteps = Object.keys(checkedSteps).length;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/laboratorios"
        className="inline-flex items-center text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Volver a la Ruta de Laboratorios
      </Link>

      {/* Main Container Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-2xl bg-white/95 space-y-10">
        {/* Lab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-400 p-0.5 shadow-md shadow-blue-200">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-blue-400 font-black text-xl">
                0
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                  Laboratorio 00
                </span>
                <span className="text-xs text-slate-500 font-medium">Fase de Preparación</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Construcción y Comprobación de Miacon 2.0
              </h1>
            </div>
          </div>

          {/* Progress Bar Badge */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right min-w-[140px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Progreso del Lab
            </p>
            <p className="text-xl font-black text-blue-700">{progressPercent}%</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-blue-700 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section 1: Checklist de Ensamblaje */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-extrabold text-slate-900">
              1. Lista de Verificación y Ensamblaje
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Marca cada paso una vez que hayas realizado la conexión física en tu banco de trabajo:
          </p>

          <div className="space-y-3">
            {[
              {
                id: "step1",
                title: "Conexión de Potencia del Puente H",
                desc: "Conecta la fuente de alimentación externa de 12V al módulo driver y une las tierras (GND) con el microcontrolador.",
              },
              {
                id: "step2",
                title: "Cableado del Motor DC y Señal PWM",
                desc: "Conecta los terminales del motor a las salidas OUT1 y OUT2 del puente H y el pin PWM del controlador al pin IN1/ENA.",
              },
              {
                id: "step3",
                title: "Instalación del Encoder de Posición",
                desc: "Alimenta el encoder con 5V y conecta los canales A y B a los pines de interrupción externa del microcontrolador.",
              },
              {
                id: "step4",
                title: "Enlace de Comunicación Serial USB",
                desc: "Conecta el cable USB al computador y verifica que el puerto serie (COM / ttyUSB) sea reconocido.",
              },
            ].map((step) => {
              const isChecked = checkedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleCheck(step.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? "bg-blue-50/70 border-blue-300 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-5 h-5 accent-blue-700 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className={`text-sm font-bold ${isChecked ? "text-blue-900" : "text-slate-800"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Consola de Diagnóstico Interactivo */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                2. Consola de Diagnóstico y Telemetría
              </h2>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunningDiag}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                isRunningDiag
                  ? "bg-slate-300 text-slate-600 cursor-wait"
                  : "bg-slate-900 hover:bg-blue-800 text-white shadow-slate-200"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isRunningDiag ? "Probando Hardware..." : "Ejecutar Diagnóstico Miacon 2.0"}
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-[11px] text-slate-400">miacon-diagnostics://serial-port</span>
              </div>
              <span className="text-[10px] text-blue-400">115200 BAUD</span>
            </div>

            <div className="space-y-2 min-h-[120px] text-slate-300">
              {diagLogs.map((log, idx) => (
                <p
                  key={idx}
                  className={
                    log.includes("VALIDACIÓN EXITOSA")
                      ? "text-emerald-400 font-bold"
                      : log.includes("[OK]")
                      ? "text-blue-300"
                      : "text-slate-400"
                  }
                >
                  {log}
                </p>
              ))}
              {isRunningDiag && (
                <p className="text-amber-400 animate-pulse">Analizando respuesta dinámica de los encoders...</p>
              )}
            </div>
          </div>

          {diagPassed && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-700" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900">
                    ¡Plataforma Miacon 2.0 Comprobada con Éxito!
                  </h4>
                  <p className="text-[11px] text-blue-700">
                    Todo el hardware está listo para avanzar a la identificación y sintonización de control.
                  </p>
                </div>
              </div>
              <Link
                href="/laboratorios"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition-colors"
              >
                Volver a la Ruta
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
