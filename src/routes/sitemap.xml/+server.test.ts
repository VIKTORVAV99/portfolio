import { GET } from './+server';

import { describe, it, expect } from 'bun:test';
import projects from '$data/projects.json';

describe('sitemap.xml', () => {
	it('should return content type application/xml', async () => {
		const response = await GET();
		expect(response.headers.get('Content-Type')).toBe('application/xml');
	});

	it('should return 200 status', async () => {
		const response = await GET();
		expect(response.status).toBe(200);
	});

	// it should return xml that includes the domain
	it('should include domain', async () => {
		const response = await GET();
		expect(await response.text()).toContain('https://viktor.andersson.tech/');
	});

	// it should include the projects
	it('should include projects', async () => {
		const response = await GET();
		expect(await response.text()).toContain('https://viktor.andersson.tech/projects');
	});

	it('should match snapshot', async () => {
		const response = await GET();
		expect(await response.text()).toMatchSnapshot();
	});
});
