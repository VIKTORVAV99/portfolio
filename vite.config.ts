import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
	plugins: [
		sveltekit(),
		Sitemap({
			hostname: 'https://viktor.andersson.tech',
			outDir: process.env.CI ? '/home/runner/work/personal-website/build' : 'build',
			robots: [{ userAgent: '*', allow: '/', disallow: '' }],
			exclude: ['/404']
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	preview: {
		port: 8888
	}
});
