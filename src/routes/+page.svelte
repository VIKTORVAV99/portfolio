<script lang="ts">
	import TitleText from '$components/TitleText.svelte';
	import IconSet from '$components/IconSet.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import BackgroundText from '$components/homePartials/backgroundText.svelte';
	import Projects from '$components/homePartials/Projects.svelte';
</script>

<svelte:head>
	<title>Viktor Andersson</title>
	<meta
		name="description"
		content="Personal website for Viktor Andersson, Open Source Community Engineer and Digital Design and Innovation student"
	/>
	<link rel="canonical" href="https://viktor.andersson.tech" />
</svelte:head>

<div class="flex flex-col justify-start items-center">
	<section class="flex flex-col items-center p-8 w-full min-h-screen">
		<Avatar
			width="w-64"
			class="m-3 mt-[4rem]"
			src="images/Viktor Andersson.jpg"
			border="border-surface-300-600-token border-4"
		/>
		<TitleText>Viktor Andersson</TitleText>
		<div class="flex justify-center">
			<IconSet scale={3} />
		</div>
		<h2>About me</h2>
		<p>Open Source Community Engineer and Digital Design and Innovation Student</p>
	</section>

	<Projects />
</div>

<BackgroundText />

<style lang="postcss">
</style>
