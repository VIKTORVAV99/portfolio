<script lang="ts">
	import { page } from '$app/stores';
	import TitleText from '$components/TitleText.svelte';
</script>

<svelte:head>
	<title>Viktor Andersson | {$page.status}</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[40vh] mt-24">
	<TitleText>{$page.status}</TitleText>
	{#if $page.error?.message}
		<p class="mt-2 text-center text-surface-500 dark:text-surface-400">{$page.error.message}</p>
	{/if}
</div>
