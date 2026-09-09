import Link from "next/link";
import Image from "next/image";
import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-navy rounded-t-[3rem] mt-20 pt-20 pb-12 px-6 sm:px-12 z-20 text-text-secondary font-sans border-t border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Brand & Concept */}
        <div className="md:col-span-5 space-y-6">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <span className="font-outfit font-bold tracking-tight text-white text-2xl">
              MIACON <span className="text-primary font-medium text-xl ml-1">2026</span>
            </span>
          </Link>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
            Este proyecto fue creado para que aprendas haciendo, sin miedo y a tu propio ritmo.
          </p>

          <div className="flex items-center gap-3 mt-6 bg-slate-800/50 w-fit px-4 py-2 rounded-full border border-slate-700/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-mono-data text-slate-300 uppercase tracking-wider">
              Sistema operativo <span className="text-slate-500 mx-1">|</span> Activo
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="md:col-span-3">
          <h4 className="text-white font-outfit font-semibold mb-6">Plataforma</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
            <li><Link href="/aprendizaje" className="hover:text-primary transition-colors">Teoría Interactiva</Link></li>
            <li><Link href="/herramientas" className="hover:text-primary transition-colors">Herramientas Software</Link></li>
            <li><Link href="/laboratorios" className="hover:text-primary transition-colors">Entorno de Prácticas</Link></li>
          </ul>
        </div>

        {/* Hardware & Spec */}
        <div className="md:col-span-4">
          <h4 className="text-white font-outfit font-semibold mb-6">Especificaciones de Planta</h4>
          <ul className="space-y-4 text-sm font-mono-data text-slate-400">
            <li className="flex items-center gap-3">
              <span className="text-slate-600">01</span>
              <span>Variable Térmica (Lazo Cerrado)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-slate-600">02</span>
              <span>Velocidad Motor DC</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-slate-600">03</span>
              <span>Posición Angular</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-slate-600">04</span>
              <span>Telemetría IIoT (ESP32)</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom copy */}
      <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <Image
            src="/logoUIS.png"
            alt="UIS Logo"
            width={80}
            height={30}
            className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain w-auto h-6"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <p className="text-slate-500 text-center md:text-right max-w-xl">
          © 2026 Universidad Industrial de Santander. Proyecto educativo sin fines comerciales. Sitio en desarrollo como apoyo didáctico para prácticas de control.
        </p>
      </div>
    </footer>
  );
}
