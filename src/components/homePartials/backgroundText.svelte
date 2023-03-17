<script lang="ts">
	let scroll: number;
</script>

<svelte:window bind:scrollY={scroll} />

<div
	class="fixed top-0 -z-10 text-[16vw] leading-tight w-full text-surface-500 overflow-hidden"
	style:transform="translateY(-{scroll * 1.1}px)"
>
	<span class="p-4">Programmer</span>
	<span class="p-4">UX/UI</span>
	<span class="p-4">Engineer</span>
	<span class="p-4">Designer</span>
	<span class="p-4">Developer</span>
	<span class="p-4">Creator</span>
	<span class="p-4">Innovator</span>
	<span class="p-4">Maker</span>
</div>
