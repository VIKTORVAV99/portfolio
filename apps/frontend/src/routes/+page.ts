import type { PageLoad } from "./$types";
import projects from "$data/projects";
import { createPersonSchema } from "$lib/seo";

const structuredData = createPersonSchema({
  name: "Viktor Andersson",
  givenName: "Viktor",
  familyName: "Andersson",
  url: "https://viktor.andersson.tech",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer at Electricity Maps, the world's most comprehensive electricity data platform. BSc in Digital Design and Innovation from Halmstad University.",
  worksFor: {
    "@type": "Organization",
    name: "Electricity Maps",
    url: "https://www.electricitymaps.com",
    description: "The world's most comprehensive electricity data platform",
    location: "Denmark",
  },
  alumniOf: { "@type": "EducationalOrganization", name: "Halmstad University" },
  sameAs: ["https://github.com/viktorvav99", "https://www.linkedin.com/in/viktor-va-andersson/"],
});

export const load = (() => {
  return {
    projects: projects.filter((entry) => entry.showcase),
    structuredData,
  };
}) satisfies PageLoad;
