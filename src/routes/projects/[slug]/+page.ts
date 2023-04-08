import type { ProjectConfig } from '../../../interfaces/projectConfig';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import projects from '$data/projects.json';

export const load = (async ({ params }) => {
	const json = projects.filter((entry) => entry.id === params.slug).at(0) as ProjectConfig;
	if (json) {
		return {
			project: json
		};
	} else {
		throw error(404, 'Project not found!');
	}
}) satisfies PageLoad;
