interface Image {
	src: string;
	alt: string;
	aspectRatio: string;
}

export interface ProjectConfig {
	title: string;
	id: string;
	showcase: boolean;
	type: 'personal' | 'professional';
	links: Array<{ title: string; url: string }>;
	keywords: Array<string>;
	technologies: Array<{ name: string; url?: string; description?: string; preview?: boolean }>;
	preview: {
		description: string;
		image?: Image;
	};
	details: {
		tagline: string;
		description: string;
		images?: Array<Image>;
	};
}
