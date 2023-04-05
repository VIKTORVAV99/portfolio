import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
	const file = await fetch(`/projects/${params.slug}.json`)
		.then((res) => res.text())
		.catch((err) => {
			throw error(err.status, { message: err.message });
		});
	const json = JSON.parse(file);
	return {
		project: json
	};
}) satisfies PageLoad;
