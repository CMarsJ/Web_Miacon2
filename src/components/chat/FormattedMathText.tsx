"use client";

import { useMemo } from "react";
import katex from "katex";

interface FormattedMathTextProps {
  content: string;
}

export default function FormattedMathText({ content }: FormattedMathTextProps) {
  // Parser para segmentar texto plano y fórmulas LaTeX ($...$ inline y $$...$$ display)
  const segments = useMemo(() => {
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
          return { type: "display-math", html, key: index };
        } catch {
          return { type: "text", text: part, key: index };
        }
      } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const mathExpr = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: false,
            throwOnError: false,
          });
          return { type: "inline-math", html, key: index };
        } catch {
          return { type: "text", text: part, key: index };
        }
      }
      return { type: "text", text: part, key: index };
    });
  }, [content]);

  return (
    <span className="whitespace-pre-wrap break-words leading-relaxed">
      {segments.map((seg) => {
        if (seg.type === "display-math" || seg.type === "inline-math") {
          return (
            <span
              key={seg.key}
              dangerouslySetInnerHTML={{ __html: seg.html! }}
              className={seg.type === "display-math" ? "my-2 block overflow-x-auto py-1" : "mx-0.5 inline"}
            />
          );
        }
        return <span key={seg.key}>{seg.text}</span>;
      })}
    </span>
  );
}
