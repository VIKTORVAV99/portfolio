import { getAllPosts, getAllTags, slugifyTag, paginatePosts } from "$lib/blog";
import { SITE_URL } from "$lib/config";
import { buildPaginationURLs } from "$lib/helpers/paginationURLs";
import {
  createBreadcrumbListSchema,
  createCollectionPageRefSchema,
  createCollectionPageSchema,
  createDefinedTermSchema,
  createItemListSchema,
} from "$lib/seo";

import type { PageServerLoadEvent } from "./$types";

export const entries = () => {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag: slugifyTag(tag) }));
};

export const load = async ({ params, url }: PageServerLoadEvent) => {
  const posts = getAllPosts();
  const tagSlug = params.tag.toLowerCase();

  const filtered = posts.filter((p) => p.tags?.some((t) => slugifyTag(t) === tagSlug));

  // Derive display name from the first matching post's original tag (newest post wins)
  const displayTag =
    posts.flatMap((p) => p.tags ?? []).find((t) => slugifyTag(t) === tagSlug) ?? tagSlug;

  const paginated = paginatePosts(filtered, url);
  const allSlugs = filtered.map((p) => p.slug);
  const totalPosts = allSlugs.length;

  const baseURL = `${SITE_URL}/blog/tag/${tagSlug}`;
  const { canonicalURL, prevURL, nextURL } = buildPaginationURLs(
    baseURL,
    paginated.currentPage,
    paginated.totalPages,
  );

  const description = `Browse ${totalPosts} blog ${totalPosts === 1 ? "post" : "posts"} tagged with "${displayTag}".`;

  const structuredData = [
    createCollectionPageSchema({
      name: `Posts tagged "${displayTag}"`,
      description,
      url: canonicalURL,
      mainEntity: createItemListSchema(allSlugs.map((slug) => `${SITE_URL}/blog/${slug}`)),
      isPartOf: createCollectionPageRefSchema(`${SITE_URL}/blog`),
      about: createDefinedTermSchema(displayTag),
    }),
    createBreadcrumbListSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: `#${displayTag}` },
    ]),
  ];

  return {
    ...paginated,
    tag: tagSlug,
    displayTag,
    allSlugs,
    totalPosts,
    description,
    structuredData,
    canonicalURL,
    prevURL,
    nextURL,
  };
};
