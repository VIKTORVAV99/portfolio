export const prerender = true;
import { SITE_URL } from "$lib/config";

export async function GET() {
  // Since prerender is true, this date is locked in exactly at build time, which is what we want for a sitemap.
  const buildDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { path: "", priority: "1.0", changefreq: "weekly" },
    { path: "/blog", priority: "0.9", changefreq: "weekly" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/journey", priority: "0.8", changefreq: "monthly" },
  ];

  const posts = import.meta.glob("$blogs/*.md", { eager: true });
  const blogPages = Object.entries(posts).map(([path, file]: [string, any]) => {
    const slug = path.split("/").at(-1)?.replace(/\.md$/, "").toLowerCase() ?? "";
    const date = file.metadata?.last_updated || file.metadata?.date;
    const lastmod = date ? new Date(date).toISOString().split("T")[0] : buildDate;
    return { path: `/blog/${slug}`, priority: "0.7", changefreq: "monthly", lastmod };
  });

  const allPages = [...staticPages.map((p) => ({ ...p, lastmod: buildDate })), ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
