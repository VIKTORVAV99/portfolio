import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const prefetchPaths: string[] = [];

  return resolve(event, {
    preload: ({ type, path }) => {
      if (type === "css" || type === "font") return true;
      if (type === "js" && path.includes("/entry/")) return true;
      if (type === "js") prefetchPaths.push(path);
      return false;
    },
    transformPageChunk: ({ html }) => {
      if (prefetchPaths.length === 0) return html;
      const links = prefetchPaths
        .map((p) => `<link rel="prefetch" href="${p}" as="script" />`)
        .join("\n\t\t");
      return html.replace("</head>", `\t\t${links}\n\t</head>`);
    },
  });
};
