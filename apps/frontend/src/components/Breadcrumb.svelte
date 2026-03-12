<script lang="ts">
	import { page } from '$app/stores';
	let { class: className = '' }: { class?: string } = $props();
	const breadcrumbs = $page.url.pathname.split('/');
</script>

<ol class="flex items-center gap-1 capitalize text-sm {className}">
	{#each breadcrumbs as breadcrumb, index}
		{#if index == 0}
			<li>
				<a class="no-underline!" href="/">Home</a>
			</li>
			<li class="opacity-50">/</li>
		{:else if index != breadcrumbs.length - 1}
			<li>
				<a class="no-underline!" href={breadcrumbs.slice(0, index + 1).join('/')}>{breadcrumb}</a>
			</li>
			<li class="opacity-50">/</li>
		{:else}
			<li>{breadcrumb}</li>
		{/if}
	{/each}
</ol>
