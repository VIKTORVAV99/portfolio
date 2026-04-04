import { getAllPosts } from "$lib/blog";
import { FALLBACK_HERO_IMAGE, SITE_URL } from "$lib/config";
import {
  createArticleSchema,
  createBreadcrumbListSchema,
  createWebPageSchema,
  SITE_OWNER_PERSON_REF,
} from "$lib/seo";
import { error } from "@sveltejs/kit";

import type { PageServerLoadEvent } from "./$types";

export const load = async ({ params }: PageServerLoadEvent) => {
  const posts = getAllPosts();

  const index = posts.findIndex((p) => p.slug === params.slug.toLowerCase());
  if (index === -1) throw error(404, `Post "${params.slug}" not found`);

  const post = posts[index];
  const postUrl = `${SITE_URL}/blog/${params.slug}`;

  const prevPost =
    index > 0 ? { slug: posts[index - 1].slug, title: posts[index - 1].title } : undefined;
  const nextPost =
    index < posts.length - 1
      ? { slug: posts[index + 1].slug, title: posts[index + 1].title }
      : undefined;

  return {
    slug: post.slug,
    metadata: {
      title: post.title,
      description: post.description,
      date: post.date,
      last_updated: post.last_updated,
      tags: post.tags,
    },
    readingTime: post.readingTime,
    postUrl,
    structuredData: [
      createArticleSchema({
        headline: post.title,
        description: post.description,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.last_updated || post.date).toISOString(),
        author: SITE_OWNER_PERSON_REF,
        publisher: SITE_OWNER_PERSON_REF,
        keywords: post.tags,
        url: postUrl,
        mainEntityOfPage: createWebPageSchema(postUrl),
        image: FALLBACK_HERO_IMAGE,
      }),
      createBreadcrumbListSchema([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: post.title },
      ]),
    ],
    prevPost,
    nextPost,
  };
};
