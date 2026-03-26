import { SITE_URL } from "$lib/config";

export interface PostalAddressSchema {
  "@type": "PostalAddress";
  addressLocality?: string;
  addressCountry?: string;
}

export interface PlaceSchema {
  "@type": "Place";
  address: PostalAddressSchema;
}

export const createPlaceSchema = (
  addressLocality: string,
  addressCountry: string,
): PlaceSchema => ({
  "@type": "Place",
  address: { "@type": "PostalAddress", addressLocality, addressCountry },
});

export interface OrganizationSchema {
  "@type": "Organization";
  name: string;
  url?: string;
  description?: string;
  location?: string | PlaceSchema;
  sameAs?: string[];
}

export const createOrganizationSchema = (
  options: Omit<OrganizationSchema, "@type">,
): OrganizationSchema => ({ "@type": "Organization", ...options });

export interface EmployeeRoleSchema {
  "@type": "EmployeeRole";
  roleName?: string;
  startDate?: string;
  endDate?: string;
  worksFor?: OrganizationSchema;
}

export const createEmployeeRoleSchema = (
  options: Omit<EmployeeRoleSchema, "@type">,
): EmployeeRoleSchema => ({ "@type": "EmployeeRole", ...options });

export interface EducationalOrganizationSchema {
  "@type": "EducationalOrganization";
  name: string;
  url?: string;
  sameAs?: string[];
  location?: string | PlaceSchema;
}

export const createEducationalOrganizationSchema = (
  options: Omit<EducationalOrganizationSchema, "@type">,
): EducationalOrganizationSchema => ({ "@type": "EducationalOrganization", ...options });

export interface CollegeOrUniversitySchema {
  "@type": "CollegeOrUniversity";
  name: string;
  url?: string;
  sameAs?: string[];
  location?: string | PlaceSchema;
}

export const createCollegeOrUniversitySchema = (
  options: Omit<CollegeOrUniversitySchema, "@type">,
): CollegeOrUniversitySchema => ({ "@type": "CollegeOrUniversity", ...options });

export interface HighSchoolSchema {
  "@type": "HighSchool";
  name: string;
  url?: string;
  sameAs?: string[];
  location?: string | PlaceSchema;
}

export const createHighSchoolSchema = (
  options: Omit<HighSchoolSchema, "@type">,
): HighSchoolSchema => ({ "@type": "HighSchool", ...options });

export interface EducationalCredentialSchema {
  "@type": "EducationalOccupationalCredential";
  name: string;
  credentialCategory?: { "@type": "DefinedTerm"; name: string; termCode?: string };
  educationalLevel?: string;
  datePublished?: string;
  recognizedBy?: EducationalOrganizationSchema | CollegeOrUniversitySchema | HighSchoolSchema;
}

export interface WebPageSchema {
  "@type": "WebPage";
  "@id": string;
}

export const createWebPageSchema = (id: string): WebPageSchema => ({
  "@type": "WebPage",
  "@id": id,
});

export interface SoftwareSourceCodeSchema {
  "@type": "SoftwareSourceCode";
  name: string;
  description?: string;
  codeRepository?: string; // URL to the GitHub repo
  programmingLanguage?: string | string[]; // e.g., ["TypeScript", "Svelte"]
  author?: PersonSchema | { "@type": "Person"; name: string; url?: string };
  license?: string; // URL to the license (e.g., MIT)
  dateCreated?: string;
  dateModified?: string;
}

export const createSoftwareSourceCodeSchema = (
  options: Omit<SoftwareSourceCodeSchema, "@type">,
): SoftwareSourceCodeSchema => ({ "@type": "SoftwareSourceCode", ...options });

export interface PersonSchema {
  "@type": "Person";
  /**
   * The "@id" property is optional but can be very useful for uniquely identifying the person in structured data, especially when linking to other entities.
   * It should be a URL that ideally points to a page about the person (e.g., their profile page).
   * This allows search engines and other consumers of the structured data to understand that different pieces of data refer to the same individual.
   * For example, you could set it to "https://viktor.andersson.tech/#person" to indicate that this schema describes the person associated with that URL.
   */
  "@id"?: string;
  mainEntityOfPage?: WebPageSchema;
  name: string;
  givenName?: string;
  familyName?: string;
  url?: string;
  image?: string | string[]; // Added
  homeLocation?: string | PlaceSchema;
  jobTitle?: string;
  description?: string;
  knowsLanguage?: string | string[];
  knowsAbout?: string | string[];
  worksFor?:
    | OrganizationSchema
    | EmployeeRoleSchema
    | Array<OrganizationSchema | EmployeeRoleSchema>;
  alumniOf?:
    | EducationalOrganizationSchema
    | CollegeOrUniversitySchema
    | HighSchoolSchema
    | Array<EducationalOrganizationSchema | CollegeOrUniversitySchema | HighSchoolSchema>;
  hasCredential?: EducationalCredentialSchema | EducationalCredentialSchema[];
  sameAs?: string[];
}

export const createPersonSchema = (options: Omit<PersonSchema, "@type">): PersonSchema => ({
  "@type": "Person",
  ...options,
});

export const SITE_OWNER_PERSON_REF = createPersonSchema({
  "@id": `${SITE_URL}/#person`,
  name: "Viktor Andersson",
  url: SITE_URL,
});

export interface ArticleSchema {
  "@type": "Article" | "BlogPosting" | "NewsArticle";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string; // ISO 8601 format (e.g., "2026-03-15T21:07:31+01:00")
  dateModified?: string; // ISO 8601 format
  author?: PersonSchema | OrganizationSchema | Array<PersonSchema | OrganizationSchema>;
  publisher?: OrganizationSchema | PersonSchema;
  mainEntityOfPage?: WebPageSchema | string;
  wordCount?: number;
  keywords?: string | string[];
  articleBody?: string;
  url?: string;
}

export const createArticleSchema = (
  options: Omit<ArticleSchema, "@type"> & { "@type"?: "Article" | "BlogPosting" | "NewsArticle" },
): ArticleSchema => ({
  "@type": options["@type"] || "BlogPosting",
  ...options,
});

export interface ProfilePageSchema {
  "@type": "ProfilePage";
  dateCreated?: string;
  dateModified?: string;
  mainEntity: PersonSchema;
}

export const createProfilePageSchema = (
  options: Omit<ProfilePageSchema, "@type">,
): ProfilePageSchema => ({ "@type": "ProfilePage", ...options });

export interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  name?: string;
  url?: string;
  item?: string;
}

export interface ItemListSchema {
  "@type": "ItemList";
  numberOfItems?: number;
  itemListElement: Pick<ListItemSchema, "@type" | "position" | "item">[];
}

export interface BreadcrumbListSchema {
  "@type": "BreadcrumbList";
  itemListElement: Pick<ListItemSchema, "@type" | "position" | "name" | "item">[];
}

export const createBreadcrumbListSchema = (
  items: { name: string; url?: string }[],
): BreadcrumbListSchema => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((entry, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: entry.name,
    ...(entry.url && { item: entry.url }),
  })),
});

export const createItemListSchema = (urls: string[]): ItemListSchema => ({
  "@type": "ItemList",
  numberOfItems: urls.length,
  itemListElement: urls.map((url, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    item: url,
  })),
});

export interface DefinedTermSchema {
  "@type": "DefinedTerm";
  name: string;
}

export const createDefinedTermSchema = (name: string): DefinedTermSchema => ({
  "@type": "DefinedTerm",
  name,
});

export interface CollectionPageRefSchema {
  "@type": "CollectionPage";
  url: string;
}

export const createCollectionPageRefSchema = (url: string): CollectionPageRefSchema => ({
  "@type": "CollectionPage",
  url,
});

export interface CollectionPageSchema {
  "@type": "CollectionPage";
  name: string;
  description?: string;
  url: string;
  mainEntity: ItemListSchema;
  isPartOf?: CollectionPageRefSchema;
  about?: DefinedTermSchema;
}

export const createCollectionPageSchema = (
  options: Omit<CollectionPageSchema, "@type">,
): CollectionPageSchema => ({ "@type": "CollectionPage", ...options });

export interface WebSiteSchema {
  "@type": "WebSite";
  "@id"?: string;
  name: string;
  url: string;
  description?: string;
  author?: PersonSchema | OrganizationSchema;
  publisher?: PersonSchema | OrganizationSchema;
}

export const createWebSiteSchema = (options: Omit<WebSiteSchema, "@type">): WebSiteSchema => ({
  "@type": "WebSite",
  ...options,
});

export type StructuredDataSchema =
  | PersonSchema
  | OrganizationSchema
  | EducationalOrganizationSchema
  | CollegeOrUniversitySchema
  | HighSchoolSchema
  | EmployeeRoleSchema
  | EducationalCredentialSchema
  | WebPageSchema
  | SoftwareSourceCodeSchema
  | ArticleSchema
  | ProfilePageSchema
  | WebSiteSchema
  | CollectionPageSchema
  | BreadcrumbListSchema
  | DefinedTermSchema;

/** Converts a date string to ISO 8601. Month-only dates (e.g. "2025-07") floor to the 1st. */
export const toISOStartDate = (date: string): string =>
  new Date(date.length === 7 ? `${date}-01` : date).toISOString();

/** Converts a date string to ISO 8601. Month-only dates (e.g. "2025-06") ceil to the last day. */
export const toISOEndDate = (date: string): string => {
  if (date.length === 7) {
    const [year, month] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month, 0)).toISOString();
  }
  return new Date(date).toISOString();
};

export const toJsonLd = (schema: StructuredDataSchema | StructuredDataSchema[]): string => {
  try {
    const payload = Array.isArray(schema)
      ? { "@context": "https://schema.org", "@graph": schema }
      : { "@context": "https://schema.org", ...schema };

    const json = JSON.stringify(payload);

    // Escape characters that can break out of an HTML <script> tag
    return json
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028") // Line separator
      .replace(/\u2029/g, "\\u2029"); // Paragraph separator
  } catch (error) {
    console.error("Failed to stringify JSON-LD schema:", error);
    return "{}"; // Fallback to a safe, empty JSON object
  }
};
