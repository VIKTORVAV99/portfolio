import { getAllPosts, getAllTags, slugifyTag, paginatePosts } from "$lib/blog";

import type { PageLoadEvent } from "./$types";

export const prerender = true;

export const entries = () => {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag: slugifyTag(tag) }));
};

export const load = async ({ params, url }: PageLoadEvent) => {
  const posts = getAllPosts();
  const tagSlug = params.tag.toLowerCase();

  const filtered = posts.filter((p) => p.tags?.some((t) => slugifyTag(t) === tagSlug));

  // Derive display name from the first matching post's original tag (newest post wins)
  const displayTag =
    posts.flatMap((p) => p.tags ?? []).find((t) => slugifyTag(t) === tagSlug) ?? tagSlug;

  return { ...paginatePosts(filtered, url), tag: tagSlug, displayTag };
};
