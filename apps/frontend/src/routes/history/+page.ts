import { SITE_URL } from "$lib/config";
import { createProfilePageSchema, createWebPageSchema } from "$lib/seo";
import { siteOwnerPerson } from "$lib/seo/person";

import type { PageLoad } from "./$types";

const structuredData = createProfilePageSchema({
  dateCreated: "2025-03-01",
  dateModified: "2026-03-17",
  mainEntity: {
    ...siteOwnerPerson,
    mainEntityOfPage: createWebPageSchema(`${SITE_URL}/history`),
  },
});

export const load = (() => ({ structuredData })) satisfies PageLoad;

export const prerender = true;
