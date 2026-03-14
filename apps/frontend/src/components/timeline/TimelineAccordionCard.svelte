<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import { Accordion } from 'bits-ui';
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

	const isRight = $derived(accentSide === 'right');
</script>

<Accordion.Root type="single" value={defaultOpen ? 'entry' : ''}>
	<Accordion.Item
		value="entry"
		class="w-full rounded-lg bg-surface-100 dark:bg-surface-800 overflow-hidden"
		style="{isRight ? 'border-right' : 'border-left'}: 4px solid {color}"
	>
		<Accordion.Header>
			<Accordion.Trigger
				class="flex w-full items-center justify-between px-3 py-2 gap-2 {isRight
					? 'text-right flex-row-reverse'
					: 'text-left'}"
			>
				<span class="text-sm font-medium truncate">{entry.organization}</span>
				<svg
					class="w-4 h-4 shrink-0 text-surface-400 transition-transform duration-200 [[data-state=open]>&]:rotate-180"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content forceMount class="accordion-slide{isRight ? ' text-right' : ''}">
			<div class="overflow-hidden">
				<div class="px-3 pb-2">
					<TimelineCard {entry} />
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
