<script lang="ts">
	import UnderConstruction from './banners/UnderConstruction.svelte';

	const links = [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'Projects',
			href: '/projects'
		}
	];
</script>

<header class="fixed">
	<nav class="variant-glass-surface h-12 flex items-center w-full shadow-xl justify-center">
		<div class="w-full max-w-[100ch]">
			{#each links as link}
				<a href={link.href} class="btn">{link.name}</a>
			{/each}
		</div>
	</nav>

	<UnderConstruction />
</header>

<style>
</style>
