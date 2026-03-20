<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import type { TimelineMode } from './timeline/types';
	import TimelineGraph from './timeline/TimelineGraph.svelte';
	import TimelineAccordionCard from './timeline/TimelineAccordionCard.svelte';
	import {
		ORIGIN_YEAR,
		CURRENT_YEAR,
		PX_PER_MONTH,
		GRAPH_TOP_PADDING_PX
	} from './timeline/constants';
	import { buildGraphData } from './timeline/buildGraphData';

	let { entries }: { entries: TimelineEntry[] } = $props();

	let mode = $state<TimelineMode>('desktop');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mql = window.matchMedia('(max-width: 640px)');
		const update = () => {
			mode = mql.matches ? 'compact' : 'desktop';
		};
		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	});

	let measuredHeightsByEntry = $state(new Map<TimelineEntry, number>());

	function setMeasuredHeight(entry: TimelineEntry, height: number) {
		if (measuredHeightsByEntry.get(entry) === height) return;
		const next = new Map(measuredHeightsByEntry);
		next.set(entry, height);
		measuredHeightsByEntry = next;
	}

	function observeCardHeight(element: HTMLElement, entry: TimelineEntry) {
		if (typeof ResizeObserver === 'undefined') return;

		let currentEntry = entry;
		const measure = () => {
			setMeasuredHeight(currentEntry, element.offsetHeight);
		};

		const observer = new ResizeObserver(measure);
		observer.observe(element);
		measure();

		return {
			update(nextEntry: TimelineEntry) {
				currentEntry = nextEntry;
				measure();
			},
			destroy() {
				observer.disconnect();
			}
		};
	}

	const yearMarkers = $derived.by(() => {
		const markers: number[] = [];
		const first = Math.ceil(ORIGIN_YEAR / 5) * 5;
		for (let y = first; y <= CURRENT_YEAR; y += 5) {
			markers.push(y);
		}
		return markers;
	});

	const graphData = $derived.by(() =>
		buildGraphData(entries, PX_PER_MONTH, measuredHeightsByEntry, mode)
	);

	const totalHeight = $derived(graphData.totalGridRows * PX_PER_MONTH + GRAPH_TOP_PADDING_PX);

	const isCompact = $derived(mode === 'compact');
</script>

<div class="w-full max-w-5xl mx-auto">
	<div
		class="grid w-full {isCompact ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto_1fr]'}"
		style="grid-template-rows: repeat({graphData.totalGridRows}, {PX_PER_MONTH}px);"
	>
		<!-- Left cards (desktop only) -->
		{#if !isCompact}
			{#each graphData.nodes as node}
				{#if node.side === 'left'}
					<div
						class="col-start-1 flex justify-end self-start"
						style="grid-row: {node.gridRow} / {node.gridRowEnd};"
						use:observeCardHeight={node.entry}
					>
						<TimelineAccordionCard entry={node.entry} color={node.color} accentSide="right" defaultOpen={true} />
					</div>
				{/if}
			{/each}
		{/if}

		<!-- Graph -->
		<TimelineGraph {graphData} {yearMarkers} pxPerMonth={PX_PER_MONTH} {totalHeight} />

		<!-- Right cards -->
		{#each graphData.nodes as node}
			{#if node.side === 'right'}
				{#if !(node.entry.type === 'life' && !node.entry.showDates)}
					<div
						class="{isCompact ? 'col-start-2' : 'col-start-3'} flex justify-start self-start"
						style="grid-row: {node.gridRow} / {node.gridRowEnd};"
						use:observeCardHeight={node.entry}
					>
						<TimelineAccordionCard entry={node.entry} color={node.color} defaultOpen={!isCompact} />
					</div>
				{/if}
			{/if}
		{/each}
	</div>
</div>
