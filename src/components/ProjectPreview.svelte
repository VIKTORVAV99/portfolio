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

<section id={project.id} class="flex flex-col w-full card m-[1vw] variant-glass-primary max-w-[100ch] p-4">
	<div class="flex flex-col md:flex-row">
		<main class="flex flex-col p-4 order-2 md:order-1 gap-4">
			<h3 class="h3 font-bold">
				{project.title}
				{#if project.id == 'portfolio'}<span class="text-primary-800">(this website)</span>{/if}
			</h3>
			<p>
				{project.preview.description}
			</p>
			<TechnologyBar technologies={project.technologies} />
			<LinkBar links={project.links} />
		</main>
		{#if project.preview.image}
			{#if project.preview.image.otherFormats}
				<picture
					style="aspect-ratio:{project.preview.image.aspectRatio}"
					class="order-1 md:order-2 rounded-lg m-4 md:max-w-[50%] lg:max-w-[40%] ] md:w-full h-full"
				>
					{#each project.preview.image.otherFormats as format}
						<source
							srcset={`${project.preview.image.src.split('.').at(0)}.${format}`}
							type={`image/${format}`}
						/>
					{/each}
					<img src={project.preview.image.src} alt={project.preview.image.alt} />
				</picture>
			{:else}
				<img
					style="aspect-ratio:{project.preview.image.aspectRatio}"
					class="order-1 md:order-2 rounded-lg m-4 md:max-w-[50%] lg:max-w-[40%] ] md:w-full h-full"
					src={project.preview.image.src}
					alt={project.preview.image.alt}
				/>
			{/if}
		{/if}
	</div>
	<footer class="card-footer flex flex-col">
		<a class="btn variant-filled w-fit self-center" href="/projects/{project.id}">Details</a>
	</footer>
</section>
