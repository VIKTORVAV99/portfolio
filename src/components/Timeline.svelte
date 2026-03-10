<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import TimelineCard from './timeline/TimelineCard.svelte';
	import TimelineGraph from './timeline/TimelineGraph.svelte';
	import TimelineEventCard from './timeline/TimelineEventCard.svelte';
	import TimelineGroupCard from './timeline/TimelineGroupCard.svelte';
	import { ORIGIN_YEAR, CURRENT_YEAR, PX_PER_MONTH, PX_PER_MONTH_MOBILE } from './timeline/constants';
	import { buildGraphData } from './timeline/buildGraphData';

	let { entries }: { entries: TimelineEntry[] } = $props();

	let compact = $state(false);

	$effect(() => {
		const mql = window.matchMedia('(max-width: 639px)');
		compact = mql.matches;
		const handler = (e: MediaQueryListEvent) => {
			compact = e.matches;
		};
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	const pxPerMonth = $derived(compact ? PX_PER_MONTH_MOBILE : PX_PER_MONTH);

	const yearMarkers = $derived.by(() => {
		const markers: number[] = [];
		const first = Math.ceil(ORIGIN_YEAR / 5) * 5;
		for (let y = first; y <= CURRENT_YEAR; y += 5) {
			markers.push(y);
		}
		return markers;
	});

	const graphData = $derived.by(() => buildGraphData(entries, compact, pxPerMonth));

	// Track which collapsible groups are open
	let openState = $state<Record<number, boolean>>({});

	// Rows each expanded entry needs (summary header ~2 rows + each entry ~3 rows)
	const SUMMARY_ROWS = 2;
	const ROWS_PER_EXPANDED_ENTRY = 3;

	// Recalculate grid positions — only push cards when expansion causes real overlap
	const adjustedLayout = $derived.by(() => {
		const groups = graphData.branchGroups;
		if (!compact || groups.length === 0) {
			return {
				positions: groups.map((g) => ({ gridRow: g.gridRow, gridRowEnd: g.gridRowEnd })),
				totalGridRows: graphData.totalGridRows
			};
		}

		const positions: Array<{ gridRow: number; gridRowEnd: number }> = [];
		let pushed = 0;

		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			const startRow = group.gridRow + pushed;
			let span = group.gridRowEnd - group.gridRow;

			if ((openState[i] ?? false) && group.nodes.length > 1) {
				span = SUMMARY_ROWS + group.nodes.length * ROWS_PER_EXPANDED_ENTRY;
			}

			const endRow = startRow + span;
			positions.push({ gridRow: startRow, gridRowEnd: endRow });

			const nextOrigStart = i + 1 < groups.length ? groups[i + 1].gridRow : Infinity;
			if (endRow > nextOrigStart + pushed) {
				pushed += endRow - (nextOrigStart + pushed);
			}
		}

		const lastEnd = positions.length > 0 ? positions[positions.length - 1].gridRowEnd : 0;
		return { positions, totalGridRows: Math.max(graphData.totalGridRows, lastEnd) };
	});

	const totalHeight = $derived(graphData.totalGridRows * pxPerMonth);
</script>

<div class="w-full max-w-5xl mx-auto px-4">
	<div
		class="grid grid-cols-[1fr_auto_1fr] max-sm:grid-cols-[auto_1fr] w-full"
		style="grid-template-rows: repeat({adjustedLayout.totalGridRows}, {pxPerMonth}px);"
	>
		{#if compact}
			<!-- Graph -->
			<TimelineGraph
				{graphData}
				{yearMarkers}
				{compact}
				pxPerMonth={pxPerMonth}
				{totalHeight}
				gridRowEnd={adjustedLayout.totalGridRows + 1}
			/>

			<!-- Compact: individually grid-positioned cards -->
			{#each graphData.branchGroups as group, i}
				{#if !(group.nodes.length === 1 && group.nodes[0].entry.type === 'life' && !group.nodes[0].entry.showDates)}
					<div
						class="col-start-2 flex justify-start pl-2"
						style="grid-row: {adjustedLayout.positions[i].gridRow} / {adjustedLayout.positions[i].gridRowEnd};"
					>
						{#if group.nodes.length === 1}
							<TimelineEventCard color={group.color}>
								<TimelineCard entry={group.nodes[0].entry} />
							</TimelineEventCard>
						{:else}
							<TimelineGroupCard
								{group}
								open={openState[i] ?? false}
								onOpenChange={(v) => {
									openState[i] = v;
								}}
							/>
						{/if}
					</div>
				{/if}
			{/each}
		{:else}
			<!-- Left cards -->
			{#each graphData.nodes as node}
				{#if node.side === 'left'}
					<div
						class="col-start-1 max-sm:col-start-2 flex justify-end max-sm:justify-start pr-2 max-sm:pr-0 max-sm:pl-2"
						style="grid-row: {node.gridRow} / {node.gridRowEnd};"
					>
						<div class="sticky top-24 self-start max-sm:static">
							<TimelineEventCard color={node.color} accentSide="right">
								<TimelineCard entry={node.entry} />
							</TimelineEventCard>
						</div>
					</div>
				{/if}
			{/each}

			<!-- Graph -->
			<TimelineGraph {graphData} {yearMarkers} {compact} pxPerMonth={pxPerMonth} {totalHeight} />

			<!-- Right cards -->
			{#each graphData.nodes as node}
				{#if node.side === 'right'}
					{#if !(node.entry.type === 'life' && !node.entry.showDates)}
						<div
							class="col-start-3 max-sm:col-start-2 flex justify-start pl-2"
							style="grid-row: {node.gridRow} / {node.gridRowEnd};"
						>
							<div class="sticky top-24 self-start max-sm:static">
								<TimelineEventCard color={node.color}>
									<TimelineCard entry={node.entry} />
								</TimelineEventCard>
							</div>
						</div>
					{/if}
				{/if}
			{/each}
		{/if}
	</div>
</div>
