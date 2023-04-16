export interface Image {
	src: string;
	alt: string;
	aspectRatio: string;
}

export interface Link {
	title: string;
	url: string;
}

interface Technology {
	name: string;
	url?: string;
	description?: string;
	preview?: boolean;
}

export interface ProjectConfig {
	title: string;
	id: string;
	showcase: boolean;
	type: 'personal' | 'professional';
	links: Array<Link>;
	keywords: Array<string>;
	technologies: Array<Technology>;
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
