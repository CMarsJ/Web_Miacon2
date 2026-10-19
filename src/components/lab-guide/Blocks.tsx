"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CircleHelp,
  Info,
  ShieldAlert,
  Target,
  Wrench,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Block, GuideStep, TroubleshootingItem, ChallengeSolution } from "@/data/labs/types";
import { ZoomableImage } from "./ZoomableImage";

const tones = {
  note: { icon: Info, label: "Nota", cls: "border-blue-300 bg-blue-50 text-blue-950" },
  important: { icon: AlertTriangle, label: "Importante", cls: "border-amber-300 bg-amber-50 text-amber-950" },
  caution: { icon: ShieldAlert, label: "Precaución", cls: "border-rose-300 bg-rose-50 text-rose-950" },
} as const;

function Callout({ tone, children }: { tone: keyof typeof tones; children: React.ReactNode }) {
  const t = tones[tone];
  const Icon = t.icon;
  return (
    <div role="note" className={`flex gap-3 rounded-lg border-l-4 p-4 text-sm leading-relaxed ${t.cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <strong className="font-bold">{t.label}: </strong>
        {children}
      </div>
    </div>
  );
}

function Step({ step, number }: { step: GuideStep; number: number }) {
  return (
    <li className="grid gap-6 border-t border-slate-200 py-6 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-3">
        <h4 className="flex items-start gap-3 text-lg font-bold text-slate-900">
          <span
            aria-hidden
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white"
          >
            {number}
          </span>
          <span>{step.title}</span>
        </h4>
        <p className="leading-relaxed text-slate-700">{step.instruction}</p>
        {step.path && (
          <p className="rounded-md bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800">
            <span className="font-sans font-semibold text-slate-500">Ruta: </span>
            {step.path}
          </p>
        )}
        {step.actions && (
          <ol className="list-decimal space-y-1.5 pl-6 text-slate-700 marker:font-semibold marker:text-slate-500">
            {step.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        )}
        {step.warning && <Callout tone="important">{step.warning}</Callout>}
        {step.expected && (
          <div className="border-l-4 border-emerald-400 bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-950">
            <strong>Resultado esperado: </strong>
            {step.expected}
          </div>
        )}
        {step.verify && (
          <div className="border-l-4 border-slate-400 bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">
            <strong>Verifique: </strong>
            {step.verify}
          </div>
        )}
        {step.note && <p className="text-sm leading-relaxed text-slate-500">{step.note}</p>}
      </div>
      {step.images && (
        <div className="space-y-4">
          {step.images.map((im) => (
            <ZoomableImage key={im.src} image={im} />
          ))}
        </div>
      )}
    </li>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-6 text-slate-700 marker:text-blue-600">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function TroubleshootingView({ items, title }: { items: TroubleshootingItem[]; title?: string }) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
        <Wrench className="h-5 w-5 text-blue-700" aria-hidden />
        {title ?? "Problemas y fallos clásicos"}
      </h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2.5 transition-all hover:border-slate-300"
          >
            <h4 className="flex items-start gap-2.5 text-base font-bold text-rose-900">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                !
              </span>
              <span>{item.problem}</span>
            </h4>
            {item.cause && (
              <p className="text-sm text-slate-600 pl-7">
                <strong className="text-slate-700">Causa probable:</strong> {item.cause}
              </p>
            )}
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 text-sm text-emerald-950 pl-7">
              <strong className="text-emerald-900">Solución: </strong>
              {item.solution}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeView({
  block,
  onFinishPractice,
  isFinished,
}: {
  block: Extract<Block, { type: "challenge" }>;
  onFinishPractice?: () => void;
  isFinished?: boolean;
}) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-6 rounded-2xl border-2 border-orange-300 bg-orange-50/60 p-6 sm:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-orange-200 pb-4">
        <h3 className="flex items-center gap-2.5 text-2xl font-black text-slate-900">
          <Target className="h-7 w-7 text-orange-600" aria-hidden />
          {block.title}
        </h3>
        <span className="rounded-full bg-orange-100 border border-orange-300 px-3 py-1 text-xs font-bold text-orange-800 uppercase tracking-wide">
          Reto Autónomo
        </span>
      </div>

      <dl className="space-y-5">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Objetivo del Reto</dt>
          <dd className="mt-1 text-base text-slate-800 leading-relaxed">{block.objective}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Problema a Resolver</dt>
          <dd className="mt-1 text-base text-slate-800 leading-relaxed">{block.problem}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Requisitos Funcionales</dt>
          <dd className="mt-1">
            <List items={block.requirements} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Restricciones Técnicas</dt>
          <dd className="mt-1">
            <List items={block.constraints} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Evidencias Solicitadas</dt>
          <dd className="mt-1">
            <List items={block.deliverables} />
          </dd>
        </div>
        {block.hints && block.hints.length > 0 && (
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-orange-800">Pistas y Sugerencias</dt>
            <dd className="mt-1">
              <List items={block.hints} />
            </dd>
          </div>
        )}
      </dl>

      {/* Botones de acción del reto */}
      <div className="pt-6 border-t border-orange-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setShowSolution((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-400 bg-white px-5 py-3 text-sm font-bold text-orange-800 hover:bg-orange-100/70 transition-colors shadow-sm"
        >
          {showSolution ? (
            <>
              <EyeOff className="h-4 w-4" />
              Ocultar Respuesta al Reto
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Mostrar Respuesta al Reto
            </>
          )}
        </button>

        {onFinishPractice && (
          <button
            type="button"
            onClick={onFinishPractice}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all ${
              isFinished
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-700 hover:bg-blue-800 hover:shadow-lg"
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            {isFinished ? "¡Práctica Finalizada! (Volver a Rutas)" : "Finalizar Práctica"}
          </button>
        )}
      </div>

      {/* Contenedor expandible con la solución al reto */}
      {showSolution && (
        <div className="mt-6 rounded-xl border border-orange-300 bg-white p-6 shadow-sm space-y-4 animate-in fade-in-50 duration-200">
          <h4 className="flex items-center gap-2 text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {block.solution?.title ?? "Solución y Referencia del Reto"}
          </h4>

          {block.solution ? (
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{block.solution.description}</p>
              {block.solution.steps && (
                <ol className="list-decimal space-y-1.5 pl-6 text-slate-700">
                  {block.solution.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              )}
              {block.solution.images && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  {block.solution.images.map((im) => (
                    <ZoomableImage key={im.src} image={im} />
                  ))}
                </div>
              )}
              {block.solution.notes && (
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
                  {block.solution.notes.map((n, i) => (
                    <p key={i}>• {n}</p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 text-center text-sm text-amber-900">
              <p className="font-semibold">Solución en preparación.</p>
              <p className="text-xs text-amber-700 mt-1">
                La respuesta detallada y el modelo de referencia serán provistos por el docente próximamente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BlockView({
  block,
  onFinishPractice,
  isFinished,
}: {
  block: Block;
  onFinishPractice?: () => void;
  isFinished?: boolean;
}) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-3">
          {block.title && <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>}
          {block.paragraphs.map((p) => (
            <p key={p} className="max-w-prose leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>
          <List items={block.items} />
        </div>
      );
    case "materials":
      return (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">Elementos necesarios</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {block.groups.map((g) => (
              <div key={g.title} className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">{g.title}</h4>
                <List items={g.items} />
              </div>
            ))}
          </div>
        </div>
      );
    case "warning":
      return <Callout tone={block.tone}>{block.text}</Callout>;
    case "steps":
      return (
        <div className="space-y-4">
          {block.title && <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>}
          <ol className="list-none">
            {block.steps.map((s, i) => (
              <Step key={s.title} step={s} number={i + 1} />
            ))}
          </ol>
        </div>
      );
    case "image":
      return <ZoomableImage image={block.image} />;
    case "table":
      return (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} scope="col" className="px-3 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r) => (
                  <tr key={r.join("|")} className="border-t border-slate-200">
                    {r.map((cell, i) => (
                      <td key={i} className="px-3 py-2 text-slate-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "questions":
      return (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>
          <ol className="list-decimal space-y-2 pl-6 text-slate-700">
            {block.items.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </div>
      );
    case "troubleshooting":
      return <TroubleshootingView items={block.items} title={block.title} />;
    case "pending":
      return (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <CircleHelp className="h-5 w-5 text-slate-500" aria-hidden />
            {block.title}
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase text-amber-900">
              Pendiente de contenido técnico
            </span>
          </h3>
          <p className="mt-2 text-sm text-slate-600">Para completar esta sección se necesita:</p>
          <List items={block.missing} />
        </div>
      );
    case "challenge":
      return (
        <ChallengeView
          block={block}
          onFinishPractice={onFinishPractice}
          isFinished={isFinished}
        />
      );
  }
}
