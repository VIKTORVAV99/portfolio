<script lang="ts">
	import type { Link } from '$interfaces/projectConfig';

	let { links }: { links: Link[] } = $props();
</script>

<ul class="flex w-full flex-wrap">
	{#each links as link}
		<li class="inline-flex">
			<a class="text-sm mr-4 py-1 no-underline text-primary-800 dark:text-primary-700" href={link.url}
				>{link.title}</a
			>
		</li>
	{/each}
</ul>
