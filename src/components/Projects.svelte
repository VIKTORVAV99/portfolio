<script lang="ts">
	import ProjectPreview from '$components/ProjectPreview.svelte';
	import { groupBy } from '../helpers/groupBy';
	import type { ProjectConfig } from '$interfaces/projectConfig';
	export let projects: ProjectConfig[];

	// Group projects by type
	const projectsByType = groupBy(projects, (project) => project.type);
</script>

{#each Object.entries(projectsByType) as [type, value]}
	<section class="flex flex-col items-center mb-16">
		<h2 class="capitalize font-bold">{type} Projects</h2>
		<section>
			{#each value as project}
				<ProjectPreview {project} />
			{/each}
		</section>
	</section>
{/each}
