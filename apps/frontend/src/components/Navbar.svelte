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

<header class="fixed z-10 w-full">
	<nav
		class="bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm h-12 flex items-center w-full shadow-xl justify-center"
	>
		<div class="w-full max-w-[100ch]">
			{#each links as link}
				<a href={link.href} class="btn">{link.name}</a>
			{/each}
		</div>
	</nav>

	<UnderConstruction />
</header>
