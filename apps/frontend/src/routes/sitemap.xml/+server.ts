const DOMAIN = "https://viktor.andersson.tech/";

export async function GET() {
  return new Response(
    `
      <?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>${DOMAIN}</loc>
          </url>
        </urlset>`
      .replaceAll(",", "")
      .replaceAll("\n", "")
      .replaceAll("  ", "")
      .trim(),
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
