"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Award } from "lucide-react";
import type { LabGuideData } from "@/data/labs/types";
import { BlockView } from "./Blocks";

/**
 * Motor genérico de guías por etapas. Todas las etapas son consultables en
 * cualquier momento; el indicador refleja las etapas CONSULTADAS.
 * Incluye soporte para marcar la práctica como finalizada.
 */
export function LabGuide({ data }: { data: LabGuideData }) {
  const router = useRouter();
  const storageKey = `miacon-guide-viewed:${data.slug}`;
  const completionTrack = data.trackKey ?? "fundamentos";
  const completionLabId = data.labId ?? 1;
  const completionKey = `${completionTrack}-${completionLabId}`;

  const [current, setCurrent] = useState(0);
  const [viewed, setViewed] = useState<string[]>([data.stages[0].id]);
  const [isFinished, setIsFinished] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Restaura estado inicial
  useEffect(() => {
    const idx = data.stages.findIndex((s) => `#${s.id}` === window.location.hash);
    if (idx >= 0) setCurrent(idx);

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setViewed((v) => Array.from(new Set([...v, ...saved])));

      const completedLabs = JSON.parse(localStorage.getItem("miacon_completed_labs") ?? "[]");
      if (Array.isArray(completedLabs) && completedLabs.includes(completionKey)) {
        setIsFinished(true);
      }
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [data.stages, storageKey, completionKey]);

  useEffect(() => {
    const id = data.stages[current].id;
    setViewed((v) => (v.includes(id) ? v : [...v, id]));
  }, [current, data.stages]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(viewed));
    } catch {
      /* ignorar */
    }
  }, [viewed, storageKey]);

  const go = useCallback(
    (i: number) => {
      setCurrent(i);
      window.history.replaceState(null, "", `#${data.stages[i].id}`);
      topRef.current?.scrollIntoView({ block: "start" });
    },
    [data.stages]
  );

  const handleFinishPractice = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("miacon_completed_labs") ?? "[]");
      const currentList: string[] = Array.isArray(saved) ? saved : [];
      if (!currentList.includes(completionKey)) {
        currentList.push(completionKey);
      }
      if (!currentList.includes("control1-1")) {
        currentList.push("control1-1");
      }
      localStorage.setItem("miacon_completed_labs", JSON.stringify(currentList));

      // Marcar todas las etapas como consultadas
      const allStageIds = data.stages.map((s) => s.id);
      localStorage.setItem(storageKey, JSON.stringify(allStageIds));
    } catch (e) {
      console.error(e);
    }
    setIsFinished(true);
    router.push(data.backHref);
  };

  const stage = data.stages[current];
  const prev = data.stages[current - 1];
  const next = data.stages[current + 1];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <Link
        href={data.backHref}
        className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
        {data.backLabel}
      </Link>

      <header className="mt-6 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-blue-800">{data.badge}</p>
          {isFinished && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
              <Check className="h-3.5 w-3.5" /> Práctica Completada
            </span>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">{data.title}</h1>
        <p className="mt-1 text-slate-500">{data.subtitle}</p>
      </header>

      {/* Banner de finalización con éxito */}
      {showCompletionBanner && (
        <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in-50 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                ¡Felicitaciones! Has finalizado la Práctica 1 con éxito.
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Tu progreso ha sido registrado. Ya cuentas con los fundamentos básicos para continuar con las rutas de control.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push(data.backHref)}
            className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Volver a la Ruta de Laboratorios
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Navegación de etapas */}
        <nav
          aria-label="Etapas de la práctica"
          className="sticky top-20 z-20 -mx-4 bg-slate-50/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0"
        >
          <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {data.stages.map((s, i) => {
              const active = i === current;
              const seen = viewed.includes(s.id);
              return (
                <li key={s.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-200/70"
                    } ${s.isChallenge && !active ? "border border-orange-300" : ""}`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active
                          ? "bg-white text-slate-900"
                          : seen
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {seen && !active ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal">{s.title}</span>
                    {seen && !active && <span className="sr-only">(consultada)</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 hidden text-xs text-slate-500 lg:block">
            Etapas consultadas: {viewed.length} de {data.stages.length}.
          </p>
        </nav>

        {/* Contenido */}
        <main className="min-w-0 scroll-mt-28" ref={topRef} id="contenido">
          <section aria-labelledby="stage-title" className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Etapa {current + 1} de {data.stages.length}
              </p>
              <h2 id="stage-title" className="text-2xl font-black text-slate-900">
                {stage.title}
              </h2>
              <p className="text-slate-600">{stage.summary}</p>
            </div>
            {stage.blocks.map((b, i) => (
              <BlockView
                key={`${stage.id}-${i}`}
                block={b}
                onFinishPractice={stage.isChallenge ? handleFinishPractice : undefined}
                isFinished={isFinished}
              />
            ))}
          </section>

          <div className="mt-12 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
            {prev ? (
              <button
                type="button"
                onClick={() => go(current - 1)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Anterior: {prev.title}
              </button>
            ) : (
              <span />
            )}
            {next && (
              <button
                type="button"
                onClick={() => go(current + 1)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Siguiente: {next.title} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
