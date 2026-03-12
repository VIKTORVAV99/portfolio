import type { PageLoad } from "./$types";
import projects from "$data/projects";

export const load = (() => {
  return { projects };
}) satisfies PageLoad;
