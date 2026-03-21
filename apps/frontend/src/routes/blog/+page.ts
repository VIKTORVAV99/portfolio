import { getAllPosts, paginatePosts, PAGE_SIZE } from "$lib/blog";

import type { PageLoadEvent } from "./$types";

export const prerender = true;

export const entries = (): Record<string, string>[] => {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const result: Record<string, string>[] = [{}]; // {} = /blog (page 1, no param)
  for (let p = 2; p <= totalPages; p++) {
    result.push({ page: String(p) });
  }
  return result;
};

export const load = async ({ url }: PageLoadEvent) =>
  paginatePosts(getAllPosts(), url);
