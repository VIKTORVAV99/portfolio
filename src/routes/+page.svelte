<script lang="ts">
	import TitleText from '$components/TitleText.svelte';
	import IconSet from '$components/IconSet.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
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
	<section class="flex flex-col items-center p-8 w-full mb-[30%]">
		<Avatar
			width="w-64"
			class="m-3"
			src="images/Viktor Andersson.webp"
			border="border-surface-300-600-token border-4"
		/>
		<TitleText>Viktor Andersson</TitleText>
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

	<Projects projects={data.projects} />
</div>

<style lang="postcss">
</style>
