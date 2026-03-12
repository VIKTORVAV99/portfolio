import type { PageLoad } from "./$types";
import projects from "$data/projects";
import {
  createPersonSchema,
  createOrganizationSchema,
  createEducationalOrganizationSchema,
  createEmployeeRoleSchema,
  createPlaceSchema,
} from "$lib/seo";

const electricityMaps = createOrganizationSchema({
  name: "Electricity Maps",
  url: "https://www.electricitymaps.com",
  description: "The world's most comprehensive electricity data platform",
  location: createPlaceSchema("Copenhagen", "DK"),
  sameAs: [
    "https://www.wikidata.org/wiki/Q109023297",
    "https://www.linkedin.com/company/electricitymaps/",
  ],
});

const hh = createEducationalOrganizationSchema({
  name: "Halmstad University",
  url: "https://www.hh.se",
  location: createPlaceSchema("Halmstad", "SE"),
  sameAs: [
    "https://www.wikidata.org/wiki/Q502842",
    "https://www.linkedin.com/school/h%C3%B6gskolan-i-halmstad/",
  ],
});

const structuredData = createPersonSchema({
  name: "Viktor Andersson",
  givenName: "Viktor",
  familyName: "Andersson",
  url: "https://viktor.andersson.tech",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer at Electricity Maps, the world's most comprehensive electricity data platform. BSc in Digital Design and Innovation from Halmstad University.",
  worksFor: [
    createEmployeeRoleSchema({
      roleName: "Software Engineer",
      startDate: "2025-07",
      worksFor: electricityMaps,
    }),
    createEmployeeRoleSchema({
      roleName: "Open Source Community Engineer",
      startDate: "2022-12",
      endDate: "2025-06",
      worksFor: electricityMaps,
    }),
  ],
  alumniOf: hh,
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Bachelor of Science in Digital Design and Innovation",
      credentialCategory: { "@type": "DefinedTerm", name: "Degree", termCode: "BSc" },
      datePublished: "2025-06",
      recognizedBy: hh,
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "High School Diploma in Information and Media Technology",
      credentialCategory: { "@type": "DefinedTerm", name: "High School Diploma" },
      datePublished: "2020-06",
      recognizedBy: {
        "@type": "EducationalOrganization",
        name: "Haganässkolan",
        location: createPlaceSchema("Älmhult", "SE"),
        sameAs: ["https://www.wikidata.org/wiki/Q89791742"],
      },
    },
  ],
  sameAs: ["https://github.com/viktorvav99", "https://www.linkedin.com/in/viktor-va-andersson/"],
});

export const load = (() => {
  return {
    projects: projects.filter((entry) => entry.showcase),
    structuredData,
  };
}) satisfies PageLoad;
