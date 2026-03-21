import { SITE_URL } from "$lib/config";
import { createProfilePageSchema, createWebPageSchema } from "$lib/seo";
import { PROFILE_DATE_CREATED, PROFILE_DATE_MODIFIED, siteOwnerPerson } from "$lib/seo/person";

import type { PageLoad } from "./$types";

const structuredData = createProfilePageSchema({
  dateCreated: PROFILE_DATE_CREATED,
  dateModified: PROFILE_DATE_MODIFIED,
  mainEntity: { ...siteOwnerPerson, mainEntityOfPage: createWebPageSchema(`${SITE_URL}/about`) },
});

export const load = (() => {
  return {
    structuredData,
  };
}) satisfies PageLoad;

export const prerender = true;
