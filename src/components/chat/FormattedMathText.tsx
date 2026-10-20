"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface FormattedMathTextProps {
  content: string;
}

// Función auxiliar para parsear negritas (**texto**) y cursivas (*texto*)
function renderInlineFormatting(text: string, keyPrefix: string | number) {
  // Regex para capturar negrita (**...**) y cursiva (*...*)
  const tokens = text.split(/(\*\*[\s\S]+?\*\*|\*[^\*\n]+?\*)/g);

  return tokens.map((token, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong key={key} className="font-bold text-navy">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return (
        <em key={key} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <span key={key}>{token}</span>;
  });
}

export default function FormattedMathText({ content }: FormattedMathTextProps) {
  // Parser para segmentar fórmulas LaTeX ($...$ y $$...$$) y texto con markdown (negritas, listas)
  const renderedElements = useMemo(() => {
    // Capturamos fórmulas display ($$...$$) o inline ($...$)
    const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
    const parts = content.split(mathRegex);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
        const mathExpr = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={`math-disp-${index}`}
              dangerouslySetInnerHTML={{ __html: html }}
              className="my-2.5 block overflow-x-auto py-1 text-center"
            />
          );
        } catch {
          return <span key={`text-${index}`}>{part}</span>;
        }
      }

      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const mathExpr = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={`math-inl-${index}`}
              dangerouslySetInnerHTML={{ __html: html }}
              className="mx-0.5 inline-block align-baseline"
            />
          );
        } catch {
          return <span key={`text-${index}`}>{part}</span>;
        }
      }

      // Procesar negritas y cursivas en el texto normal
      return <React.Fragment key={`fmt-${index}`}>{renderInlineFormatting(part, index)}</React.Fragment>;
    });
  }, [content]);

  return (
    <span className="whitespace-pre-wrap break-words leading-relaxed">
      {renderedElements}
    </span>
  );
}
