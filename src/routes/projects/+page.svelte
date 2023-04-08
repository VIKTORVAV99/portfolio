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

<h1>Projects</h1>

<Projects projects={data.projects} />
