<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import { Accordion } from 'bits-ui';
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

	let value = $state('');
	$effect(() => {
		value = defaultOpen ? 'entry' : '';
	});
	const isOpen = $derived(value === 'entry');
	const isRight = $derived(accentSide === 'right');
</script>

<Accordion.Root type="single" bind:value>
	<Accordion.Item
		value="entry"
		class="w-full rounded-lg bg-surface-800 overflow-hidden"
		style="{isRight ? 'border-right' : 'border-left'}: 4px solid {color}"
	>
		<Accordion.Header>
			<Accordion.Trigger
				class="flex w-full items-center justify-between px-3 py-2 gap-2 {isRight
					? 'text-right flex-row-reverse'
					: 'text-left'}"
			>
				<span class="text-lg font-medium truncate">{entry.organization}</span>
				{#if isOpen}
					<ChevronsDownUp size={16} class="shrink-0 text-surface-400" />
				{:else}
					<ChevronsUpDown size={16} class="shrink-0 text-surface-400" />
				{/if}
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content class="px-3 pb-2{isRight ? ' text-right' : ''}">
			<TimelineCard {entry} {accentSide} />
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
