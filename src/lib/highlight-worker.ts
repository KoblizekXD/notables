import { codeToHast } from "shiki";

self.onmessage = async ({ data }) => {
  const { code, lang } = data;
  self.postMessage(await codeToHast(code, { lang, theme: "github-dark" }));
};
