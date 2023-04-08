import type { PageLoad } from './$types';
import projects from '$data/projects.json';
import type { ProjectConfig } from '$interfaces/projectConfig';

export const load = (() => {
	const json = projects as ProjectConfig[];
	return {
		projects: json
	};
}) satisfies PageLoad;
