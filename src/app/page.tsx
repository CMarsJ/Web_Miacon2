"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cpu, MousePointer2, Activity, HardDrive, Terminal } from "lucide-react";
import miaconImg from "../../public/miacon.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Ensure ScrollTrigger recalculates after images or fonts load
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}

// --------------------------------------------------------
// COMPONENTS
// --------------------------------------------------------

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-text-1", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 })
        .from(".hero-text-2", { y: 40, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.6")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-btn", { scale: 0.9, opacity: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=0.4")
        .from(".hero-img-container", { scale: 0.9, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=1.5");

      gsap.to(".floating-hardware", {
        y: -20,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex items-center bg-dot-matrix overflow-hidden pt-20">
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div className="z-10 relative">
          <h1 className="flex flex-col gap-2 sm:gap-3">
            <span className="hero-text-1 font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-navy tracking-tight leading-tight">
              La teoría es el mapa
            </span>
            <span className="hero-text-2 font-space-tech font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary tracking-tight leading-tight">
              La experimentación es el territorio
            </span>
          </h1>
          <p className="hero-desc mt-8 text-lg md:text-xl text-text-secondary max-w-lg font-sans leading-relaxed">
            MIACON es un ecosistema interactivo que conecta las matemáticas del control automático con plantas físicas reales a través de telemetría IIoT.
          </p>
          <div className="hero-btn mt-10">
            <Link href="/laboratorios" className="btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/20 text-lg">
              <span>Descubre las prácticas</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right: Floating Photo */}
        <div className="hero-img-container relative h-[400px] lg:h-[600px] flex items-center justify-center pointer-events-none">
          <div className="floating-hardware relative w-full max-w-[600px] aspect-square flex items-center justify-center">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75"></div>
            <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full scale-50"></div>

            <Image
              src={miaconImg}
              alt="Prototipo físico MIACON"
              className="relative z-10 drop-shadow-[0_20px_50px_rgba(15,23,42,0.2)] object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}


function FeatureConnection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".node-link", { strokeDashoffset: 0, duration: 2, ease: "linear" })
        .to(".node-pulse", { scale: 1.5, opacity: 0, duration: 1, stagger: 0.2 }, "-=1");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full max-w-[250px]">
        {/* Connection lines */}
        <path className="node-link" d="M 40 50 L 160 50" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="10 5" strokeDashoffset="100" />
        <path className="node-link" d="M 40 50 L 160 50" stroke="#3B82F6" strokeWidth="3" strokeDasharray="100" strokeDashoffset="100" />

        {/* Nodes */}
        <g transform="translate(40, 50)">
          <circle className="node-pulse" r="20" fill="#3B82F6" opacity="0.5" />
          <circle r="12" fill="#1E40AF" />
          <rect x="-6" y="-6" width="12" height="12" fill="white" rx="2" />
        </g>

        <g transform="translate(160, 50)">
          <circle className="node-pulse" r="20" fill="#10B981" opacity="0.5" />
          <circle r="12" fill="#047857" />
          <path d="M-4 0 L-1 3 L5 -3" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function FeatureModeling() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".math-curve",
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, duration: 3, ease: "power2.out", repeat: -1, repeatDelay: 1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] bg-slate-900 rounded-2xl p-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <svg viewBox="0 0 250 120" className="w-full h-full max-w-[300px] z-10">
        <path d="M 20 100 L 230 100" stroke="#334155" strokeWidth="2" />
        <path d="M 20 100 L 20 20" stroke="#334155" strokeWidth="2" />
        <path d="M 20 100 Q 80 100, 100 40 T 230 30" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
        <path className="math-curve" d="M 20 100 Q 80 100, 100 40 T 230 30" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="300" />
      </svg>
      <div className="absolute top-4 right-4 bg-blue-900/50 border border-blue-700/50 rounded px-2 py-1">
        <span className="text-blue-300 font-mono-data text-xs">G(s) = K / (τs + 1)</span>
      </div>
    </div>
  );
}

function FeatureTuning() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(".slider-1", { height: "80%", duration: 1.5, ease: "power1.inOut" }, 0)
        .to(".slider-2", { height: "30%", duration: 2, ease: "power2.inOut" }, 0)
        .to(".slider-3", { height: "60%", duration: 1.2, ease: "sine.inOut" }, 0);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-end gap-6">
      <div className="flex justify-around items-end h-32 w-full max-w-[200px] mx-auto">
        <div className="w-12 h-full bg-slate-100 rounded-full flex flex-col justify-end p-1 relative">
          <div className="slider-1 w-full h-[40%] bg-blue-500 rounded-full shadow-sm"></div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono-data text-xs font-bold text-slate-500">Kp</span>
        </div>
        <div className="w-12 h-full bg-slate-100 rounded-full flex flex-col justify-end p-1 relative">
          <div className="slider-2 w-full h-[70%] bg-emerald-500 rounded-full shadow-sm"></div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono-data text-xs font-bold text-slate-500">Ki</span>
        </div>
        <div className="w-12 h-full bg-slate-100 rounded-full flex flex-col justify-end p-1 relative">
          <div className="slider-3 w-full h-[20%] bg-purple-500 rounded-full shadow-sm"></div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono-data text-xs font-bold text-slate-500">Kd</span>
        </div>
      </div>
    </div>
  );
}

function FeatureTelemetry() {
  const messages = [
    "Conectando a broker MQTT...",
    "Subscrito a /planta/temp",
    "Temp = 45.2°C (SetPoint: 45.0)",
    "Error = 0.2",
    "Señal de control u(t) = 12.5%",
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [text, setText] = useState("");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const currentMsg = messages[msgIndex];
    let timeout: NodeJS.Timeout;

    if (charIndex < currentMsg.length) {
      timeout = setTimeout(() => {
        setText(currentMsg.substring(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setLines(prev => [...prev.slice(-3), currentMsg]);
        setText("");
        setCharIndex(0);
        setMsgIndex((m) => (m + 1) % messages.length);
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, msgIndex, messages]);

  return (
    <div className="w-full min-h-[200px] bg-[#0F172A] rounded-2xl p-5 shadow-inner font-mono-data text-xs sm:text-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-3">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-slate-400">mqtt_client.sh</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-end overflow-hidden space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-slate-500">{line}</p>
        ))}
        <p className="text-green-400 mt-1">
          <span className="text-blue-400">miacon</span>@<span className="text-purple-400">sys</span>:~$ {text}
          <span className="inline-block w-2 h-3 sm:h-4 bg-primary ml-1 animate-pulse"></span>
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-outfit font-bold text-navy mb-6">
            Del Modelo Teórico al <span className="text-primary font-space-tech">Hardware</span>
          </h2>
          <p className="text-text-secondary text-lg font-sans max-w-2xl mx-auto">
            Explora el recorrido integral de 4 etapas que conecta la adquisición de datos, el modelado en MATLAB, la sintonización PID y la telemetría en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Etapa 1 */}
          <div className="bg-light-blue border border-border rounded-[2rem] p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold font-mono-data text-sm">1</span>
              <h3 className="font-outfit font-bold text-xl text-navy">Conexión y Verificación de la Planta</h3>
            </div>
            <p className="text-text-secondary text-sm font-sans mb-6">Ensamble del hardware, verifica los sensores, actuadores y el microcontrolador central. </p>
            <div className="flex-grow">
              <FeatureConnection />
            </div>
          </div>

          {/* Etapa 2 */}
          <div className="bg-light-blue border border-border rounded-[2rem] p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold font-mono-data text-sm">2</span>
              <h3 className="font-outfit font-bold text-xl text-navy">Modelado Matemático: De los datos reales a la ecuación</h3>
            </div>
            <p className="text-text-secondary text-sm font-sans mb-6">Extrae la firma dinámica del sistema físico. Captura curvas de reacción en lazo abierto para estimar su función de transferencia y diseña controladores con MATLAB. </p>
            <div className="flex-grow">
              <FeatureModeling />
            </div>
          </div>

          {/* Etapa 3 */}
          <div className="bg-light-blue border border-border rounded-[2rem] p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold font-mono-data text-sm">3</span>
              <h3 className="font-outfit font-bold text-xl text-navy">Asume el reto de control</h3>
            </div>
            <p className="text-text-secondary text-sm font-sans mb-6">Calibra las ganancias Proporcional (Kp), Integral (Ki) y Derivativa (Kd) para dominar la planta física, observando al instante cómo tus decisiones impactan el sobrepaso y el tiempo de establecimiento.</p>
            <div className="flex-grow">
              <FeatureTuning />
            </div>
          </div>

          {/* Etapa 4 */}
          <div className="bg-light-blue border border-border rounded-[2rem] p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold font-mono-data text-sm">4</span>
              <h3 className="font-outfit font-bold text-xl text-navy">Telemetría en Vivo</h3>
            </div>
            <p className="text-text-secondary text-sm font-sans mb-6">Monitorea la dinámica física al instante. Adquiere datos en tiempo real a través de protocolos industriales IIoT (MQTT).</p>
            <div className="flex-grow">
              <FeatureTelemetry />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".split-line", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "center center",
          scrub: 1,
        },
        opacity: 0.1,
        y: 20,
        stagger: 0.5,
        duration: 2,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-40 bg-network-pattern flex items-center justify-center text-center px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-outfit font-bold tracking-tight text-white leading-tight">
          <div className="split-line text-slate-500 mb-4">Lo normal es simular en un software matemático ideal.</div>
          <div className="split-line text-white">Acá experimentaremos con</div>
          <div className="split-line text-primary font-space-tech">sistemas físicos reales</div>
          <div className="split-line text-slate-400 text-3xl md:text-4xl mt-4">desde cualquier dispositivo con MQTT.</div>
        </h2>
      </div>
    </section>
  );
}

function ArchiveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < 3) return;

      // Set initial positions
      gsap.set(cards[0], { yPercent: 0, scale: 1, opacity: 1, filter: "blur(0px)" });
      gsap.set([cards[1], cards[2]], { yPercent: 100, scale: 1, opacity: 1, filter: "blur(0px)" });

      // Unified timeline with pinned container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Card 1 (Telemetría Industrial) enters over Card 0
      tl.to(cards[1], {
        yPercent: 0,
        ease: "none",
        duration: 1,
      })
        .to(cards[0], {
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(12px)",
          ease: "none",
          duration: 1,
        }, "<")
        .to({}, { duration: 0.3 }) // reading buffer on Card 2

        // Card 2 (Análisis de Señales) enters over Card 1
        .to(cards[2], {
          yPercent: 0,
          ease: "none",
          duration: 1,
        })
        .to(cards[1], {
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(12px)",
          ease: "none",
          duration: 1,
        }, "<")
        .to({}, { duration: 0.5 }); // reading buffer on Card 3 before unpinning

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full">
      <section ref={containerRef} className="relative h-screen bg-base overflow-hidden">

        {/* Card 1: Hardware Abierto (Helix) */}
        <div
          ref={el => { cardsRef.current[0] = el }}
          className="absolute inset-0 w-full h-full bg-base flex items-center justify-center px-6 z-10 will-change-transform"
        >
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-mono-data font-bold tracking-widest text-sm mb-4 block">01 // FASE DE ARQUITECTURA</span>
              <h2 className="text-5xl md:text-7xl font-outfit font-bold text-navy mb-6">Hardware<br /><span className="font-space-tech text-primary">Abierto y Replicable</span></h2>
              <p className="text-lg text-text-secondary max-w-md">Estructuras impresas en 3D, actuadores de grado industrial y microcontroladores accesibles. Diseñado para que construyas tu propio laboratorio desde cero.</p>
            </div>
            <div className="h-[400px] flex items-center justify-center relative">
              <div className="w-64 h-64 border-[4px] border-primary rounded-full flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
                <div className="absolute w-[120%] h-[4px] bg-primary rotate-45"></div>
                <div className="absolute w-[120%] h-[4px] bg-primary -rotate-45"></div>
                <div className="w-48 h-48 border-[2px] border-blue-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Telemetría Industrial (Laser) */}
        <div
          ref={el => { cardsRef.current[1] = el }}
          className="absolute inset-0 w-full h-full bg-slate-50 flex items-center justify-center px-6 border-t border-slate-200 z-20 shadow-2xl will-change-transform"
        >
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-mono-data font-bold tracking-widest text-sm mb-4 block">02 // FASE DE ADQUISICIÓN</span>
              <h2 className="text-5xl md:text-7xl font-outfit font-bold text-navy mb-6">Telemetría<br /><span className="font-space-tech text-primary">Industrial</span></h2>
              <p className="text-lg text-text-secondary max-w-md">Lectura de sensores en tiempo real con baja latencia. Monitorea el comportamiento de la planta desde cualquier dispositivo de la red local.</p>
            </div>
            <div className="h-[400px] flex items-center justify-center relative overflow-hidden bg-slate-900 rounded-[2rem] w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              <div className="w-full h-1 bg-red-500 absolute top-0 shadow-[0_0_15px_5px_rgba(239,68,68,0.5)] animate-[bounce_4s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Card 3: Análisis de Señales (Waveform) */}
        <div
          ref={el => { cardsRef.current[2] = el }}
          className="absolute inset-0 w-full h-full bg-white flex items-center justify-center px-6 border-t border-slate-200 z-30 shadow-2xl will-change-transform"
        >
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-mono-data font-bold tracking-widest text-sm mb-4 block">03 // FASE DE VALIDACIÓN</span>
              <h2 className="text-5xl md:text-7xl font-outfit font-bold text-navy mb-6">Análisis de<br /><span className="font-space-tech text-primary">Señales</span></h2>
              <p className="text-lg text-text-secondary max-w-md">Evalúa el error en estado estacionario, el tiempo de establecimiento y el sobreimpulso comparando las gráficas del modelo matemático vs la planta real.</p>
            </div>
            <div className="h-[400px] flex items-center justify-center relative w-full">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <path d="M0 100 Q 50 100, 100 10 Q 150 -80, 200 80 T 300 120 T 400 90 T 500 100" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <path d="M0 100 Q 50 100, 100 10 Q 150 -80, 200 80 T 300 120 T 400 90 T 500 100" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="1000" strokeDashoffset="1000">
                  <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="3s" repeatCount="indefinite" fill="freeze" />
                </path>
              </svg>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

// --------------------------------------------------------
// MAIN PAGE
// --------------------------------------------------------

export default function Home() {
  return (
    <div className="w-full relative">
      <HeroSection />
      <FeaturesSection />
      <ManifestoSection />
      <ArchiveSection />
      <div className="h-24 w-full bg-base"></div>
    </div>
  );
}
