<script lang="ts">
	import Marquee from '../Marquee.svelte';
	import Tools from '../../data/tools.json';
	export let direction: 'normal' | 'reverse' = 'normal';
</script>

<Marquee {direction}>
	<div class="flex">
		{#each Tools as tool}
			<a href={tool.url} title={tool.name}>
				<img src={tool.imagePath} alt={tool.alt} />
			</a>
		{/each}
	</div>
</Marquee>

<style>
	a {
		margin: 0.5rem;
	}
	a > img {
		height: 25px;
	}
</style>
