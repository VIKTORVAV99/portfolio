import { SITE_URL } from "$lib/config";
import { createWebSiteSchema, SITE_OWNER_PERSON_REF } from "$lib/seo";
import { siteOwnerPerson } from "$lib/seo/person";

import type { PageLoad } from "./$types";

const structuredData = [
  createWebSiteSchema({
    "@id": `${SITE_URL}/#website`,
    name: "Viktor Andersson",
    url: SITE_URL,
    description:
      "Personal website for Viktor Andersson, Software Engineer at Electricity Maps.",
    author: SITE_OWNER_PERSON_REF,
    publisher: SITE_OWNER_PERSON_REF,
  }),
  siteOwnerPerson,
];

export const load = (() => {
  return {
    structuredData,
  };
}) satisfies PageLoad;

export const prerender = true;
