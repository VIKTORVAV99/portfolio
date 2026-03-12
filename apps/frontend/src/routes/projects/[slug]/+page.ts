import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import projects from "$data/projects";

export const load = (async ({ params }) => {
  const project = projects.find((entry) => entry.id === params.slug);
  if (project) {
    return { project };
  } else {
    error(404, "Project not found!");
  }
}) satisfies PageLoad;
