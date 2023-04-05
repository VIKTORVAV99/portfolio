<script lang="ts">
	import { page } from '$app/stores';
	const breadcrumbs = $page.url.pathname.split('/');
</script>

<ol class="breadcrumb capitalize text-sm {$$props.class}">
	{#each breadcrumbs as breadcrumb, index}
		{#if index == 0}
			<li class="crumb">
				<a class="!no-underline" href="/">Home</a>
			</li>
			<li class="crumb-separator">/</li>
		{:else if index != breadcrumbs.length - 1}
			<li class="crumb">
				<a class="!no-underline" href={breadcrumbs.slice(0, index + 1).join('/')}>{breadcrumb}</a>
			</li>
			<li class="crumb-separator">/</li>
		{:else}
			<li class="crumb">{breadcrumb}</li>
		{/if}
	{/each}
</ol>
