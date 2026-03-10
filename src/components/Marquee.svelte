<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		duration = 150,
		direction = 'normal',
		hover = 'running',
		class: className = '',
		children
	}: {
		duration?: number;
		direction?: 'normal' | 'reverse';
		hover?: 'paused' | 'running';
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div
	class="flex w-full flex-row overflow-x-hidden {className}"
	style="--marquee-duration: {duration}s;--marquee-direction:{direction};--marquee-hover:{hover}"
>
	<div class="animate-marquee flex-none min-w-full flex-row items-center">
		{@render children()}
	</div>
	<div class="animate-marquee flex-none min-w-full flex-row items-center">
		{@render children()}
	</div>
</div>

<style>
	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}
	div > div {
		animation: marquee var(--marquee-duration) linear 0s infinite var(--marquee-direction);
	}
	div:hover > div {
		animation-play-state: var(--marquee-hover);
	}
</style>
