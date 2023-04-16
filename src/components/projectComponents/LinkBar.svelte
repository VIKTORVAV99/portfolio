<script lang="ts">
	import type { Link } from '$interfaces/projectConfig';

	export let links: Link[];
</script>

<ul class="flex w-full flex-wrap my-3 text-tertiary-600 hover:[&>li]:text-tertiary-300">
	{#each links as link}
		<li class="">
			<a class="text-sm mr-4 py-1" href={link.url}>{link.title}</a>
		</li>
	{/each}
</ul>

<style>
	a {
		color: var(--color-tertiary) !important;
		text-decoration: none !important;
	}
</style>
