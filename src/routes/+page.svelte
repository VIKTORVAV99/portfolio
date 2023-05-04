<script lang="ts">
	import IconSet from '$components/IconSet.svelte';
	import Projects from '$components/Projects.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Viktor Andersson</title>
	<meta
		name="description"
		content="Personal portfolio website for Viktor Andersson, Open Source Community Engineer and Digital Design and Innovation student"
	/>
	<link rel="canonical" href="https://viktor.andersson.tech" />
</svelte:head>

<div class="flex flex-col justify-start items-center">
	<section class="flex flex-col items-center p-8 w-full mb-32">
		<picture>
			<source srcset="images/Viktor_Andersson.avif" type="image/avif" />
			<source srcset="images/Viktor_Andersson.webp" type="image/webp" />
			<img
				src="images/Viktor_Andersson.jpg"
				alt="Black and white portrait of Viktor Andersson"
				class="rounded-full"
			/>
		</picture>
		<h1>Viktor Andersson</h1>
		<div class="flex justify-center">
			<IconSet scale={3} />
		</div>
		<h2>About me</h2>
		<p class="max-w-[70ch] text-center">
			I'm an Open Source Community Engineer and Digital Design and Innovation Student working on making the
			world a better place though code and technology. On my free time I like to learn about new things, watch
			Sci-Fi and enjoy nature by walking, taking a bike ride or skiing down a mountain.
		</p>
	</section>
	<h2 class="font-extrabold mb-16">Showcase</h2>
	<Projects projects={data.projects} showAllButton={true} />
</div>

<style lang="postcss">
</style>
