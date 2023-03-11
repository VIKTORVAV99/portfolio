<script lang="ts">
	import TitleText from '$components/TitleText.svelte';
	import IconSet from '$components/IconSet.svelte';
	import FrameworksBanner from '$components/FrameworksBanner.svelte';
</script>

<svelte:head>
	<title>Viktor Andersson</title>
	<meta
		name="description"
		content="Personal website for Viktor Andersson, Open Source Community Engineer and Digital Design and Innovation student"
	/>
	<link rel="canonical" href="https://viktor.andersson.tech" />
</svelte:head>

<div class="flex flex-col mt-[100px] justify-start items-center h-[calc(100%-100px)]">
	<div class="flex flex-col items-center card w-fit p-4 variant-glass-surface">
		<TitleText text="Viktor Andersson" />
		<div class="flex justify-center">
			<IconSet scale={3} />
		</div>
		<p>Open Source Community Engineer and Digital Design and Innovation Student</p>
	</div>
	<div class="mt-auto">
		<FrameworksBanner />
	</div>
</div>

<style lang="postcss">
</style>
