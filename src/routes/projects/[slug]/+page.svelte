<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumb from '$components/Breadcrumb.svelte';
	import LinkBar from '$components/projectComponents/LinkBar.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Viktor Andersson | {data.project.title}</title>
	<meta name="description" content={data.project.preview.description} />
	<meta name="keywords" content={data.project.keywords.join(', ')} />
</svelte:head>

<div class="flex justify-center">
	<section class="card p-8 my-16 variant-glass-primary max-w-[100ch] flex flex-col gap-4">
		<h1 class="h1 font-semibold mb-1">{data.project.title}</h1>
		<Breadcrumb />
		<hr />
		<LinkBar links={data.project.links} />
		<hr />
		<p>
			{data.project.details.tagline}
		</p>
		<hr />
		<section class="flex flex-col gap-1">
			<h3 class="h3">Description</h3>
			<p>
				{data.project.details.description}
			</p>
		</section>
		<section class="flex flex-col gap-1">
			<h3 class="h3">Technologies used in the project</h3>
			<ul class="list flex flex-col gap-2">
				{#each data.project.technologies as technology}
					<li>
						<section class="ml-4">
							<h4 class="h4">{technology.name}</h4>
							<p class="text-sm">{technology.description}</p>
						</section>
					</li>
				{/each}
			</ul>
		</section>
	</section>
</div>

<style>
	p {
		white-space: normal;
	}
</style>
