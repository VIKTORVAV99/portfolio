<script lang="ts">
	import LinkBar from './projectComponents/LinkBar.svelte';
	import TechnologyBar from './projectComponents/TechnologyBar.svelte';
	import { AspectRatio } from 'bits-ui';

	import type { ProjectConfig } from '$interfaces/projectConfig';

	let { project }: { project: ProjectConfig } = $props();
</script>

<section id={project.id} class="flex flex-col w-full card m-[1vw] preset-tonal-primary max-w-[100ch] p-4">
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
			<div class="order-1 md:order-2 shrink-0 w-full md:w-[45%] lg:w-[40%] p-4">
				<AspectRatio.Root
					ratio={project.preview.image.aspectRatio.split('/').map(Number).reduce((a, b) => a / b)}
				>
					<enhanced:img
						src={project.preview.image.src}
						alt={project.preview.image.alt}
						class="rounded-lg w-full h-full object-cover"
					/>
				</AspectRatio.Root>
			</div>
		{/if}
	</div>
	<footer class="flex flex-col">
		<a class="btn preset-filled w-fit self-center" href="/projects/{project.id}">Details</a>
	</footer>
</section>
