"use client";

import { getSignedImageUrl } from "@/lib/actions";
import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BlockMath } from "react-katex";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "./codeblock";
import { useEditorContext } from "./editor-context";

export default function SegmentPreviewer() {
  const { segments } = useEditorContext();

  const data = useQueries({
    queries: segments.map((segment, index) => ({
      queryKey: [`segment-${index}`],
      queryFn: async () => {
        if (segment.type === "image") {
          return {
            ...segment,
            content: {
              ...segment.content,
              src: await getSignedImageUrl(segment.content.src),
            },
          };
        }
        return segment;
      },
    })),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: "calc(var(--spacing) * -2)" }}
      animate={{ opacity: 1, y: "calc(var(--spacing) * 2)" }}
      className="flex mt-6 w-full px-4 md:w-1/2 flex-col mb-36 gap-y-2">
      {data.map((segment, index) =>
        segment.data?.type === "text" ? (
          <div key={index}>
            <h1 className="font-semibold text-3xl">
              {segment.data?.content.heading}
            </h1>
            <p>{segment.data?.content.text}</p>
          </div>
        ) : segment.data?.type === "image" ? (
          <div key={index}>
            <img
              src={segment.data?.content.src || ""}
              alt={segment.data?.content.alt}
            />
          </div>
        ) : segment.data?.type === "code" ? (
          <div key={index}>
            <CodeBlock lang={segment.data?.content.language as BundledLanguage}>
              {segment.data?.content.code}
            </CodeBlock>
            <p className="text-center text-muted-foreground mt-2">
              {segment.data?.content.heading}
            </p>
          </div>
        ) : segment.data?.type === "formula" ? (
          <div key={index}>
            <BlockMath math={segment.data?.content.formula} />
            <p className="text-center text-muted-foreground mt-2">
              {segment.data?.content.description}
            </p>
          </div>
        ) : segment.data?.type === "list" ? (
          <div key={index}>
            {segment.data?.content.ordered ? (
              <ol>
                {segment.data?.content.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul>
                {segment.data?.content.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : segment.data?.type === "quote" ? (
          <div key={index}>
            <blockquote>
              <p>{segment.data?.content.text}</p>
              <cite>- {segment.data?.content.author}</cite>
            </blockquote>
          </div>
        ) : segment.data?.type === "table" ? (
          <div key={index}>
            <table className="w-full border-collapse border text-center border-border">
              <thead>
                <tr>
                  {segment.data?.content.headers?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-y [&_td]:border-x [&_tr]:border-border">
                {segment.data?.content.rows.map((row, rowIndex) => (
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
