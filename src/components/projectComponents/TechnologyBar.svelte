<script lang="ts">
	import type { ProjectConfig } from '$interfaces/projectConfig';
	export let technologies: ProjectConfig['technologies'];
</script>

<ul class="flex w-full flex-wrap mt-4 text-tertiary-600 hover:[&>li]:text-tertiary-300">
	{#each technologies as technology}
		{#if technology.preview}
			<li class="inline-flex">
				<a class="text-sm mr-4" href={technology.url}>{technology.name}</a>
			</li>
		{/if}
	{/each}
</ul>

<style>
	a {
		color: var(--color-tertiary) !important;
		text-decoration: none !important;
	}
</style>
