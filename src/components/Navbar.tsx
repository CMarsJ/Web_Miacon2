"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Cpu, FlaskConical, Home, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-indigo-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Miacon <span className="text-indigo-600">2.0</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Control Systems Lab
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Link
              href="/"
              className={`flex items-center px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200/60 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>

            <Link
              href="/aprendizaje"
              className={`flex items-center px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/aprendizaje")
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200/60 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              <span>Aprendizaje</span>
            </Link>

            <Link
              href="/laboratorios"
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive("/laboratorios")
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-900 text-white hover:bg-indigo-600 shadow-sm"
              }`}
            >
              <FlaskConical className="w-4 h-4 mr-1.5" />
              <span>Laboratorios</span>
              <span className="ml-1.5 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
