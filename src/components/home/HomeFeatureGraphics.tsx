"use client";

import React from "react";

/**
 * 01 // FASE DE ARQUITECTURA
 * Gráfico animado del ensamblaje de un circuito / chasis electrónico.
 * Muestra el encaje de componentes, trazado de pistas y flujo de energía.
 */
export function CircuitAssemblyGraphic() {
  return (
    <div className="relative w-full max-w-lg h-[360px] flex items-center justify-center p-4">
      {/* Marco de fondo tipo Blueprint / Plano CAD */}
      <div className="absolute inset-0 rounded-3xl bg-slate-900/5 border border-blue-200/80 shadow-inner overflow-hidden">
        {/* Rejilla milimétrica */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
        {/* Esquinas con marcas de ensamblaje */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-blue-500" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-blue-500" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-blue-500" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-blue-500" />
        {/* Etiqueta técnica */}
        <div className="absolute bottom-3 right-4 font-mono text-[10px] font-bold text-blue-700/70 tracking-wider">
          CAD // PCB_ASSEMBLY_REV_2.4
        </div>
      </div>

      <svg
        viewBox="0 0 460 320"
        className="w-full h-full relative z-10 drop-shadow-md select-none"
      >
        <defs>
          {/* Gradiente de la placa */}
          <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          {/* Gradiente del chip */}
          <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          {/* Glow para energía */}
          <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base del Chasis / Placa PCB */}
        <g className="transition-transform duration-700">
          <rect
            x="40"
            y="30"
            width="380"
            height="260"
            rx="20"
            fill="url(#pcbGrad)"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />

          {/* Tornillos de fijación en las esquinas */}
          <circle cx="65" cy="55" r="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
          <circle cx="395" cy="55" r="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
          <circle cx="65" cy="265" r="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
          <circle cx="395" cy="265" r="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

          {/* Ranura conector USB */}
          <rect x="25" y="130" width="18" height="40" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          <line x1="33" y1="138" x2="33" y2="162" stroke="#2563eb" strokeWidth="2" />
        </g>

        {/* 2. Pistas de circuito conductoras que se dibujan continuamente */}
        <g stroke="#3b82f6" strokeWidth="2.5" fill="none" opacity="0.85">
          {/* Pista desde USB hasta regulador */}
          <path
            d="M 43 145 L 80 145 L 100 120 L 150 120"
            strokeDasharray="200"
            strokeDashoffset="200"
            className="animate-[drawPath_3s_ease-in-out_infinite]"
          />
          <path
            d="M 43 155 L 80 155 L 100 180 L 150 180"
            strokeDasharray="200"
            strokeDashoffset="200"
            className="animate-[drawPath_3s_ease-in-out_infinite_0.4s]"
          />

          {/* Pistas del bus superior */}
          <path
            d="M 180 85 L 180 55 L 320 55 L 320 85"
            strokeDasharray="300"
            strokeDashoffset="300"
            className="animate-[drawPath_4s_linear_infinite]"
          />
          {/* Pistas a sensores externos */}
          <path
            d="M 280 120 L 330 120 L 360 90 L 380 90"
            strokeDasharray="200"
            strokeDashoffset="200"
            className="animate-[drawPath_3s_ease-in-out_infinite_0.8s]"
          />
          <path
            d="M 280 180 L 330 180 L 360 210 L 380 210"
            strokeDasharray="200"
            strokeDashoffset="200"
            className="animate-[drawPath_3s_ease-in-out_infinite_1.2s]"
          />
        </g>

        {/* 3. Puntos de soldadura y Pads */}
        <g fill="#60a5fa">
          <circle cx="150" cy="120" r="3.5" />
          <circle cx="150" cy="180" r="3.5" />
          <circle cx="380" cy="90" r="4" fill="#38bdf8" />
          <circle cx="380" cy="210" r="4" fill="#38bdf8" />
        </g>

        {/* 4. Componentes Periféricos que se ensamblan */}
        {/* Resistencia 1 */}
        <rect x="95" y="115" width="22" height="10" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        {/* Resistencia 2 */}
        <rect x="95" y="175" width="22" height="10" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        {/* Condensadores */}
        <rect x="135" y="70" width="12" height="16" rx="2" fill="#0ea5e9" />
        <rect x="135" y="210" width="12" height="16" rx="2" fill="#0ea5e9" />

        {/* LED de estado en la placa */}
        <circle cx="360" cy="60" r="6" fill="#22c55e" className="animate-pulse" filter="url(#circuitGlow)" />
        <text x="345" y="45" fill="#86efac" fontSize="9" fontFamily="monospace" fontWeight="bold">PWR_OK</text>

        {/* 5. Microcontrolador Central que desciende y encaja (Animación de ensamblado) */}
        <g className="animate-[chipSnap_4s_ease-in-out_infinite]">
          {/* Socket del chip en la placa (sombra/guía) */}
          <rect
            x="170"
            y="100"
            width="110"
            height="100"
            rx="8"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
          />

          {/* Pines metálicos a la izquierda y derecha */}
          <g fill="#94a3b8">
            {/* Pines Izquierda */}
            <rect x="162" y="112" width="10" height="4" rx="1" />
            <rect x="162" y="124" width="10" height="4" rx="1" />
            <rect x="162" y="136" width="10" height="4" rx="1" />
            <rect x="162" y="148" width="10" height="4" rx="1" />
            <rect x="162" y="160" width="10" height="4" rx="1" />
            <rect x="162" y="172" width="10" height="4" rx="1" />
            <rect x="162" y="184" width="10" height="4" rx="1" />

            {/* Pines Derecha */}
            <rect x="278" y="112" width="10" height="4" rx="1" />
            <rect x="278" y="124" width="10" height="4" rx="1" />
            <rect x="278" y="136" width="10" height="4" rx="1" />
            <rect x="278" y="148" width="10" height="4" rx="1" />
            <rect x="278" y="160" width="10" height="4" rx="1" />
            <rect x="278" y="172" width="10" height="4" rx="1" />
            <rect x="278" y="184" width="10" height="4" rx="1" />
          </g>

          {/* Cuerpo del Microcontrolador */}
          <rect
            x="170"
            y="100"
            width="110"
            height="100"
            rx="8"
            fill="url(#chipGrad)"
            stroke="#60a5fa"
            strokeWidth="2"
            filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"
          />

          {/* Detalle interno del procesador */}
          <rect x="180" y="110" width="90" height="80" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx="185" cy="115" r="2.5" fill="#94a3b8" /> {/* Muesca pin 1 */}

          {/* Logo / Texto del chip */}
          <text x="225" y="142" textAnchor="middle" fill="#60a5fa" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            MIACON
          </text>
          <text x="225" y="158" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            ESP32-S3
          </text>
          <text x="225" y="174" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
            240MHz • RTOS
          </text>

          {/* Líneas guía de encaje animadas (indicadores de ensamble) */}
          <line x1="225" y1="75" x2="225" y2="92" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
          <polygon points="225,97 221,90 229,90" fill="#60a5fa" />
        </g>

        {/* 6. Partículas luminosas de corriente eléctrica en movimiento */}
        <circle cx="80" cy="145" r="3" fill="#60a5fa" filter="url(#circuitGlow)">
          <animate attributeName="cx" values="45;100;150;170" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="120" r="3" fill="#38bdf8" filter="url(#circuitGlow)">
          <animate attributeName="cx" values="280;330;380" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Definición de animaciones CSS en línea para garantizar fluidez sin dependencias */}
      <style jsx>{`
        @keyframes drawPath {
          0% {
            stroke-dashoffset: 200;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -200;
          }
        }
        @keyframes chipSnap {
          0%, 100% {
            transform: translateY(0px);
          }
          40% {
            transform: translateY(-16px);
          }
          60% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 02 // FASE DE ADQUISICIÓN
 * Gráfico animado de comunicación y telemetría entre dos antenas (Transmisor <-> Receptor).
 * Muestra ondas electromagnéticas expansivas, paquetes de datos en vuelo y telemetría activa.
 */
export function AntennaTransmissionGraphic() {
  return (
    <div className="relative w-full max-w-lg h-[360px] flex items-center justify-center p-4">
      {/* Fondo tecnológico de radiofrecuencia */}
      <div className="absolute inset-0 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Grilla de radar */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        {/* Línea de horizonte de señal */}
        <div className="absolute bottom-8 left-0 right-0 h-px bg-blue-500/20" />

        {/* Trama de datos superior */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-blue-400/80 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            TX_NODE // MIACON_PLANT
          </span>
          <span className="text-slate-500 font-bold">2.4 GHz RF LINK</span>
          <span className="text-blue-300">RX_HOST // CLOUD_BROKER</span>
        </div>
      </div>

      <svg
        viewBox="0 0 500 320"
        className="w-full h-full relative z-10 select-none drop-shadow-lg"
      >
        <defs>
          <filter id="rfGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. ANTENA TRANSMISORA IZQUIERDA (Nodo Sensor / Miacon) */}
        {/* ======================================================== */}
        <g id="transmitter-tower">
          {/* Base de la torre */}
          <polygon points="70,270 110,270 95,140 85,140" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          {/* Celosía / Refuerzos en X */}
          <line x1="75" y1="260" x2="102" y2="210" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="105" y1="260" x2="78" y2="210" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="80" y1="210" x2="100" y2="160" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="100" y1="210" x2="80" y2="160" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />

          {/* Mástil superior y emisor */}
          <line x1="90" y1="140" x2="90" y2="90" stroke="#60a5fa" strokeWidth="3.5" />
          <circle cx="90" cy="85" r="7" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />

          {/* Luz LED en la punta de la torre emisora */}
          <circle cx="90" cy="85" r="3.5" fill="#60a5fa" className="animate-pulse" filter="url(#rfGlow)" />

          {/* Etiqueta de la antena emisora */}
          <text x="90" y="295" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">
            TX [01]
          </text>
        </g>

        {/* Ondas Electromagnéticas Expansivas desde la Antena Transmisora */}
        <g stroke="#38bdf8" fill="none" opacity="0.75">
          {/* Arco 1 */}
          <path d="M 105 60 A 35 35 0 0 1 105 110" strokeWidth="2">
            <animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-width" values="3;1" dur="2.4s" repeatCount="indefinite" />
          </path>
          {/* Arco 2 */}
          <path d="M 120 45 A 55 55 0 0 1 120 125" strokeWidth="2.5">
            <animate attributeName="opacity" values="0.8;0" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
          </path>
          {/* Arco 3 */}
          <path d="M 138 30 A 75 75 0 0 1 138 140" strokeWidth="2">
            <animate attributeName="opacity" values="0.6;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </path>
        </g>

        {/* ======================================================== */}
        {/* 2. CANAL DE PROPAGACIÓN Y PAQUETES EN VUELO */}
        {/* ======================================================== */}
        {/* Línea central punteada de enlace */}
        <path
          d="M 90 85 Q 250 40 410 85"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Señal modulada senoidal en el centro */}
        <path
          d="M 140 85 Q 160 70 180 85 T 220 85 T 260 85 T 300 85 T 340 85 T 360 85"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="160"
          className="animate-[drawSignal_2.5s_linear_infinite]"
        />

        {/* Paquetes de datos volando de TX a RX */}
        <g fill="#38bdf8" filter="url(#rfGlow)">
          {/* Paquete 1 */}
          <circle r="4">
            <animateMotion
              path="M 90 85 Q 250 40 410 85"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Paquete 2 */}
          <circle r="3.5">
            <animateMotion
              path="M 90 85 Q 250 40 410 85"
              dur="2.4s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Paquete 3 */}
          <circle r="3">
            <animateMotion
              path="M 90 85 Q 250 40 410 85"
              dur="2.4s"
              begin="1.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Tarjeta flotante de telemetría de datos en vivo */}
        <g transform="translate(190, 115)">
          <rect x="0" y="0" width="120" height="38" rx="8" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
          <text x="60" y="16" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="bold">
            DATA PACKET #42
          </text>
          <text x="60" y="29" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="monospace">
            VAL: 52.4°C | 115200bps
          </text>
        </g>

        {/* ======================================================== */}
        {/* 3. ANTENA RECEPTORA DERECHA (Estación Base / Servidor) */}
        {/* ======================================================== */}
        <g id="receiver-tower">
          {/* Base de la torre receptora */}
          <polygon points="390,270 430,270 415,140 405,140" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          {/* Refuerzos de celosía */}
          <line x1="395" y1="260" x2="422" y2="210" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="425" y1="260" x2="398" y2="210" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="400" y1="210" x2="420" y2="160" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          <line x1="420" y1="210" x2="400" y2="160" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />

          {/* Mástil superior */}
          <line x1="410" y1="140" x2="410" y2="90" stroke="#60a5fa" strokeWidth="3.5" />

          {/* Plato / Domo Receptor parabólico */}
          <path d="M 398 68 A 18 18 0 0 0 398 102" fill="none" stroke="#93c5fd" strokeWidth="3.5" />
          <circle cx="410" cy="85" r="7" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />

          {/* LED de sincronización / recepción activa */}
          <circle cx="410" cy="85" r="3.5" fill="#4ade80" className="animate-ping" filter="url(#rfGlow)" />

          {/* Barras de intensidad de señal encima del receptor */}
          <g transform="translate(398, 48)">
            <rect x="0" y="14" width="4" height="6" rx="1" fill="#4ade80" />
            <rect x="7" y="10" width="4" height="10" rx="1" fill="#4ade80" />
            <rect x="14" y="6" width="4" height="14" rx="1" fill="#4ade80" />
            <rect x="21" y="2" width="4" height="18" rx="1" fill="#4ade80" />
          </g>

          {/* Etiqueta de la antena receptora */}
          <text x="410" y="295" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">
            RX [HUB]
          </text>
        </g>

        {/* Ondas de recepción capturadas en la antena derecha */}
        <g stroke="#4ade80" fill="none" opacity="0.7">
          <path d="M 395 62 A 35 35 0 0 0 395 108" strokeWidth="2">
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>

      {/* Estilos CSS para animación de onda */}
      <style jsx>{`
        @keyframes drawSignal {
          0% {
            stroke-dashoffset: 160;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
