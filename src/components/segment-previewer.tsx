"use client";

import { motion } from "framer-motion";
import { BlockMath } from "react-katex";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "./codeblock";
import { useEditorContext } from "./editor-context";

export default function SegmentPreviewer() {
  const { segments } = useEditorContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: "calc(var(--spacing) * -2)" }}
      animate={{ opacity: 1, y: "calc(var(--spacing) * 2)" }}
      className="flex mt-6 w-1/2 flex-col mb-36 gap-y-2">
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <div key={index}>
            <h1 className="font-semibold text-3xl">{segment.content.heading}</h1>
            <p>{segment.content.text}</p>
          </div>
        ) : segment.type === "image" ? (
          <div key={index}>
            <img src={segment.content.src} alt={segment.content.alt} />
          </div>
        ) : segment.type === "code" ? (
          <div key={index}>
            <CodeBlock lang={segment.content.language as BundledLanguage}>
              {segment.content.code}
            </CodeBlock>
            <p className="text-center text-muted-foreground mt-2">{segment.content.heading}</p>
          </div>
        ) : segment.type === "formula" ? (
          <div key={index}>
            <BlockMath math={segment.content.formula} />
            <p className="text-center">{segment.content.description}</p>
          </div>
        ) : segment.type === "list" ? (
          <div key={index}>
            {segment.content.ordered ? (
              <ol>
                {segment.content.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul>
                {segment.content.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : segment.type === "quote" ? (
          <div key={index}>
            <blockquote>
              <p>{segment.content.text}</p>
              <cite>- {segment.content.author}</cite>
            </blockquote>
          </div>
        ) : segment.type === "table" ? (
          <div key={index}>
            <table className="w-full border-collapse border text-center border-border">
              <thead>
                <tr>
                  {segment.content.headers?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-y [&_td]:border-x [&_tr]:border-border">
                {segment.content.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          "Invalid segment type"
        ),
      )}
    </motion.div>
  );
}
