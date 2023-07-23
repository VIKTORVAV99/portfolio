<script lang="ts">
	import type { ProjectConfig } from '$interfaces/projectConfig';
	export let technologies: ProjectConfig['technologies'];
</script>

<ul class="flex w-full flex-wrap mt-4">
	{#each technologies as technology}
		{#if technology.preview}
			<li class="inline-flex">
				<a class="text-sm mr-4" href={technology.url}>{technology.name}</a>
			</li>
		{/if}
	{/each}
</ul>

<style lang="postcss">
	a {
		@apply no-underline !important;
		@apply text-tertiary-800 !important;
		@apply dark:text-tertiary-700 !important;
	}
</style>
