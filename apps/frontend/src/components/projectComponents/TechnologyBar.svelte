<script lang="ts">
	import type { ProjectConfig } from '$interfaces/projectConfig';
	let { technologies }: { technologies: ProjectConfig['technologies'] } = $props();
</script>

<ul class="flex w-full flex-wrap">
	{#each technologies as technology}
		{#if technology.preview}
			<li class="inline-flex">
				<a class="text-sm mr-4 no-underline text-primary-800 dark:text-primary-700" href={technology.url}
					>{technology.name}</a
				>
			</li>
		{/if}
	{/each}
</ul>
