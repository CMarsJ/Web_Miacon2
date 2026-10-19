/**
 * Modelo de datos de las guías de laboratorio MIACON.
 * Cada práctica es un objeto `LabGuideData` que el motor
 * (src/components/lab-guide) sabe renderizar.
 */

export type GuideImage = {
  src: string;
  alt: string;
  /** Dimensiones reales del archivo; se usan para conservar la proporción. */
  width: number;
  height: number;
  caption?: string;
};

export type GuideStep = {
  title: string;
  instruction: string;
  /** Ubicación de la opción en el software, p. ej. "Home > Environment > Add-Ons". */
  path?: string;
  /** Lista de acciones numeradas dentro del paso. */
  actions?: string[];
  images?: GuideImage[];
  expected?: string;
  /** Cómo comprobar que el paso quedó bien. */
  verify?: string;
  note?: string;
  warning?: string;
};

export type TroubleshootingItem = {
  problem: string;
  cause?: string;
  solution: string;
};

export type ChallengeSolution = {
  title?: string;
  description: string;
  steps?: string[];
  images?: GuideImage[];
  notes?: string[];
};

export type Block =
  | { type: "text"; title?: string; paragraphs: string[] }
  | { type: "list"; title: string; items: string[] }
  | { type: "materials"; groups: { title: string; items: string[] }[] }
  | { type: "warning"; tone: "note" | "important" | "caution"; text: string }
  | { type: "steps"; title?: string; steps: GuideStep[] }
  | { type: "image"; image: GuideImage }
  | {
      type: "table";
      title: string;
      columns: string[];
      rows: string[][];
    }
  | { type: "questions"; title: string; items: string[] }
  | {
      type: "troubleshooting";
      title?: string;
      items: TroubleshootingItem[];
    }
  | {
      type: "challenge";
      title: string;
      objective: string;
      problem: string;
      requirements: string[];
      constraints: string[];
      deliverables: string[];
      hints?: string[];
      solution?: ChallengeSolution;
    }
  /** Sección sin contenido técnico validado: dice exactamente qué dato falta. */
  | { type: "pending"; title: string; missing: string[] };

export type GuideStage = {
  id: string;
  title: string;
  summary: string;
  isChallenge?: boolean;
  blocks: Block[];
};

export type LabGuideData = {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  trackKey?: string;
  labId?: number;
  stages: GuideStage[];
};
