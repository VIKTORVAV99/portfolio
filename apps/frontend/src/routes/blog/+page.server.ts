import { getAllPosts, paginatePosts, PAGE_SIZE } from "$lib/blog";
import { SITE_URL } from "$lib/config";
import { buildPaginationURLs } from "$lib/helpers/paginationURLs";
import {
  createBreadcrumbListSchema,
  createCollectionPageSchema,
  createItemListSchema,
} from "$lib/seo";

import type { PageServerLoadEvent } from "./$types";

export const entries = (): Record<string, string>[] => {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const result: Record<string, string>[] = [{}]; // {} = /blog (page 1, no param)
  for (let p = 2; p <= totalPages; p++) {
    result.push({ page: String(p) });
  }
  return result;
};

export const load = async ({ url }: PageServerLoadEvent) => {
  const posts = getAllPosts();
  const paginated = paginatePosts(posts, url);
  const allSlugs = posts.map((p) => p.slug);

  const { canonicalURL, prevURL, nextURL } = buildPaginationURLs(
    `${SITE_URL}/blog`,
    paginated.currentPage,
    paginated.totalPages,
  );

  const description = "Thoughts on software engineering, climate tech, and open source.";

  const structuredData = [
    createCollectionPageSchema({
      name: "Blog",
      description,
      url: canonicalURL,
      mainEntity: createItemListSchema(allSlugs.map((slug) => `${SITE_URL}/blog/${slug}`)),
    }),
    createBreadcrumbListSchema([{ name: "Home", url: SITE_URL }, { name: "Blog" }]),
  ];

  return { ...paginated, allSlugs, description, structuredData, canonicalURL, prevURL, nextURL };
};
