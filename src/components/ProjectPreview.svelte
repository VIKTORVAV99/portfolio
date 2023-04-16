<script lang="ts">
	import LinkBar from './projectComponents/LinkBar.svelte';
	import TechnologyBar from './projectComponents/TechnologyBar.svelte';

	import type { ProjectConfig } from '$interfaces/projectConfig';

	export let project: ProjectConfig;
</script>

<svelte:head>
	{#if project.preview.image?.src}
		<link rel="prefetch" href={project.preview.image.src} as="image" />
	{/if}
</svelte:head>

<section id={project.id} class="flex flex-col card m-[1vw] variant-glass-tertiary max-w-[100ch] p-4">
	<div class="flex flex-col md:flex-row">
		<main class="flex flex-col px-4 order-2 md:order-1">
			<h3 class="mt-4 font-bold mb-8">
				{project.title}
				{#if project.id == 'portfolio'}<span class="text-tertiary-800">(this website)</span>{/if}
			</h3>
			<p>
				{project.preview.description}
			</p>
			<TechnologyBar technologies={project.technologies} />
			<LinkBar links={project.links} />
		</main>
		{#if project.preview.image}
			<img
				style="aspect-ratio:{project.preview.image.aspectRatio}"
				class="order-1 md:order-2 rounded-lg m-4 md:max-w-[50%] lg:max-w-[40%] ] md:w-full h-full"
				src={project.preview.image.src}
				alt={project.preview.image.alt}
			/>
		{/if}
	</div>
	<footer class="card-footer flex flex-col">
		<a class="btn variant-filled w-fit self-center" href="/projects/{project.id}">Details</a>
	</footer>
</section>
