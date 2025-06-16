"use client";

import "@/app/globals.css";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { JSX } from "react";
import { Fragment, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import type { BundledLanguage } from "shiki";
import { codeToHast } from "shiki";

export async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    theme: "github-dark",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: {
      code: (props) => <code className="p-0" {...props} />,
    },
  }) as JSX.Element;
}

interface Props {
  children: string;
  lang: BundledLanguage;
}

export function CodeBlock({ children, lang }: Props) {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../../lib/highlight-worker.ts", import.meta.url),
    );

    worker.onmessage = (e) => {
      setNodes(toJsxRuntime(e.data, { Fragment, jsx, jsxs }));
    };

    setWorker(worker);

    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (worker) {
      worker.postMessage({ code: children, lang });
    }
  }, [worker, children, lang]);

  return nodes ?? <p>Loading...</p>;
}
