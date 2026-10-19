"use client";

import React, { useState } from "react";
import { ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, Play, Pause, Sparkles } from "lucide-react";

/**
 * Diagrama Interactivo y Animado para Lazo Abierto.
 * Demuestra visualmente el flujo hacia adelante y cómo la falta de sensor
 * hace que una perturbación desvíe la salida sin posibilidad de corrección.
 */
export function OpenLoopInteractiveDiagram() {
  const [hasDisturbance, setHasDisturbance] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Barra de control interactivo */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold shadow-sm transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            {isPlaying ? "Pausar Flujo" : "Reanudar Flujo"}
          </button>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-600 font-medium hidden sm:inline">
            Flujo Unidireccional (Sin Retorno)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHasDisturbance(!hasDisturbance)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
            hasDisturbance
              ? "bg-amber-500 text-white shadow-amber-200"
              : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-50"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {hasDisturbance ? "Quitar Perturbación d(t)" : "Aplicar Perturbación d(t)"}
        </button>
      </div>

      {/* Contenedor del Diagrama de Bloques SVG */}
      <div className="relative w-full overflow-x-auto bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-inner">
        <svg
          viewBox="0 0 740 220"
          className="w-full min-w-[680px] h-auto select-none font-sans"
        >
          <defs>
            {/* Marcadores de flechas */}
            <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
            <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
            </marker>
            <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#60a5fa" />
            </marker>
            {/* Filtro Glow */}
            <filter id="glowOpen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Líneas de Flujo de Señal */}
          {/* De Referencia a Controlador */}
          <line x1="80" y1="110" x2="160" y2="110" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowAmber)" />
          {/* De Controlador a Planta */}
          <line x1="280" y1="110" x2="380" y2="110" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowAmber)" />
          {/* De Planta a Salida */}
          <line x1="500" y1="110" x2="630" y2="110" stroke={hasDisturbance ? "#ef4444" : "#60a5fa"} strokeWidth="3" markerEnd={hasDisturbance ? "url(#arrowRed)" : "url(#arrowBlue)"} />

          {/* Perturbación externa que cae sobre la planta */}
          {hasDisturbance && (
            <g className="animate-bounce">
              <line x1="440" y1="25" x2="440" y2="65" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="4 3" markerEnd="url(#arrowRed)" />
              <rect x="385" y="5" width="110" height="22" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
              <text x="440" y="20" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">
                + Perturbación d(t)
              </text>
            </g>
          )}

          {/* Partículas de señal animadas a lo largo de las líneas */}
          {isPlaying && (
            <g fill="#fbbf24" filter="url(#glowOpen)">
              <circle r="4">
                <animateMotion path="M 80 110 L 160 110" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle r="4">
                <animateMotion path="M 280 110 L 380 110" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill={hasDisturbance ? "#ef4444" : "#60a5fa"}>
                <animateMotion path="M 500 110 L 630 110" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* 2. Bloque: Setpoint / Referencia */}
          <g transform="translate(10, 75)">
            <rect x="0" y="0" width="70" height="70" rx="12" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="35" y="28" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">ENTRADA</text>
            <text x="35" y="46" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="black">r(t)</text>
            <text x="35" y="60" textAnchor="middle" fill="#f59e0b" fontSize="9">50.0 °C</text>
          </g>
          <text x="120" y="100" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">r(t)</text>

          {/* 3. Bloque: Controlador */}
          <g transform="translate(160, 65)">
            <rect x="0" y="0" width="120" height="90" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <rect x="8" y="8" width="104" height="24" rx="6" fill="#78350f" opacity="0.6" />
            <text x="60" y="24" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">CONTROLADOR</text>
            <text x="60" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="10">Secuencial / Timer</text>
            <text x="60" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9">Cálculo fijo previo</text>
          </g>
          <text x="330" y="100" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">u(t) [PWM]</text>

          {/* 4. Bloque: Planta / Proceso */}
          <g transform="translate(380, 65)">
            <rect
              x="0"
              y="0"
              width="120"
              height="90"
              rx="14"
              fill="#1e293b"
              stroke={hasDisturbance ? "#ef4444" : "#3b82f6"}
              strokeWidth="2"
            />
            <rect x="8" y="8" width="104" height="24" rx="6" fill={hasDisturbance ? "#7f1d1d" : "#1e3a8a"} opacity="0.6" />
            <text x="60" y="24" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontWeight="bold">PLANTA</text>
            <text x="60" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="10">Actuador Térmico</text>
            <text x="60" y="75" textAnchor="middle" fill={hasDisturbance ? "#fca5a5" : "#94a3b8"} fontSize="9">
              {hasDisturbance ? "¡Desviada por frío!" : "Operación Nominal"}
            </text>
          </g>

          {/* 5. Bloque: Salida */}
          <g transform="translate(630, 75)">
            <rect
              x="0"
              y="0"
              width="90"
              height="70"
              rx="12"
              fill="#1e293b"
              stroke={hasDisturbance ? "#ef4444" : "#60a5fa"}
              strokeWidth="1.5"
            />
            <text x="45" y="26" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">SALIDA REAL</text>
            <text x="45" y="44" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="black">y(t)</text>
            <text x="45" y="60" textAnchor="middle" fill={hasDisturbance ? "#f87171" : "#60a5fa"} fontSize="10" fontWeight="bold">
              {hasDisturbance ? "36.2 °C (Error!)" : "50.0 °C (Ideal)"}
            </text>
          </g>

          {/* Zona inferior vacía (Sin realimentación) */}
          <line x1="80" y1="185" x2="650" y2="185" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />
          <text x="365" y="180" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
            ✖ SIN RETORNO DE INFORMACIÓN (EL SISTEMA ES CIEGO A LA SALIDA)
          </text>
        </svg>
      </div>

      {/* Explicación pedagógica del estado */}
      <div
        className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          hasDisturbance
            ? "bg-rose-50 border-rose-300 text-rose-950"
            : "bg-amber-50/70 border-amber-200 text-amber-950"
        }`}
      >
        {hasDisturbance ? (
          <p>
            <strong>Resultado con perturbación:</strong> Al introducir una ráfaga externa de aire frío, la temperatura cayó a <strong>36.2 °C</strong>. Como el lazo abierto <strong>carece de sensor de realimentación</strong>, el controlador continúa enviando la misma señal fija sin percatarse de la pérdida, resultando en un <strong>error permanente en estado estacionario</strong>.
          </p>
        ) : (
          <p>
            <strong>Principio del Lazo Abierto:</strong> La acción de control se calcula previamente asumiendo condiciones perfectas. Funciona únicamente si no existen perturbaciones externas y la planta no cambia con el tiempo.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Diagrama Interactivo y Animado para Lazo Cerrado (Feedback).
 * Muestra el comparador sumador, cálculo de error, sensor de realimentación
 * y cómo la compensación automática anula el error en tiempo real.
 */
export function ClosedLoopInteractiveDiagram() {
  const [hasDisturbance, setHasDisturbance] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Barra de control interactivo */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold shadow-sm transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            {isPlaying ? "Pausar Bucle" : "Reanudar Bucle"}
          </button>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-600 font-medium hidden sm:inline">
            Bucle Cerrado Continuo (Feedback)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHasDisturbance(!hasDisturbance)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
            hasDisturbance
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-white border border-blue-300 text-blue-900 hover:bg-blue-50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {hasDisturbance ? "Quitar Perturbación d(t)" : "Simular Perturbación en Vivo"}
        </button>
      </div>

      {/* Contenedor del Diagrama de Bloques SVG */}
      <div className="relative w-full overflow-x-auto bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-inner">
        <svg
          viewBox="0 0 760 270"
          className="w-full min-w-[700px] h-auto select-none font-sans"
        >
          <defs>
            <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>
            <marker id="arrowBlueCL" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f43f5e" />
            </marker>
            <filter id="glowClosed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* CAMINO DIRECTO (FORWARD PATH) */}
          {/* ========================================================= */}
          {/* 1. Entrada hacia el sumador */}
          <line x1="75" y1="85" x2="135" y2="85" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlueCL)" />

          {/* 2. Sumador hacia el Controlador (Señal de Error) */}
          <line x1="175" y1="85" x2="235" y2="85" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrowRose)" />

          {/* 3. Controlador hacia la Planta (Esfuerzo u(t)) */}
          <line x1="355" y1="85" x2="435" y2="85" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowEmerald)" />

          {/* 4. Planta hacia la Salida y punto de bifurcación */}
          <line x1="555" y1="85" x2="665" y2="85" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlueCL)" />

          {/* Perturbación externa sobre la planta */}
          {hasDisturbance && (
            <g className="animate-pulse">
              <line x1="495" y1="15" x2="495" y2="48" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 3" markerEnd="url(#arrowRose)" />
              <rect x="440" y="0" width="110" height="20" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
              <text x="495" y="14" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">
                d(t) Perturbación
              </text>
            </g>
          )}

          {/* ========================================================= */}
          {/* CAMINO DE RETROALIMENTACIÓN (FEEDBACK LOOP) */}
          {/* ========================================================= */}
          {/* Punto de bifurcación hacia abajo */}
          <circle cx="610" cy="85" r="5" fill="#3b82f6" />
          <path
            d="M 610 85 L 610 200 L 530 200"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlueCL)"
          />

          {/* Desde el Sensor hacia el comparador */}
          <path
            d="M 400 200 L 155 200 L 155 105"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            markerEnd="url(#arrowBlueCL)"
          />

          {/* ========================================================= */}
          {/* PARTÍCULAS EN BUCLE CONTINUO (CIRCUITO CERRADO) */}
          {/* ========================================================= */}
          {isPlaying && (
            <g fill="#38bdf8" filter="url(#glowClosed)">
              {/* Partícula Reference -> Sumador */}
              <circle r="4" fill="#60a5fa">
                <animateMotion path="M 75 85 L 135 85" dur="1.4s" repeatCount="indefinite" />
              </circle>
              {/* Partícula Error -> Controlador */}
              <circle r="4" fill="#f43f5e">
                <animateMotion path="M 175 85 L 235 85" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
              </circle>
              {/* Partícula Control -> Planta */}
              <circle r="4.5" fill="#10b981">
                <animateMotion path="M 355 85 L 435 85" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              {/* Partícula Planta -> Salida */}
              <circle r="4" fill="#60a5fa">
                <animateMotion path="M 555 85 L 610 85" dur="1.4s" begin="0.9s" repeatCount="indefinite" />
              </circle>
              {/* Partícula de Retorno: Salida -> Sensor */}
              <circle r="4" fill="#38bdf8">
                <animateMotion path="M 610 85 L 610 200 L 530 200" dur="1.8s" begin="1.1s" repeatCount="indefinite" />
              </circle>
              {/* Partícula de Retorno: Sensor -> Sumador */}
              <circle r="4" fill="#38bdf8">
                <animateMotion path="M 400 200 L 155 200 L 155 105" dur="1.8s" begin="1.8s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* ========================================================= */}
          {/* BLOQUES Y COMPONENTES */}
          {/* ========================================================= */}
          {/* 1. Entrada / Setpoint */}
          <g transform="translate(10, 55)">
            <rect x="0" y="0" width="65" height="60" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="32" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">SETPOINT</text>
            <text x="32" y="40" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="black">r(t)</text>
            <text x="32" y="52" textAnchor="middle" fill="#60a5fa" fontSize="9">50.0 °C</text>
          </g>

          {/* 2. Sumador / Comparador de Error (Círculo Sigma) */}
          <g transform="translate(135, 65)">
            <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="20" y="25" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="bold">Σ</text>
            {/* Signos + y - */}
            <text x="5" y="14" fill="#60a5fa" fontSize="13" fontWeight="black">+</text>
            <text x="25" y="36" fill="#f43f5e" fontSize="15" fontWeight="black">-</text>
          </g>
          {/* Texto de Señal de Error */}
          <g transform="translate(180, 50)">
            <rect x="0" y="0" width="50" height="20" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
            <text x="25" y="14" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="bold">
              {hasDisturbance ? "e = +5.2" : "e(t) ≈ 0"}
            </text>
          </g>

          {/* 3. Bloque: Controlador PID */}
          <g transform="translate(235, 45)">
            <rect x="0" y="0" width="120" height="80" rx="14" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <rect x="8" y="8" width="104" height="22" rx="6" fill="#064e3b" opacity="0.6" />
            <text x="60" y="23" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">CONTROLADOR PID</text>
            <text x="60" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="10">Cerebro de Control</text>
            <text x="60" y="66" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
              {hasDisturbance ? "¡Aumenta Esfuerzo!" : "u(t) = Estable"}
            </text>
          </g>
          <text x="395" y="78" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">u(t)</text>

          {/* 4. Bloque: Planta / Proceso */}
          <g transform="translate(435, 45)">
            <rect x="0" y="0" width="120" height="80" rx="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <rect x="8" y="8" width="104" height="22" rx="6" fill="#1e3a8a" opacity="0.6" />
            <text x="60" y="23" textAnchor="middle" fill="#bfdbfe" fontSize="10" fontWeight="bold">PLANTA / SISTEMA</text>
            <text x="60" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="10">Módulo Térmico</text>
            <text x="60" y="66" textAnchor="middle" fill="#38bdf8" fontSize="9">
              G(s) Proceso Físico
            </text>
          </g>

          {/* 5. Bloque: Salida Controlada */}
          <g transform="translate(665, 55)">
            <rect x="0" y="0" width="85" height="60" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="42" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">SALIDA</text>
            <text x="42" y="40" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="black">y(t)</text>
            <text x="42" y="52" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">
              {hasDisturbance ? "50.0 °C (Regulada)" : "50.0 °C (Exacta)"}
            </text>
          </g>

          {/* 6. Bloque: Sensor / Elemento de Medición en el camino inferior */}
          <g transform="translate(400, 165)">
            <rect x="0" y="0" width="130" height="68" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <rect x="8" y="6" width="114" height="20" rx="4" fill="#0369a1" opacity="0.5" />
            <text x="65" y="20" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">SENSOR / TRANSDUCTOR</text>
            <text x="65" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="9">Termistor / Encoder H(s)</text>
            <text x="65" y="58" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
              Mide y(t) en tiempo real
            </text>
          </g>
          <text x="270" y="190" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
            Señal de Realimentación ym(t)
          </text>
        </svg>
      </div>

      {/* Explicación pedagógica del estado */}
      <div
        className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          hasDisturbance
            ? "bg-blue-50 border-blue-300 text-blue-950"
            : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
        }`}
      >
        {hasDisturbance ? (
          <p>
            <strong>Rechazo de Perturbaciones en Vivo:</strong> Cuando entra una perturbación externa, el <strong>Sensor</strong> detecta la variación inmediatamente y la transmite al <strong>nodo sumador Σ</strong>. El comparador eleva el error <span className="font-mono font-bold text-rose-700">e(t) = r(t) - y(t)</span>, forzando al controlador a incrementar su acción de control para contrarrestar la perturbación y devolver la planta exactamente al setpoint de <strong>50.0 °C</strong>.
          </p>
        ) : (
          <p>
            <strong>Principio del Lazo Cerrado:</strong> El sensor informa permanentemente el estado real de la salida. El controlador compara la referencia con la medición y actúa sobre el error, logrando estabilidad, precisión y robustez frente a cambios ambientales.
          </p>
        )}
      </div>
    </div>
  );
}
