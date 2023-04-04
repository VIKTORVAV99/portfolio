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
	<nav class="variant-glass-surface h-12 flex items-center w-full shadow-xl">
		<ul class="inline-flex text-2xl">
			{#each links as link}
				<li class="mx-4">
					<a href={link.href} class="btn">{link.name}</a>
				</li>
			{/each}
		</ul>
	</nav>
	<UnderConstruction />
</header>

<style>
	.active {
		font-weight: bold;
	}
</style>
