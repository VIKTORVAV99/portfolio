<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumb from '$components/Breadcrumb.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Viktor Andersson | {data.project.title}</title>
	<meta name="description" content={data.project.preview.description} />
	<meta name="keywords" content={data.project.keywords.join(', ')} />
</svelte:head>

<div class="flex justify-center">
	<section class="card p-4 my-16 variant-glass-tertiary max-w-[1000px] flex flex-col">
		<h1 class="py-4">{data.project.title}</h1>
		<Breadcrumb />
		<p>
			{data.project.details.tagline}
		</p>
		<hr class="my-4" />
		<p>
			{data.project.details.description}
		</p>
		<section class="pt-16">
			<h2>Technologies</h2>
			<ul class="list">
				{#each data.project.technologies as technology}
					<li>
						<section>
							<h3>{technology.name}</h3>
							<p>{technology.description}</p>
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
