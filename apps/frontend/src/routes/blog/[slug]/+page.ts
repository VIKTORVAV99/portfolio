import { SITE_URL } from "$lib/config";
import { createArticleSchema, createWebPageSchema, SITE_OWNER_PERSON_REF } from "$lib/seo";
import { error } from "@sveltejs/kit";

export const prerender = true;

export const load = async ({ params }) => {
  const posts = import.meta.glob("$blogs/*.md", { eager: true });

  const match = Object.entries(posts).find(
    ([path]) =>
      path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase() === params.slug.toLowerCase(),
  );

  if (!match) throw error(404, `Post "${params.slug}" not found`);

  const [, file] = match as [string, any];

  const postUrl = `${SITE_URL}/blog/${params.slug}`;

  // StructuredData for the blog post
  const blogPostStructuredData = createArticleSchema({
    headline: file.metadata.title,
    description: file.metadata.description,
    datePublished: new Date(file.metadata.date).toISOString(),
    dateModified: new Date(file.metadata.last_updated || file.metadata.date).toISOString(),
    author: SITE_OWNER_PERSON_REF,
    publisher: SITE_OWNER_PERSON_REF,
    url: postUrl,
    mainEntityOfPage: createWebPageSchema(postUrl),
  });

  return {
    component: file.default,
    metadata: file.metadata,
    structuredData: blogPostStructuredData,
  };
};
