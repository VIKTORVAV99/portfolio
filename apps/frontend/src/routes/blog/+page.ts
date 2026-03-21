import type { PageLoadEvent } from "./$types";
import { getAllPosts, PAGE_SIZE } from "$lib/blog";

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

export const load = async ({ url }: PageLoadEvent) => {
  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  // url.searchParams throws during prerendering; default to page 1 in that case
  let rawPage: string | null = null;
  try {
    rawPage = url.searchParams.get("page");
  } catch {
    rawPage = null;
  }
  const currentPage = rawPage ? Math.max(1, Math.min(Number(rawPage), totalPages)) : 1;
  const pagedPosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return { pagedPosts, currentPage, totalPages };
};
