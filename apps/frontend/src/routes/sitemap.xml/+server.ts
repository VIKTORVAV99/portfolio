export const prerender = true;
import { SITE_URL } from "$lib/config";

interface SitemapPage {
  path: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export const _staticPages = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/history", priority: "0.8", changefreq: "monthly" },
];

export function _buildSitemapXml(pages: SitemapPage[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

export async function GET() {
  // Since prerender is true, this date is locked in exactly at build time, which is what we want for a sitemap.
  const buildDate = new Date().toISOString().split("T")[0];

  const posts = import.meta.glob("$blogs/*.md", { eager: true });
  const blogPages = Object.entries(posts).map(([path, file]: [string, any]) => {
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase() ?? "";
    const date = file.metadata?.last_updated || file.metadata?.date;
    const lastmod = date ? new Date(date).toISOString().split("T")[0] : buildDate;
    return { path: `/blog/${slug}`, priority: "0.7", changefreq: "monthly", lastmod };
  });

  const allPages = [..._staticPages.map((p) => ({ ...p, lastmod: buildDate })), ...blogPages];

  return new Response(_buildSitemapXml(allPages), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
