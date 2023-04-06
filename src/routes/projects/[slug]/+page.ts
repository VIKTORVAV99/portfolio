import type { ProjectConfig } from '../../../interfaces/projectConfig';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
	const json: ProjectConfig = await fetch(`/projects/${params.slug}.json`)
		.then((res) => res.json())
		.catch((err) => {
			throw error(err.status, { message: err.message });
		});
	return {
		project: json
	};
}) satisfies PageLoad;
