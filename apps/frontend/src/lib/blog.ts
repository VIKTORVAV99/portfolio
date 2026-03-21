export const PAGE_SIZE = 15;

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  last_updated?: string;
  tags?: string[];
  slug: string;
  /** Raw mdsvex module – only used by [slug]/+page.ts for the rendered component. */
  _file?: any;
}

export function getAllPosts(): BlogPostMeta[] {
  const paths = import.meta.glob("$blogs/*.md", { eager: true });
  const posts: BlogPostMeta[] = [];

  for (const path in paths) {
    const file = paths[path] as any;
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase();

    if (file && typeof file === "object" && "metadata" in file && slug) {
      posts.push({ ...file.metadata, slug, _file: file });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(posts: BlogPostMeta[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tagSet.add(tag.toLowerCase());
    }
  }
  return [...tagSet].sort();
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
