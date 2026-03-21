import type { PageLoadEvent } from "./$types";
import { getAllPosts, getAllTags, slugifyTag, PAGE_SIZE } from "$lib/blog";

export const prerender = true;

export const entries = () => {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag: slugifyTag(tag) }));
};

export const load = async ({ params, url }: PageLoadEvent) => {
  const posts = getAllPosts();
  const tagSlug = params.tag.toLowerCase();

  const filtered = posts.filter((p) =>
    p.tags?.some((t) => slugifyTag(t) === tagSlug),
  );

  // Derive display name from the first matching post's original tag (newest post wins)
  const displayTag =
    posts.flatMap((p) => p.tags ?? []).find((t) => slugifyTag(t) === tagSlug) ??
    tagSlug;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  let rawPage: string | null = null;
  try {
    rawPage = url.searchParams.get("page");
  } catch {
    rawPage = null;
  }
  const currentPage = rawPage
    ? Math.max(1, Math.min(Number(rawPage), totalPages))
    : 1;
  const pagedPosts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return { pagedPosts, currentPage, totalPages, tag: tagSlug, displayTag };
};
