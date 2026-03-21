import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) =>
  resolve(event, {
    preload: ({ type }) => type === "js" || type === "css" || type === "font",
  });
