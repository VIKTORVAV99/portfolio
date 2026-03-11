<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		color,
		accentSide = 'left',
		children
	}: {
		color: string;
		accentSide?: 'left' | 'right';
		children: Snippet;
	} = $props();
</script>

<div
	class="rounded-lg px-4 py-2 bg-surface-100 dark:bg-surface-800 w-full max-w-88 max-sm:max-w-none"
	class:text-right={accentSide === 'right'}
	style={accentSide === 'left' ? `border-left: 4px solid ${color}` : `border-right: 4px solid ${color}`}
>
	{@render children()}
</div>
