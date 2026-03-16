import { createArticleSchema, createPersonSchema } from "$lib/seo";
import { error } from "@sveltejs/kit";

export const prerender = true;

const BASE_BLOG_POST_AUTHOR = createPersonSchema({
  "@id": "https://viktor.andersson.tech/#person",
  name: "Viktor Andersson",
  url: "https://viktor.andersson.tech",
});

export const load = async ({ params }) => {
  const posts = import.meta.glob("$blogs/*.md", { eager: true });

  const match = Object.entries(posts).find(
    ([path]) =>
      path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase() === params.slug.toLowerCase(),
  );

  if (!match) throw error(404, `Post "${params.slug}" not found`);

  const [, file] = match as [string, any];

  // StructuredData for the blog post
  const blogPostStructuredData = createArticleSchema({
    headline: file.metadata.title,
    description: file.metadata.description,
    datePublished: new Date(file.metadata.date).toISOString(),
    dateModified: new Date(file.metadata.last_updated || file.metadata.date).toISOString(),
    author: BASE_BLOG_POST_AUTHOR,
  });

  return {
    component: file.default,
    metadata: file.metadata,
    structuredData: blogPostStructuredData,
  };
};
