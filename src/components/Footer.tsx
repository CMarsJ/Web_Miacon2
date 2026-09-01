import Link from "next/link";
import Image from "next/image";
import { Activity, BookOpen, Cpu, FlaskConical, Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-[#0F172A] border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-800 via-blue-700 to-blue-500 flex items-center justify-center shadow-md shadow-blue-900">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                MIACON <span className="text-blue-400 font-mono-tech">2.0</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Plataforma interactiva para la enseñanza y experimentación de teoría de
              control automático, modelado de plantas dinámicas y controladores PID
              para ingeniería.
            </p>

            {/* UIS Logo */}
            <div className="pt-2">
              <Image
                src="/logoUIS.png"
                alt="Universidad Industrial de Santander"
                width={120}
                height={40}
                className="opacity-60 hover:opacity-90 transition-opacity w-auto h-10"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">
              Navegación
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/aprendizaje" className="hover:text-white transition-colors flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>Aprendizaje</span>
                </Link>
              </li>
              <li>
                <Link href="/herramientas" className="hover:text-white transition-colors flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-blue-500" />
                  <span>Herramientas</span>
                </Link>
              </li>
              <li>
                <Link href="/laboratorios" className="hover:text-white transition-colors flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-green-500" />
                  <span>Ruta de Laboratorios</span>
                </Link>
              </li>
              <li>
                <Link href="/laboratorios/lab0" className="hover:text-white transition-colors flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-green-500" />
                  <span>Lab 0: Construcción</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5">
              Módulos de Control
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                "1. Fundamentos y Lazo",
                "2. Control Proporcional (P)",
                "3. Control PI",
                "4. Control PID Completo",
              ].map((module, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60"
                >
                  <span className="text-slate-300">{module}</span>
                  <span className="text-green-500 font-bold text-[10px]">Activo</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300 text-sm">MIACON 2.0</span>
            <span className="ml-2">— Plataforma de Aprendizaje y Experimentación de Control.</span>
          </div>
          <div className="text-center sm:text-right">
            <p>&copy; 2026 Universidad Industrial de Santander.</p>
            <p className="text-slate-600">Proyecto educativo sin fines comerciales.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

