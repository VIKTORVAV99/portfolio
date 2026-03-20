import { SITE_URL } from "$lib/config";
import {
  createArticleSchema,
  createBreadcrumbListSchema,
  createWebPageSchema,
  SITE_OWNER_PERSON_REF,
} from "$lib/seo";
import { error } from "@sveltejs/kit";

export const prerender = true;

function getAllPosts() {
  const paths = import.meta.glob("$blogs/*.md", { eager: true });
  const posts = [];

  for (const path in paths) {
    const file = paths[path] as any;
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase();

    if (file && typeof file === "object" && "metadata" in file && slug) {
      posts.push({ slug, title: file.metadata.title, date: file.metadata.date, file });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const load = async ({ params }) => {
  const posts = getAllPosts();

  const index = posts.findIndex((p) => p.slug === params.slug.toLowerCase());
  if (index === -1) throw error(404, `Post "${params.slug}" not found`);

  const { file } = posts[index];
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
