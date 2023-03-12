<script lang="ts">
	import Marquee from '../Marquee.svelte';
	import Frameworks from '../../data/frameworks.json';
	export let direction: 'normal' | 'reverse' = 'normal';
</script>

<Marquee duration={150} {direction} hover="paused" class={$$props.class}>
	<div class="flex">
		{#each [...Frameworks, ...Frameworks] as framework}
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
