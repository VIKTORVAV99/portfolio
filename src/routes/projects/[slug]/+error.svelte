<script lang="ts">
	import { page } from '$app/stores';
	import TitleText from '$components/TitleText.svelte';
</script>

<svelte:head>
	<title>Viktor Andersson | {$page.status}</title>
</svelte:head>

<div class="flex justify-center mt-[100px]">
	<div class="flex flex-col items-center">
		<TitleText>{$page.status}</TitleText>
		<p>{$page.error?.message}</p>
		<a class="btn variant-filled-primary w-fit self-center mt-4" href="/projects">Go to projects</a>
		<a class="btn variant-filled-primary w-fit self-center mt-4" href="/">Home</a>
	</div>
</div>
