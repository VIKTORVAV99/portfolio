<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import TimelineCard from './timeline/TimelineCard.svelte';
	import TimelineGraph from './timeline/TimelineGraph.svelte';
	import TimelineLifeChip from './timeline/TimelineLifeChip.svelte';
	import {
		ORIGIN_YEAR,
		CURRENT_YEAR,
		PX_PER_YEAR,
		TOTAL_YEARS,
		MIN_SPAN,
		LANE_SPACING,
		COLOR_LIFE,
		BRANCH_COLORS
	} from './timeline/constants';
	import {
		yearToRow,
		nodeY,
		type Branch,
		type GraphData
	} from './timeline/types';

	let { entries }: { entries: TimelineEntry[] } = $props();

	const yearMarkers = $derived.by(() => {
		const markers: number[] = [];
		const first = Math.ceil(ORIGIN_YEAR / 5) * 5;
		for (let y = first; y <= CURRENT_YEAR; y += 5) {
			markers.push(y);
		}
		return markers;
	});

	const graphData: GraphData = $derived.by(() => {
		// Step 1: Group entries into branches
		const groupMap = new Map<string, TimelineEntry[]>();
		let ungroupedIdx = 0;

		for (const entry of entries) {
			if (entry.type === 'life') continue;
			const key = entry.group ?? `__ungrouped_${ungroupedIdx++}`;
			if (!groupMap.has(key)) groupMap.set(key, []);
			groupMap.get(key)!.push(entry);
		}

		// Step 2: Sort each group's entries by startYear ascending
		for (const [, groupEntries] of groupMap) {
			groupEntries.sort((a, b) => (a.startYear ?? ORIGIN_YEAR) - (b.startYear ?? ORIGIN_YEAR));
		}

		// Step 3: Assign branches to lanes
		const branches: Branch[] = [];
		let nextLeftLane = -1;
		let nextRightLane = 1;

		const sortedGroups = [...groupMap.entries()].sort((a, b) => {
			const aStart = Math.min(...a[1].map((e) => e.startYear ?? ORIGIN_YEAR));
			const bStart = Math.min(...b[1].map((e) => e.startYear ?? ORIGIN_YEAR));
			return aStart - bStart;
		});

		let branchColorIdx = 0;
		for (const [id, groupEntries] of sortedGroups) {
			const type = groupEntries[0].type;
			const side: 'left' | 'right' = type === 'education' ? 'left' : 'right';
			const lane = side === 'left' ? nextLeftLane-- : nextRightLane++;

			const earliestStart = Math.min(...groupEntries.map((e) => e.startYear ?? ORIGIN_YEAR));
			const latestEnd = groupEntries.some((e) => e.endYear === null)
				? CURRENT_YEAR
				: Math.max(...groupEntries.map((e) => e.endYear ?? e.startYear ?? ORIGIN_YEAR));

			branches.push({
				id,
				type,
				side,
				lane,
				entries: groupEntries,
				forkRow: yearToRow(earliestStart) + 1,
				endRow: yearToRow(latestEnd),
				color: BRANCH_COLORS[branchColorIdx++ % BRANCH_COLORS.length]
			});
		}

		// Step 4: Compute lane X positions
		const leftLaneCount = Math.abs(Math.min(0, ...branches.map((b) => b.lane)));
		const rightLaneCount = Math.max(0, ...branches.map((b) => b.lane));
		const totalLanes = leftLaneCount + 1 + rightLaneCount;
		const graphWidth = totalLanes * LANE_SPACING + LANE_SPACING;

		function laneX(lane: number): number {
			return (leftLaneCount + lane) * LANE_SPACING + LANE_SPACING / 2 + LANE_SPACING / 2;
		}

		// Step 5: Build commit nodes
		const nodes = [];

		for (const entry of entries) {
			if (entry.type === 'life') {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const row = yearToRow(start);
				nodes.push({ lane: 0, row, rowEnd: row + MIN_SPAN, color: COLOR_LIFE, entry, side: 'right' as const });
			}
		}

		for (const branch of branches) {
			for (const entry of branch.entries) {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const end = entry.endYear === null ? CURRENT_YEAR : (entry.endYear ?? start);
				const row = yearToRow(end);
				let rowEnd = yearToRow(start) + 1;
				if (rowEnd - row < MIN_SPAN) rowEnd = row + MIN_SPAN;
				nodes.push({ lane: branch.lane, row, rowEnd, color: branch.color, entry, side: branch.side });
			}
		}

		// Step 6: Build fork/merge curves
		const forks = [];
		for (const branch of branches) {
			forks.push({
				fromX: laneX(0),
				toX: laneX(branch.lane),
				y: nodeY(branch.forkRow),
				color: branch.color,
				direction: 'down' as const
			});

			const isOngoing = branch.entries.some((e) => e.endYear === null);
			if (!isOngoing) {
				forks.push({
					fromX: laneX(branch.lane),
					toX: laneX(0),
					y: nodeY(branch.endRow),
					color: branch.color,
					direction: 'up' as const
				});
			}
		}

		return { branches, nodes, forks, graphWidth, laneX };
	});
</script>

<div class="timeline-wrapper">
	<div class="timeline-grid" style="grid-template-rows: repeat({TOTAL_YEARS}, {PX_PER_YEAR}px);">
		<!-- Left cards -->
		{#each graphData.nodes as node}
			{#if node.side === 'left'}
				<div class="card-slot card-left" style="grid-row: {node.row} / {node.rowEnd};">
					<div class="event-card sticky-card" style="border-right-color: {node.color};">
						<TimelineCard entry={node.entry} />
					</div>
				</div>
			{/if}
		{/each}

		<!-- Graph -->
		<TimelineGraph {graphData} {yearMarkers} />

		<!-- Right cards -->
		{#each graphData.nodes as node}
			{#if node.side === 'right'}
				<div class="card-slot card-right" style="grid-row: {node.row} / {node.rowEnd};">
					{#if node.entry.type === 'life' && !node.entry.showDates}
						<div class="sticky-card">
							<TimelineLifeChip title={node.entry.title} />
						</div>
					{:else}
						<div class="event-card sticky-card" style="border-left-color: {node.color};">
							<TimelineCard entry={node.entry} />
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.timeline-wrapper {
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.timeline-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		width: 100%;
	}

	.card-left {
		grid-column: 1;
		display: flex;
		justify-content: flex-end;
		padding-right: 0.5rem;
	}

	.card-right {
		grid-column: 3;
		display: flex;
		justify-content: flex-start;
		padding-left: 0.5rem;
	}

	.sticky-card {
		position: sticky;
		top: 6rem;
		align-self: start;
	}

	.event-card {
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		background: var(--color-surface-100);
		max-width: 22rem;
		width: 100%;
		border-left: 4px solid transparent;
	}

	:global(html.dark) .event-card {
		background: var(--color-surface-800);
	}

	.card-left .event-card {
		border-left-color: transparent;
		border-right: 4px solid transparent;
		text-align: right;
	}

	@media (max-width: 639px) {
		.timeline-grid {
			grid-template-columns: 50px 1fr;
		}

		.card-left,
		.card-right {
			grid-column: 2;
			justify-content: flex-start;
			padding-left: 0.5rem;
			padding-right: 0;
		}

		.card-left .event-card {
			border-right: none;
			border-left: 4px solid transparent;
			text-align: left;
		}

		.event-card {
			max-width: none;
		}
	}
</style>
