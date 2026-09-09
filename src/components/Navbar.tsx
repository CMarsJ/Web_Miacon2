"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Globe } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"ES" | "EN">("ES");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the pill on scroll
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: {
          className: "scrolled-pill",
          targets: pillRef.current,
        },
      });

      // GSAP specific animation for shrinking
      gsap.to(pillRef.current, {
        scrollTrigger: {
          start: "top -50",
          end: "+=100",
          scrub: 0.5,
        },
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        width: "95%",
        maxWidth: "1000px",
        ease: "power2.out"
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-6 transition-all duration-300 pointer-events-none">
      <div
        ref={pillRef}
        className="pointer-events-auto glass-pill rounded-full px-6 py-4 flex items-center justify-between w-[90%] max-w-[1200px] shadow-sm transition-all duration-300"
        style={{
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-outfit font-bold tracking-tight text-navy text-xl hidden sm:block">
            MIACON <span className="text-primary font-medium text-lg ml-1">2.0</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/aprendizaje"
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive("/aprendizaje")
              ? "bg-slate-100 text-navy font-semibold"
              : "text-text-secondary hover:text-navy hover:bg-slate-50"
              }`}
          >
            Teoría
          </Link>

          <Link
            href="/herramientas"
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive("/herramientas")
              ? "bg-slate-100 text-navy font-semibold"
              : "text-text-secondary hover:text-navy hover:bg-slate-50"
              }`}
          >
            Herramientas
          </Link>

          <Link
            href="/laboratorios"
            className="btn-magnetic px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium ml-1 sm:ml-2 shadow-sm"
          >
            <span>Prácticas</span>
          </Link>

          {/* Selector de idioma (Visual) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 ml-1 sm:ml-3">
            <div className="pl-1.5 pr-0.5 text-slate-400 hidden md:flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <button
              type="button"
              onClick={() => setLang("ES")}
              className={`px-2.5 py-1 rounded-full text-xs font-mono-data font-bold transition-all duration-200 ${lang === "ES"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-400 hover:text-navy"
                }`}
              title="Español"
              aria-label="Seleccionar Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 rounded-full text-xs font-mono-data font-bold transition-all duration-200 ${lang === "EN"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-400 hover:text-navy"
                }`}
              title="English"
              aria-label="Select English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
