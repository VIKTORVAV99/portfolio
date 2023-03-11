<script lang="ts">
	import Marquee from './Marquee.svelte';

	const frameworks = [
		{
			name: 'SvelteKit',
			url: 'https://kit.svelte.dev/',
			imagePath: '/images/SvelteKit.svg',
			alt: 'SvelteKit Logo'
		},
		{
			name: 'Tailwind CSS',
			url: 'https://tailwindcss.com/',
			imagePath: '/images/Tailwind_CSS.svg',
			alt: 'Tailwind CSS Logo'
		},
		{
			name: 'Skeleton',
			url: 'https://skeleton.dev/',
			imagePath: '/images/Skeleton.svg',
			alt: 'Skeleton Logo'
		}
	];
</script>

<Marquee duration={150} direction="normal" hover="paused" class="variant-glass-surface {$$props.class}">
	<div class="flex">
		{#each [...frameworks, ...frameworks] as framework}
			<a href={framework.url} title={framework.name}>
				<img src={framework.imagePath} alt={framework.alt} />
			</a>
		{/each}
	</div>
</Marquee>

<style>
	a {
		margin: 1rem;
	}
	a > img {
		height: 50px;
	}
</style>
