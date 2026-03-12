<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<h1
	class="
  
    lg:text-5xl
    xl:text-6xl font-inter font-extrabold"
>
	{@render children()}
</h1>
