<script lang="ts">
	export let duration: number = 150;
	export let direction: 'normal' | 'reversed' = 'normal';
	export let hover: 'paused' | 'running' = 'running';
</script>

<!--
	@component
	Marquee component.
-->

<div
	class="flex w-full flex-row overflow-x-hidden bg-warning-400 shadow text-black"
	style="--marquee-duration: {duration}s;--marquee-direction:{direction};--marquee-hover:{hover}"
>
	<div class="animate-marquee flex-none min-w-full flex-row items-center">
		<slot />
	</div>
	<div class="animate-marquee flex-none min-w-full flex-row items-center">
		<slot />
	</div>
</div>

<style lang="postcss">
	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}
	div > div {
		animation: marquee var(--marquee-duration) linear 0s infinite;
		animation-direction: var(--marquee-direction);
	}
	div:hover > div {
		animation-play-state: var(--marquee-hover);
	}
</style>
