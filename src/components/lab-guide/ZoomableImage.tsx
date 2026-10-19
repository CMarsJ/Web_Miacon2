"use client";

import Image from "next/image";
import { useRef } from "react";
import { X } from "lucide-react";
import type { GuideImage } from "@/data/labs/types";

/** Imagen con subtítulo que se amplía en un <dialog> nativo (Esc / clic fuera cierran). */
export function ZoomableImage({ image }: { image: GuideImage }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className="space-y-2">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Ampliar imagen: ${image.alt}`}
        className="block w-full cursor-zoom-in rounded-lg border border-slate-200 bg-white p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-auto w-full rounded-md object-contain"
        />
      </button>
      {image.caption && (
        <figcaption className="text-xs leading-snug text-slate-500">{image.caption}</figcaption>
      )}

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={image.alt}
        className="m-auto max-h-[94vh] max-w-[96vw] rounded-xl bg-white p-3 backdrop:bg-slate-950/80"
      >
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Cerrar imagen ampliada"
          className="mb-2 ml-auto flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          <X className="h-4 w-4" aria-hidden /> Cerrar
        </button>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="96vw"
          className="mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain"
        />
        {image.caption && <p className="mt-2 text-sm text-slate-600">{image.caption}</p>}
      </dialog>
    </figure>
  );
}
