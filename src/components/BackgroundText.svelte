<script lang="ts">
	let scroll = 0;
</script>

<svelte:window bind:scrollY={scroll} />

<div
	class="fixed top-0 mt-16 -z-10 text-[16.5vw] leading-tight w-full text-surface-200-700-token overflow-hidden"
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
