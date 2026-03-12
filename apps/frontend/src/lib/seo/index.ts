export interface OrganizationSchema {
	"@context": "https://schema.org";
	"@type": "Organization";
	name: string;
	url?: string;
	description?: string;
	location?: string;
	sameAs?: string[];
}

export function createOrganizationSchema(
	options: Omit<OrganizationSchema, "@context" | "@type">
): OrganizationSchema {
	return { "@context": "https://schema.org", "@type": "Organization", ...options };
}

export interface PersonSchema {
	"@context": "https://schema.org";
	"@type": "Person";
	name: string;
	givenName?: string;
	familyName?: string;
	url?: string;
	jobTitle?: string;
	description?: string;
	worksFor?: Omit<OrganizationSchema, "@context">;
	alumniOf?: { "@type": "EducationalOrganization"; name: string };
	sameAs?: string[];
}

export function createPersonSchema(
	options: Omit<PersonSchema, "@context" | "@type">
): PersonSchema {
	return { "@context": "https://schema.org", "@type": "Person", ...options };
}

export function toJsonLd(schema: object): string {
	return JSON.stringify(schema);
}
