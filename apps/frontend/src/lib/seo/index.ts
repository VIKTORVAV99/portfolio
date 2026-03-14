export interface PostalAddressSchema {
  "@type": "PostalAddress";
  addressLocality?: string;
  addressCountry?: string;
}

export interface PlaceSchema {
  "@type": "Place";
  address: PostalAddressSchema;
}

export function createPlaceSchema(addressLocality: string, addressCountry: string): PlaceSchema {
  return {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality, addressCountry },
  };
}

export interface OrganizationSchema {
  "@type": "Organization";
  name: string;
  url?: string;
  description?: string;
  location?: string | PlaceSchema;
  sameAs?: string[];
}

export function createOrganizationSchema(
  options: Omit<OrganizationSchema, "@type">,
): OrganizationSchema {
  return { "@type": "Organization", ...options };
}

export interface EmployeeRoleSchema {
  "@type": "EmployeeRole";
  roleName?: string;
  startDate?: string;
  endDate?: string;
  worksFor?: Omit<OrganizationSchema, "@context">;
}

export function createEmployeeRoleSchema(
  options: Omit<EmployeeRoleSchema, "@type">,
): EmployeeRoleSchema {
  return { "@type": "EmployeeRole", ...options };
}

export interface EducationalOrganizationSchema {
  "@type": "EducationalOrganization";
  name: string;
  url?: string;
  sameAs?: string[];
  location?: string | PlaceSchema;
}

export function createEducationalOrganizationSchema(
  options: Omit<EducationalOrganizationSchema, "@type">,
): EducationalOrganizationSchema {
  return { "@type": "EducationalOrganization", ...options };
}

export interface EducationalCredentialSchema {
  "@type": "EducationalOccupationalCredential";
  name: string;
  credentialCategory?: { "@type": "DefinedTerm"; name: string; termCode?: string };
  datePublished?: string;
  recognizedBy?: EducationalOrganizationSchema;
}

export interface WebPageSchema {
  "@type": "WebPage";
  "@id": string;
}

export function createWebPageSchema(id: string): WebPageSchema {
  return { "@type": "WebPage", "@id": id };
}

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

export function createSoftwareSourceCodeSchema(
  options: Omit<SoftwareSourceCodeSchema, "@type">,
): SoftwareSourceCodeSchema {
  return { "@type": "SoftwareSourceCode", ...options };
}

export interface PersonSchema {
  "@context": "https://schema.org";
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
    | Omit<OrganizationSchema, "@context">
    | EmployeeRoleSchema
    | Array<Omit<OrganizationSchema, "@context"> | EmployeeRoleSchema>;
  alumniOf?: EducationalOrganizationSchema;
  hasCredential?: EducationalCredentialSchema | EducationalCredentialSchema[];
  sameAs?: string[];
}

export function createPersonSchema(
  options: Omit<PersonSchema, "@context" | "@type">,
): PersonSchema {
  return { "@context": "https://schema.org", "@type": "Person", ...options };
}

// Updated union type to include WebPageSchema
export type StructuredDataSchema =
  | PersonSchema
  | OrganizationSchema
  | EducationalOrganizationSchema
  | EmployeeRoleSchema
  | EducationalCredentialSchema
  | WebPageSchema
  | SoftwareSourceCodeSchema;

export function toJsonLd(schema: StructuredDataSchema): string {
  try {
    const json = JSON.stringify(schema);

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
}
