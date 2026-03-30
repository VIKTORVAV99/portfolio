<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronsDownUp from '@lucide/svelte/icons/chevrons-down-up';
	import TimelineCard from './TimelineCard.svelte';

	let {
		entry,
		color,
		defaultOpen = false,
		accentSide = 'left'
	}: {
		entry: TimelineEntry;
		color: string;
		defaultOpen?: boolean;
		accentSide?: 'left' | 'right';
	} = $props();

	let isOpen = $state(false);
	$effect(() => {
		isOpen = defaultOpen;
	});
	const isRight = $derived(accentSide === 'right');
</script>

<div
	class="w-full rounded-lg bg-surface-800 overflow-hidden"
	style="{isRight ? 'border-right' : 'border-left'}: 4px solid {color}"
>
	<button
		onclick={() => isOpen = !isOpen}
		aria-expanded={isOpen}
		class="flex w-full items-center justify-between px-3 py-2 gap-2 cursor-pointer {isRight
			? 'text-right flex-row-reverse'
			: 'text-left'}"
	>
		<span class="text-lg font-medium truncate">{entry.organization}</span>
		{#if isOpen}
			<ChevronsDownUp size={16} class="shrink-0 text-surface-400" />
		{:else}
			<ChevronsUpDown size={16} class="shrink-0 text-surface-400" />
		{/if}
	</button>
	<div class="px-3 pb-2{isRight ? ' text-right' : ''}" class:hidden={!isOpen}>
		<TimelineCard {entry} {accentSide} />
	</div>
</div>
