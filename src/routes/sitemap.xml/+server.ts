import projects from '$data/projects.json';

const DOMAIN = 'https://viktor.andersson.tech/';

export async function GET() {
	return new Response(
		`
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
            xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        >
          <url>
            <loc>${DOMAIN}</loc>
          </url>
          <url>
            <loc>${DOMAIN + 'projects'}</loc>
          </url>
          ${projects.map((projects) => `<url><loc>${DOMAIN + 'projects/' + projects.id}</loc></url>`)}
        </urlset>`
			.replaceAll(',', '')
			.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
