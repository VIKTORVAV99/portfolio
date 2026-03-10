<script lang="ts">
	import ProjectPreview from '$components/ProjectPreview.svelte';
	import { groupBy } from '../helpers/groupBy';
	import type { ProjectConfig } from '$interfaces/projectConfig';
	let { projects, showAllButton = false }: { projects: ProjectConfig[]; showAllButton?: boolean } = $props();

	// Group projects by type
	const projectsByType = $derived(groupBy(projects, (project) => project.type));
</script>

{#each Object.entries(projectsByType) as [type, value]}
	<section id={type} class="flex flex-col w-full items-center justify-center mb-16">
		<h2 class="h2 capitalize font-bold">{type} Projects</h2>
		<section class="w-full flex flex-col justify-center items-center">
			{#each value as project}
				<ProjectPreview {project} />
			{/each}
		</section>
		{#if showAllButton}
			<a class="btn preset-filled" href="/projects#{type}">Show all {type} projects</a>
		{/if}
	</section>
{/each}
