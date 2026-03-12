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

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  givenName?: string;
  familyName?: string;
  url?: string;
  jobTitle?: string;
  description?: string;
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

export function toJsonLd(schema: object): string {
  return JSON.stringify(schema);
}
