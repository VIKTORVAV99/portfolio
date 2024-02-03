import { GET } from './+server';

import { describe, it, expect, test } from 'bun:test';

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

	// it should include the projects page
	it('should include projects url', async () => {
		const response = await GET();
		expect(await response.text()).toContain('https://viktor.andersson.tech/projects');
	});

	// it should include all the project urls
	test.todo('should include all project urls');

	it('should match snapshot', async () => {
		const response = await GET();
		expect(await response.text()).toMatchSnapshot();
	});
});
