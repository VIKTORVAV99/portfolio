import type { PageLoadEvent } from "./$types";

export const prerender = true;

const PAGE_SIZE = 15;

function getAllPosts() {
  const paths = import.meta.glob("$blogs/*.md", { eager: true });
  const posts = [];

  for (const path in paths) {
    const file = paths[path] as any;
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase();

    if (file && typeof file === "object" && "metadata" in file && slug) {
      posts.push({ ...file.metadata, slug });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const entries = (): Record<string, string>[] => {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const result: Record<string, string>[] = [{}]; // {} = /blog (page 1, no param)
  for (let p = 2; p <= totalPages; p++) {
    result.push({ page: String(p) });
  }
  return result;
};

export const load = async ({ url }: PageLoadEvent) => {
  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  // url.searchParams throws during prerendering; default to page 1 in that case
  let rawPage: string | null = null;
  try {
    rawPage = url.searchParams.get("page");
  } catch {
    rawPage = null;
  }
  const currentPage = rawPage ? Math.max(1, Math.min(Number(rawPage), totalPages)) : 1;
  const pagedPosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return { pagedPosts, currentPage, totalPages };
};
