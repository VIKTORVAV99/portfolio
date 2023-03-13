<script lang="ts">
	import TitleText from '$components/TitleText.svelte';
	import IconSet from '$components/IconSet.svelte';
	import FrameworksBanner from '$components/banners/FrameworksBanner.svelte';
	import ToolsBanner from '$components/banners/ToolsBanner.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import BackgroundText from '$components/homePartials/backgroundText.svelte';
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
	<div class="flex flex-col items-center p-8 w-full">
		<Avatar
			width="w-64"
			class="m-3 mt-[9rem]"
			src="images/Viktor Andersson.jpg"
			border="border-surface-300-600-token border-4"
		/>
		<TitleText>Viktor Andersson</TitleText>
		<div class="flex justify-center">
			<IconSet scale={3} />
		</div>
		<h2>About me</h2>
		<p>Open Source Community Engineer and Digital Design and Innovation Student</p>
	</div>

	<div class="flex bg-tertiary-400 text-black">
		<div class="flex flex-col pb-4">
			<h2 class="self-center mt-5">Frameworks and Tools</h2>
			<FrameworksBanner />
			<ToolsBanner direction="reverse" />
		</div>
	</div>
</div>

<BackgroundText />

<style lang="postcss">
</style>
