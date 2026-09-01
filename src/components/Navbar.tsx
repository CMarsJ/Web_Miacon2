"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Cpu, FlaskConical, Home, Wrench } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"ES" | "EN">("ES");

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-blue-100/80 transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex justify-between items-center h-16">

          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-800 via-blue-700 to-blue-500 p-0.5 shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    MIACON <span className="text-blue-700">2.0</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block font-mono-tech">
                  Control Systems Lab
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/"
              className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-blue-50 text-blue-800 shadow-sm border border-blue-200/60 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>

            <Link
              href="/aprendizaje"
              className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/aprendizaje")
                  ? "bg-blue-50 text-blue-800 shadow-sm border border-blue-200/60 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              <span>Aprendizaje</span>
            </Link>

            <Link
              href="/herramientas"
              className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/herramientas")
                  ? "bg-blue-50 text-blue-800 shadow-sm border border-blue-200/60 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Wrench className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Herramientas</span>
            </Link>

            <Link
              href="/laboratorios"
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive("/laboratorios")
                  ? "bg-green-700 text-white shadow-md shadow-green-200"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-green-200"
              }`}
            >
              <FlaskConical className="w-4 h-4 mr-1.5" />
              <span>Laboratorios</span>
              <span className="ml-2 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
              </span>
            </Link>

            {/* Language Toggle */}
            <div className="ml-1 flex items-center rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setLang("ES")}
                className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                  lang === "ES"
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                aria-label="Español"
              >
                🇪🇸 ES
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                  lang === "EN"
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                aria-label="English"
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
