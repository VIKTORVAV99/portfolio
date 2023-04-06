import type { Url } from 'url';

export interface ProjectConfig {
	title: string;
	dateStarted: string;
	dateCompleted: string | 'ongoing';
	showcase: boolean;
	type: 'personal' | 'professional' | 'education';
	links: Array<{ title: string; url: Url }>;
	keywords: Array<string>;
	technologies: Array<{ name: string; url: Url; description: string; preview: boolean }>;
	preview: {
		description: string;
		image?: string;
	};
	details: {
		tagline: string;
		description: string;
		images?: Array<string>;
	};
}
