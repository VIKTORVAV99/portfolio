export const prerender = true;

const DOMAIN = "https://viktor.andersson.tech";

export async function GET() {
  // Since prerender is true, this date is locked in exactly at build time, which is what we want for a sitemap.
  const buildDate = new Date().toISOString().split("T")[0];

  // List of pages to include in the sitemap.
  const pages = [{ path: "", priority: "1.0", changefreq: "weekly" }];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("")}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
