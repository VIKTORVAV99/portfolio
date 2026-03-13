<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import TimelineCard from './timeline/TimelineCard.svelte';
	import TimelineGraph from './timeline/TimelineGraph.svelte';
	import TimelineEventCard from './timeline/TimelineEventCard.svelte';
	import {
		ORIGIN_YEAR,
		CURRENT_YEAR,
		PX_PER_MONTH,
		GRAPH_TOP_PADDING_PX
	} from './timeline/constants';
	import { buildGraphData } from './timeline/buildGraphData';

	let { entries }: { entries: TimelineEntry[] } = $props();

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
		buildGraphData(entries, PX_PER_MONTH, measuredHeightsByEntry)
	);

	const totalHeight = $derived(graphData.totalGridRows * PX_PER_MONTH + GRAPH_TOP_PADDING_PX);
</script>

<div class="w-full max-w-5xl mx-auto px-4">
	<div
		class="grid grid-cols-[1fr_auto_1fr] w-full"
		style="grid-template-rows: repeat({graphData.totalGridRows}, {PX_PER_MONTH}px);"
	>
		<!-- Left cards -->
		{#each graphData.nodes as node}
			{#if node.side === 'left'}
				<div
					class="col-start-1 flex justify-end pr-2 self-start"
					style="grid-row: {node.gridRow} / {node.gridRowEnd};"
					use:observeCardHeight={node.entry}
				>
					<TimelineEventCard color={node.color} accentSide="right">
						<TimelineCard entry={node.entry} />
					</TimelineEventCard>
				</div>
			{/if}
		{/each}

		<!-- Graph -->
		<TimelineGraph {graphData} {yearMarkers} pxPerMonth={PX_PER_MONTH} {totalHeight} />

		<!-- Right cards -->
		{#each graphData.nodes as node}
			{#if node.side === 'right'}
				{#if !(node.entry.type === 'life' && !node.entry.showDates)}
					<div
						class="col-start-3 flex justify-start pl-2 self-start"
						style="grid-row: {node.gridRow} / {node.gridRowEnd};"
						use:observeCardHeight={node.entry}
					>
						<TimelineEventCard color={node.color}>
							<TimelineCard entry={node.entry} />
						</TimelineEventCard>
					</div>
				{/if}
			{/if}
		{/each}
	</div>
</div>
