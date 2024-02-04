import type { PageLoad } from './$types';
import projects from '$data/projects.json';
import type { ProjectConfig } from '$interfaces/projectConfig';

export const load = ( ({fetch}) => {
	const json = projects.filter((entry) => entry.showcase) as ProjectConfig[];
	const personal_info = fetch('/api/personal_data/').then((r) => r.json());
	return {
		projects: json,
		personalData: personal_info
	};
}) satisfies PageLoad;
