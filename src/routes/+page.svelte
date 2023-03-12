<script lang="ts">
	import TitleText from '$components/TitleText.svelte';
	import IconSet from '$components/IconSet.svelte';
	import FrameworksBanner from '$components/banners/FrameworksBanner.svelte';
	import ToolsBanner from '$components/banners/ToolsBanner.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
	<title>Viktor Andersson</title>
	<meta
		name="description"
		content="Personal website for Viktor Andersson, Open Source Community Engineer and Digital Design and Innovation student"
	/>
	<link rel="canonical" href="https://viktor.andersson.tech" />
</svelte:head>

<div class="flex flex-col mt-[11rem] justify-start items-center h-[calc(100%-11rem)]">
	<div class="flex flex-col items-center card w-fit p-4 variant-glass-surface xl:max-w-1/2">
		<Avatar
			width="w-64"
			class="m-3 -mt-[9rem]"
			src="images/Viktor Andersson.jpg"
			border="border-surface-300-600-token border-4"
		/>
		<TitleText>Viktor Andersson</TitleText>
		<div class="flex justify-center">
			<IconSet scale={3} />
		</div>
		<p>Open Source Community Engineer and Digital Design and Innovation Student</p>
	</div>
	<div class="mt-[100px] variant-glass">
		<FrameworksBanner />
		<ToolsBanner direction="reverse" />
	</div>
</div>

<div
	class="absolute top-0 pt-8 sm:px-24 md:px-32 lg:px-40 xl:px-48 -z-10 text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-inter w-full h-screen overflow-hidden"
>
	<div class="p-8 xl:p-4">Programmer</div>
	<div class="p-8 xl:p-4">UX/UI</div>
	<div class="p-8 xl:p-4">Engineer</div>
	<div class="p-8 xl:p-4">Designer</div>
	<div class="p-8 xl:p-4">Developer</div>
</div>

<style lang="postcss">
</style>
