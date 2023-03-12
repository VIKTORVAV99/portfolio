<script lang="ts">
	import { page } from '$app/stores';
	import TitleText from '$components/TitleText.svelte';
</script>

<svelte:head>
	<title>Vitkor Andersson | {$page.status}</title>
</svelte:head>

<div class="flex justify-center mt-[100px]">
	<div class="flex flex-col items-center">
		<TitleText text={$page.status} />
		<p>{$page.error?.message}</p>
	</div>
</div>
