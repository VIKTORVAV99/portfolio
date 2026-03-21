import { getAllPosts } from "$lib/blog";
import { SITE_URL } from "$lib/config";
import {
  createArticleSchema,
  createBreadcrumbListSchema,
  createWebPageSchema,
  SITE_OWNER_PERSON_REF,
} from "$lib/seo";
import { error } from "@sveltejs/kit";

export const prerender = true;

export const load = async ({ params }) => {
  const posts = getAllPosts();

  const index = posts.findIndex((p) => p.slug === params.slug.toLowerCase());
  if (index === -1) throw error(404, `Post "${params.slug}" not found`);

  const post = posts[index];
  const file = post._file;
  const postUrl = `${SITE_URL}/blog/${params.slug}`;

  const prevPost =
    index > 0 ? { slug: posts[index - 1].slug, title: posts[index - 1].title } : undefined;
  const nextPost =
    index < posts.length - 1
      ? { slug: posts[index + 1].slug, title: posts[index + 1].title }
      : undefined;

  const blogPostStructuredData = createArticleSchema({
    headline: file.metadata.title,
    description: file.metadata.description,
    datePublished: new Date(file.metadata.date).toISOString(),
    dateModified: new Date(file.metadata.last_updated || file.metadata.date).toISOString(),
    author: SITE_OWNER_PERSON_REF,
    publisher: SITE_OWNER_PERSON_REF,
    keywords: file.metadata.tags,
    url: postUrl,
    mainEntityOfPage: createWebPageSchema(postUrl),
  });

  return {
    component: file.default,
    metadata: file.metadata,
    readingTime: post.readingTime,
    postUrl,
    structuredData: [
      blogPostStructuredData,
      createBreadcrumbListSchema([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: file.metadata.title },
      ]),
    ],
    prevPost,
    nextPost,
  };
};
