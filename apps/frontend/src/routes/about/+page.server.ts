import { SITE_URL } from "$lib/config";
import { createBreadcrumbListSchema, createProfilePageSchema, createWebPageSchema } from "$lib/seo";
import { PROFILE_DATE_CREATED, PROFILE_DATE_MODIFIED, siteOwnerPerson } from "$lib/seo/person";

import type { PageServerLoad } from "./$types";

const structuredData = [
  createProfilePageSchema({
    dateCreated: PROFILE_DATE_CREATED,
    dateModified: PROFILE_DATE_MODIFIED,
    mainEntity: { ...siteOwnerPerson, mainEntityOfPage: createWebPageSchema(`${SITE_URL}/about`) },
  }),
  createBreadcrumbListSchema([{ name: "Home", url: SITE_URL }, { name: "About" }]),
];

export const load = (() => ({
  structuredData,
})) satisfies PageServerLoad;
