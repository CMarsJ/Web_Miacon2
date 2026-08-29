import Link from "next/link";
import { Activity, BookOpen, Cpu, FlaskConical, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Desc */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-200">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Miacon <span className="text-indigo-600 font-mono">2.0</span>
              </span>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              Plataforma interactiva para la enseñanza y experimentación de teoría de control automático,
              modelado de plantas dinámicas y controladores PID para ingeniería.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                Sistema Miacon 2.0 Operativo
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                Interactivo v2.0
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/aprendizaje" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Teoría Interactiva</span>
                </Link>
              </li>
              <li>
                <Link href="/laboratorios" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Ruta de Laboratorios</span>
                </Link>
              </li>
              <li>
                <Link href="/laboratorios/lab0" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Lab 0: Construcción</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Módulos de Control
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>1. Fundamentos y Lazo</span>
                <span className="text-indigo-600 font-bold">Activo</span>
              </li>
              <li className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>2. Control Proporcional (P)</span>
                <span className="text-indigo-600 font-bold">Activo</span>
              </li>
              <li className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>3. Control PI</span>
                <span className="text-indigo-600 font-bold">Activo</span>
              </li>
              <li className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>4. Control PID Completo</span>
                <span className="text-indigo-600 font-bold">Activo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 text-sm">Miacon 2026</span>
            <span>— Plataforma de Aprendizaje y Experimentación de Control.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              Desarrollado para Ingeniería con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
