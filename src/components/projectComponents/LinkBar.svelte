<script lang="ts">
	import type { Link } from '$interfaces/projectConfig';

	export let links: Link[];
</script>

<ul class="flex w-full flex-wrap">
	{#each links as link}
		<li class="inline-flex">
			<a class="text-sm mr-4 py-1" href={link.url}>{link.title}</a>
		</li>
	{/each}
</ul>

<style lang="postcss">
	a {
		@apply no-underline !important;
		@apply text-primary-800 !important;
		@apply dark:text-primary-700 !important;
	}
</style>
