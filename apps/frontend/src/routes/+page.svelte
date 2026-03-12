<script lang="ts">
	import IconSet from '$components/IconSet.svelte';
	import Timeline from '$components/Timeline.svelte';
	import { timelineEntries } from '$data/timeline';
	import type { PageData } from './$types';
	import portrait from '$lib/images/Viktor_Andersson.jpg?enhanced';
	import { toJsonLd } from '$lib/seo';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Viktor Andersson</title>
	<meta
		name="description"
		content="Personal portfolio website for Viktor Andersson, Software Engineer at Electricity Maps and Digital Design and Innovation graduate"
	/>
	<link rel="canonical" href="https://viktor.andersson.tech" />
	{@html `<script type="application/ld+json">${toJsonLd(data.structuredData)}</script>`}
</svelte:head>

<div class="flex flex-col justify-start items-center">
	<section class="flex flex-col items-center p-8 w-full mb-32">
		<enhanced:img
			src={portrait}
			alt="Black and white portrait of Viktor Andersson"
			class="rounded-full border border-surface-100 dark:border-surface-800"
		/>
		<h1 class="h1">Viktor Andersson</h1>
		<div class="flex justify-center my-4">
			<IconSet />
		</div>
		<h2 class="h2">About me</h2>
		<p class="max-w-[70ch] text-center">
			I'm a Software Engineer at Electricity Maps, the world's most comprehensive electricity data platform.
			I hold a Bachelor of Science in Digital Design and Innovation from Halmstad University. On my free time
			I like to learn about new things, watch Sci-Fi and enjoy nature by walking, taking a bike ride or skiing
			down a mountain.
		</p>
	</section>
	<h2 class="h2 font-extrabold mb-4">Experience</h2>
	<Timeline entries={timelineEntries} />
</div>

<style>
</style>
