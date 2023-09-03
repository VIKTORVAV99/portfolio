<script lang="ts">
	import type { PageData } from './$types';
	import Projects from '$components/Projects.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Viktor Andersson | Projects</title>
	<meta name="description" content="" />
	<meta name="keywords" content="" />
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="h1 my-16 font-extrabold">All Projects</h1>
	<Projects projects={data.projects} />
</div>
