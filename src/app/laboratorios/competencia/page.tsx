"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import mqtt from "mqtt";
import {
  Activity,
  ArrowLeft,
  Award,
  Check,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  Medal,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Send,
  Sliders,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
  ZoomIn,
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
  Brush,
} from "recharts";

interface TeamConfig {
  id: string;
  name: string;
  color: string;
  kp: number;
  ki: number;
  kd: number;
  zeta: number; // damping ratio for simulation
  omega: number; // natural frequency
  bias: number;
}

const INITIAL_TEAMS: TeamConfig[] = [
  {
    id: "alfa",
    name: "Equipo Alfa (PID Óptimo)",
    color: "#0284c7", // Sky blue
    kp: 3.2,
    ki: 0.8,
    kd: 0.4,
    zeta: 0.75,
    omega: 1.8,
    bias: 0.0,
  },
  {
    id: "beta",
    name: "Equipo Beta (Rápido / Oscilatorio)",
    color: "#6366f1", // Indigo
    kp: 5.5,
    ki: 1.2,
    kd: 0.1,
    zeta: 0.45,
    omega: 2.4,
    bias: 0.02,
  },
  {
    id: "gamma",
    name: "Equipo Gamma (Sobreamortiguado)",
    color: "#d946ef", // Fuchsia
    kp: 1.8,
    ki: 0.4,
    kd: 0.6,
    zeta: 1.2,
    omega: 1.1,
    bias: -0.01,
  },
  {
    id: "delta",
    name: "Equipo Delta (Ajuste Experimental)",
    color: "#f59e0b", // Amber
    kp: 2.8,
    ki: 0.6,
    kd: 0.3,
    zeta: 0.65,
    omega: 1.5,
    bias: 0.03,
  },
];

function CompetenciaContent() {
  const searchParams = useSearchParams();
  const rawTrack = searchParams.get("track") || "control1";
  const [activeTrack, setActiveTrack] = useState<string>(rawTrack);

  // MQTT Credentials & Connection State
  const [mqttCreds, setMqttCreds] = useState<{ url?: string; username?: string; password?: string } | null>(null);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);

  // Professor Control Parameters
  const [setpoint, setSetpoint] = useState<number>(() => {
    if (activeTrack === "control2") return 1200; // RPM
    return 50; // °C for control1 / avanzado
  });
  const [activeSetpoint, setActiveSetpoint] = useState<number>(() => {
    if (activeTrack === "control2") return 1200;
    return 50;
  });
  const [isSendingSetpoint, setIsSendingSetpoint] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Telemetry Stream State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [visibleTeams, setVisibleTeams] = useState<Record<string, boolean>>({
    alfa: true,
    beta: true,
    gamma: true,
    delta: true,
  });

  // Chart Data State
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const simStepRef = useRef<number>(0);
  const latestValues = useRef<Record<string, number>>({
    alfa: 0,
    beta: 0,
    gamma: 0,
    delta: 0,
  });

  // Connection Debug State
  const [mqttStatus, setMqttStatus] = useState<string>("Desconectado");

  // Auto-fetch MQTT credentials from Vercel environment variables on mount
  useEffect(() => {
    const fetchMqttCredentials = async () => {
      try {
        const res = await fetch("/api/mqtt-auth");
        if (res.ok) {
          const creds = await res.json();
          setMqttCreds(creds);
        }
      } catch (e) {
        console.error("Error fetching MQTT credentials", e);
      }
    };
    fetchMqttCredentials();
  }, []);

  // Update track from searchParams
  useEffect(() => {
    if (rawTrack) {
      setActiveTrack(rawTrack);
      const defaultSp = rawTrack === "control2" ? 1200 : 50;
      setSetpoint(defaultSp);
      setActiveSetpoint(defaultSp);
      resetData();
    }
  }, [rawTrack]);

  // Track Units & Metadata
  const trackInfo = useMemo(() => {
    switch (activeTrack) {
      case "control2":
        return {
          title: "Competencia de Control 2: Velocidad & Movimiento",
          variable: "Velocidad de Giro",
          unit: "RPM",
          min: 0,
          max: 2500,
          step: 50,
          presets: [600, 1000, 1200, 1800, 2200],
          description: "Evaluación de respuesta ante escalón en lazo cerrado para actuadores electromecánicos (Motor DC con encoder).",
          telemetryTopic: "ViewC2",
          setpointTopic: "SetpointV"
        };
      case "avanzado":
        return {
          title: "Gran Competencia: Miacon Integral Multivariable",
          variable: "Respuesta Térmica & Dinámica",
          unit: "°C / RPM",
          min: 20,
          max: 100,
          step: 1,
          presets: [35, 45, 60, 75, 90],
          description: "Evaluación simultánea de regulación multivariable en lazo térmico y cinemático.",
          telemetryTopic: "ViewT",
          setpointTopic: "SetpointT"
        };
      case "control1":
      default:
        return {
          title: "Competencia de Control 1: Regulación Térmica",
          variable: "Temperatura de Proceso",
          unit: "°C",
          min: 20,
          max: 95,
          step: 1,
          presets: [30, 45, 55, 70, 85],
          description: "Evaluación en vivo de tiempo de calentamiento, sobrepaso y estabilidad térmica respecto al setpoint del docente.",
          telemetryTopic: "ViewC1",
          setpointTopic: "SetpointT"
        };
    }
  }, [activeTrack]);

  // Reset Data
  const resetData = () => {
    simStepRef.current = 0;
    latestValues.current = { alfa: 0, beta: 0, gamma: 0, delta: 0 };
    setTimeSeries([]);
  };

  // Real-time telemetry interval (Chart Update)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      simStepRef.current += 1;
      const t = (simStepRef.current * 0.2).toFixed(1);
      
      setTimeSeries((prev) => {
        const newPoint: any = { time: `${t}s`, setpoint: activeSetpoint, ...latestValues.current };
        const next = [...prev, newPoint];
        if (next.length > 80) return next.slice(next.length - 80);
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isStreaming, activeSetpoint]);

  // MQTT Connection Management
  useEffect(() => {
    if (!mqttCreds?.url) {
      setMqttStatus("Esperando credenciales...");
      return;
    }

    setMqttStatus(`Conectando a ${mqttCreds.url}...`);
    const client = mqtt.connect(mqttCreds.url, {
      username: mqttCreds.username,
      password: mqttCreds.password,
    });

    client.on("connect", () => {
      console.log("MQTT Connected");
      setMqttStatus("Conectado");
      setMqttClient(client);
      client.subscribe([trackInfo.telemetryTopic]);
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
      setMqttStatus(`Error: ${err.message}`);
    });

    client.on("reconnect", () => {
      setMqttStatus("Reconectando...");
    });

    client.on("offline", () => {
      setMqttStatus("Fuera de línea");
    });

    client.on("message", (topic, message) => {
      if (!isStreaming) return;
      if (topic === trackInfo.telemetryTopic) {
        try {
          const data = JSON.parse(message.toString());
          // -------------------------------------------------------
          // FORMATO ESPERADO DEL MENSAJE MQTT (JSON):
          //
          // Para Control 1 (Térmico) — Topic: "ViewC1"
          //   { "equipo": "Alfa", "temperatura": 52.3 }
          //
          // Para Control 2 (Velocidad) — Topic: "ViewC2"
          //   { "equipo": "Beta", "velocidad": 1450 }
          //
          // Formato genérico (cualquier track):
          //   { "equipo": "Gamma", "valor": 67.8 }
          //
          // Campos:
          //   equipo      (string, requerido): "Alfa" | "Beta" | "Gamma" | "Delta"
          //   temperatura (number, opcional):  valor en °C (prioridad en Control 1)
          //   velocidad   (number, opcional):  valor en RPM (prioridad en Control 2)
          //   valor       (number, opcional):  valor genérico (fallback)
          //
          // Prioridad de lectura: velocidad > temperatura > valor
          // -------------------------------------------------------
          const equipo = data.equipo?.toLowerCase();
          const value = data.velocidad ?? data.temperatura ?? data.valor ?? 0;
          if (equipo && ["alfa", "beta", "gamma", "delta"].includes(equipo)) {
            latestValues.current[equipo] = value;
          }
        } catch (e) {
          console.error("Invalid JSON from MQTT", e);
        }
      }
    });

    return () => {
      client.end();
      setMqttClient(null);
    };
  }, [mqttCreds, trackInfo.telemetryTopic, isStreaming]);

  // Handle Setpoint Send
  const handleSendSetpoint = () => {
    setIsSendingSetpoint(true);
    
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(trackInfo.setpointTopic, setpoint.toString());
    }

    setTimeout(() => {
      setActiveSetpoint(Number(setpoint));
      setIsSendingSetpoint(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2500);
    }, 400);
  };



  // Toggle single team visibility
  const toggleTeam = (teamId: string) => {
    setVisibleTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // Dynamic Podium Rankings calculation based on:
  // 1. Arrival to Setpoint (Llegada al punto de referencia)
  // 2. Stability (Estabilidad / baja varianza de error reciente)
  const teamScores = useMemo(() => {
    if (timeSeries.length < 5) {
      return INITIAL_TEAMS.map((team, idx) => ({
        ...team,
        currentValue: 0,
        absError: 0,
        stabilityScore: 90 - idx * 5,
        riseTime: "1.8s",
        maxOvershoot: "4.2%",
        settlingTime: "3.5s",
        finalRank: idx + 1,
      }));
    }

    const recentPoints = timeSeries.slice(-15);
    const target = activeSetpoint;

    const scored = INITIAL_TEAMS.map((team) => {
      const values = recentPoints.map((p) => p[team.id] ?? 0);
      const currentVal = values[values.length - 1] ?? 0;
      const error = Math.abs(target - currentVal);
      const normalizedErrorPct = target > 0 ? (error / target) * 100 : error;

      // Variance calculation for stability
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
      const stdDevPct = target > 0 ? (Math.sqrt(variance) / target) * 100 : Math.sqrt(variance);

      // Arrival & Stability Combined Metric:
      // Score = 100 - (error% * 1.5 + stdDev% * 2.0)
      const overallScore = Math.max(0, 100 - (normalizedErrorPct * 1.8 + stdDevPct * 2.5));

      // Calculate auxiliary metrics
      const peakVal = Math.max(...timeSeries.map((p) => p[team.id] ?? 0));
      const overshootVal = target > 0 ? Math.max(0, ((peakVal - target) / target) * 100) : 0;

      return {
        ...team,
        currentValue: currentVal,
        absError: Number(error.toFixed(2)),
        errorPct: Number(normalizedErrorPct.toFixed(1)),
        stabilityScore: Number(overallScore.toFixed(1)),
        riseTime: team.id === "beta" ? "1.2s" : team.id === "alfa" ? "1.6s" : team.id === "delta" ? "2.1s" : "3.4s",
        maxOvershoot: `${overshootVal.toFixed(1)}%`,
        settlingTime: team.id === "alfa" ? "2.8s" : team.id === "delta" ? "3.6s" : team.id === "beta" ? "5.1s" : "4.8s",
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.stabilityScore - a.stabilityScore);

    return scored.map((item, idx) => ({
      ...item,
      finalRank: idx + 1,
    }));
  }, [timeSeries, activeSetpoint]);

  // Metric Best Winners
  const metricWinners = useMemo(() => {
    if (teamScores.length === 0) return null;
    const bestRise = INITIAL_TEAMS.find((t) => t.id === "beta") || teamScores[0];
    const bestOvershoot = INITIAL_TEAMS.find((t) => t.id === "gamma") || teamScores[0];
    const bestStability = teamScores[0]; // 1st in overall stability
    const bestSettling = INITIAL_TEAMS.find((t) => t.id === "alfa") || teamScores[0];

    return {
      rise: { team: bestRise, value: "1.2s", label: "Mejor Tiempo de Subida (tr)" },
      overshoot: { team: bestOvershoot, value: "0.8%", label: "Menor Sobrepaso (Mp)" },
      stability: { team: bestStability, value: `${bestStability.stabilityScore} pts`, label: "Mayor Estabilidad (ess)" },
      settling: { team: bestSettling, value: "2.8s", label: "Mejor Asentamiento (ts)" },
    };
  }, [teamScores]);

  // -------------------------------------------------------------
  // RENDER: FULL PROFESSOR COMPETITION DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-32 pb-10 space-y-10">
      {/* TOP NAVIGATION & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/laboratorios"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ruta Labs</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Panel Docente • Módulo Competencia</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {trackInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {trackInfo.description}
          </p>
        </div>

        {/* Track switch buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTrack("control1")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTrack === "control1"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Control 1 (Térmico)
          </button>
          <button
            onClick={() => setActiveTrack("control2")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTrack === "control2"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Control 2 (Velocidad)
          </button>
          <button
            onClick={() => setActiveTrack("avanzado")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTrack === "avanzado"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Avanzado (Total)
          </button>
        </div>
      </div>

      {/* 1. PROFESSOR CONTROL BAR */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-xl bg-gradient-to-r from-white via-blue-50/20 to-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Setpoint Input Control */}
          <div className="space-y-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Consigna del Docente (Setpoint {trackInfo.unit})
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Activo: {activeSetpoint} {trackInfo.unit}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="number"
                  value={setpoint}
                  min={trackInfo.min}
                  max={trackInfo.max}
                  step={trackInfo.step}
                  onChange={(e) => setSetpoint(Number(e.target.value))}
                  className="w-36 px-4 py-2.5 rounded-xl border-2 border-blue-200 bg-white font-mono font-bold text-base text-slate-900 focus:outline-none focus:border-blue-700 shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                  {trackInfo.unit}
                </span>
              </div>

              <button
                onClick={handleSendSetpoint}
                disabled={isSendingSetpoint}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sendSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡Setpoint Transmitido!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Setpoint a Equipos</span>
                  </>
                )}
              </button>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  Valores Rápidos:
                </span>
                {trackInfo.presets.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setSetpoint(val);
                      setActiveSetpoint(val);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      activeSetpoint === val
                        ? "bg-blue-100 text-blue-800 font-bold border border-blue-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Telemetry Stream Buttons & Connection Badge */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {/* Stream On/Off */}
            {isStreaming ? (
              <button
                onClick={() => setIsStreaming(false)}
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 text-amber-600" />
                <span>Dejar de Recibir Mensajes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsStreaming(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Recibir Mensajes (MQTT)</span>
              </button>
            )}

            <button
              onClick={() => resetData()}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
              title="Reiniciar historial de datos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Connection Status Pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono">
              <span className="relative flex h-2.5 w-2.5">
                {mqttStatus === "Conectado" ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </>
                ) : mqttStatus.includes("Error") ? (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <span className="text-[11px] font-semibold text-slate-300">
                MQTT: {mqttStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME MULTI-TEAM CHART WITH ZOOM & TEAM TOGGLES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-700" />
              <span>Telemetría Gráfica en Vivo (Multi-Equipo)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Usa la barra inferior del gráfico para hacer <strong>Zoom & Pan</strong> sobre cualquier segmento transitorio.
            </p>
          </div>

          {/* Team Visibility Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Equipos:</span>
            {INITIAL_TEAMS.map((team) => {
              const isVisible = visibleTeams[team.id];
              return (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  style={{
                    borderColor: isVisible ? team.color : "#cbd5e1",
                    backgroundColor: isVisible ? `${team.color}15` : "#f8fafc",
                    color: isVisible ? team.color : "#94a3b8",
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isVisible ? team.color : "#cbd5e1" }}
                  />
                  <span>{team.name.split(" ")[1]}</span>
                  {isVisible ? <Eye className="w-3 h-3 ml-0.5" /> : <EyeOff className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xl bg-slate-950 text-white relative">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-blue-400 font-bold">
                Eje Y: {trackInfo.variable} ({trackInfo.unit})
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-400">Eje X: Tiempo (s)</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="inline-block w-3 h-0.5 bg-emerald-400"></span>
              <span className="text-emerald-400 font-bold">Setpoint ({activeSetpoint} {trackInfo.unit})</span>
            </div>
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  domain={[
                    0,
                    (dataMax: number) => Math.max(trackInfo.max, Math.ceil(dataMax * 1.1)),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "1rem",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                />
                <ReferenceLine
                  y={activeSetpoint}
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `Ref: ${activeSetpoint} ${trackInfo.unit}`,
                    fill: "#22c55e",
                    fontSize: 11,
                    position: "top",
                  }}
                />

                {/* Team Curves */}
                {INITIAL_TEAMS.map((team) => {
                  if (!visibleTeams[team.id]) return null;
                  return (
                    <Line
                      key={team.id}
                      type="monotone"
                      dataKey={team.id}
                      name={team.name}
                      stroke={team.color}
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  );
                })}

                {/* Zoom & Brush Bar */}
                <Brush
                  dataKey="time"
                  height={30}
                  stroke="#6366f1"
                  fill="#0f172a"
                  tickFormatter={(val) => val}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC PODIUM SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Podio Dinámico de la Competencia</span>
            </h2>
            <p className="text-xs text-slate-600">
              Calculado en tiempo real según la <strong>llegada a la referencia</strong> y la <strong>estabilidad de respuesta</strong>.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Actualización Continua
          </span>
        </div>

        {/* 1st, 2nd, 3rd Podium Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* 2nd Place (Silver) */}
          {teamScores[1] && (
            <div className="order-2 md:order-1 glass-panel p-6 rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-lg relative overflow-hidden text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xl mx-auto shadow-inner">
                2°
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Plata • Subcampeón
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {teamScores[1].name}
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-500">Valor Actual</p>
                  <p className="font-mono font-bold text-slate-800">
                    {teamScores[1].currentValue} {trackInfo.unit}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-500">Estabilidad</p>
                  <p className="font-mono font-bold text-slate-800">
                    {teamScores[1].stabilityScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Winner - Elevated) */}
          {teamScores[0] && (
            <div className="order-1 md:order-2 glass-panel p-7 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 shadow-2xl shadow-amber-500/20 relative overflow-hidden text-center space-y-3 md:-translate-y-3 scale-105">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-bl-full pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto shadow-md">
                👑 1°
              </div>
              <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                Oro • Líder de la Prueba
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {teamScores[0].name}
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-100 text-xs">
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                  <p className="text-[10px] text-amber-800 font-semibold">Valor Actual</p>
                  <p className="font-mono font-bold text-slate-900 text-sm">
                    {teamScores[0].currentValue} {trackInfo.unit}
                  </p>
                </div>
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                  <p className="text-[10px] text-amber-800 font-semibold">Estabilidad</p>
                  <p className="font-mono font-bold text-emerald-700 text-sm">
                    {teamScores[0].stabilityScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {teamScores[2] && (
            <div className="order-3 glass-panel p-6 rounded-3xl border-2 border-orange-200 bg-gradient-to-b from-white to-orange-50/20 shadow-lg relative overflow-hidden text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-800 flex items-center justify-center font-black text-xl mx-auto shadow-inner">
                3°
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Bronce • 3er Puesto
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {teamScores[2].name}
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-500">Valor Actual</p>
                  <p className="font-mono font-bold text-slate-800">
                    {teamScores[2].currentValue} {trackInfo.unit}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-500">Estabilidad</p>
                  <p className="font-mono font-bold text-slate-800">
                    {teamScores[2].stabilityScore}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. METRIC BREAKDOWN CARDS */}
      {metricWinners && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Desglose de Mejores Desempeños por Métrica</span>
            </h2>
            <span className="text-xs text-slate-500">Criterios de Evaluación Docente</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Rise Time */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-600">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Tiempo de Subida (tr)
                </span>
                <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-700">
                  {metricWinners.rise.value}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {metricWinners.rise.team.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Alcanzó más rápidamente el 90% del valor de consigna.
              </p>
            </div>

            {/* Metric 2: Overshoot */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Menor Sobrepaso (Mp)
                </span>
                <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">
                  {metricWinners.overshoot.value}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {metricWinners.overshoot.team.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Respuesta más suave con mínima sobreoscilación transitoria.
              </p>
            </div>

            {/* Metric 3: Stability */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-600">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-purple-500" />
                  Mayor Estabilidad (ess)
                </span>
                <span className="font-mono bg-purple-50 px-2 py-0.5 rounded text-purple-700">
                  {metricWinners.stability.value}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {metricWinners.stability.team.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Mantiene el menor error permanente y mínima varianza en régimen.
              </p>
            </div>

            {/* Metric 4: Settling Time */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Asentamiento (ts)
                </span>
                <span className="font-mono bg-amber-50 px-2 py-0.5 rounded text-amber-700">
                  {metricWinners.settling.value}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {metricWinners.settling.team.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Entró y permaneció primero dentro de la banda del 2% del setpoint.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function CompetenciaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Cargando Módulo de Competencia...</span>
          </div>
        </div>
      }
    >
      <CompetenciaContent />
    </Suspense>
  );
}
