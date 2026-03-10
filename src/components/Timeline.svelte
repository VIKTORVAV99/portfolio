<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import { Collapsible } from 'bits-ui';
	import TimelineCard from './timeline/TimelineCard.svelte';
	import TimelineGraph from './timeline/TimelineGraph.svelte';
	import TimelineLifeChip from './timeline/TimelineLifeChip.svelte';
	import {
		ORIGIN_YEAR,
		CURRENT_YEAR,
		PX_PER_YEAR,
		PX_PER_YEAR_MOBILE,
		TOTAL_YEARS,
		MIN_SPAN,
		COMPACT_CARD_SPAN,
		LANE_SPACING,
		LANE_SPACING_MOBILE,
		COLOR_LIFE,
		BRANCH_COLORS
	} from './timeline/constants';
	import {
		yearToRow,
		nodeY,
		type Branch,
		type GraphData,
		type BranchGroup
	} from './timeline/types';

	let { entries }: { entries: TimelineEntry[] } = $props();

	let compact = $state(false);

	$effect(() => {
		const mql = window.matchMedia('(max-width: 639px)');
		compact = mql.matches;
		const handler = (e: MediaQueryListEvent) => { compact = e.matches; };
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	const pxPerYear = $derived(compact ? PX_PER_YEAR_MOBILE : PX_PER_YEAR);

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
			const side: 'left' | 'right' = compact ? 'left' : (type === 'education' ? 'left' : 'right');
			const lane = compact ? nextLeftLane-- : (side === 'left' ? nextLeftLane-- : nextRightLane++);

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
		const spacing = compact ? LANE_SPACING_MOBILE : LANE_SPACING;
		const leftLaneCount = Math.abs(Math.min(0, ...branches.map((b) => b.lane)));
		const rightLaneCount = Math.max(0, ...branches.map((b) => b.lane));
		const totalLanes = leftLaneCount + 1 + rightLaneCount;
		const graphWidth = totalLanes * spacing + spacing;

		function laneX(lane: number): number {
			return (leftLaneCount + lane) * spacing + spacing / 2 + spacing / 2;
		}

		// Step 5: Build commit nodes
		const nodes = [];

		for (const entry of entries) {
			if (entry.type === 'life') {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const row = yearToRow(start);
				const rowEnd = row + MIN_SPAN;
				nodes.push({ lane: 0, row, rowEnd, gridRow: row, gridRowEnd: rowEnd, color: COLOR_LIFE, entry, side: 'right' as const });
			}
		}

		for (const branch of branches) {
			for (const entry of branch.entries) {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const end = entry.endYear === null ? CURRENT_YEAR : (entry.endYear ?? start);
				const row = yearToRow(end);
				let rowEnd = yearToRow(start) + 1;
				if (rowEnd - row < MIN_SPAN) rowEnd = row + MIN_SPAN;
				nodes.push({ lane: branch.lane, row, rowEnd, gridRow: row, gridRowEnd: rowEnd, color: branch.color, entry, side: branch.side });
			}
		}

		// Resolve card overlap in compact mode & build branch groups
		let totalGridRows = TOTAL_YEARS;
		const branchGroups: BranchGroup[] = [];
		if (compact) {
			// Build groups by lane (all nodes on the same lane → one group)
			const laneMap = new Map<number, typeof nodes>();
			for (const node of nodes) {
				if (!laneMap.has(node.lane)) laneMap.set(node.lane, []);
				laneMap.get(node.lane)!.push(node);
			}
			// Sort nodes within each lane by gridRow
			for (const laneNodes of laneMap.values()) {
				laneNodes.sort((a, b) => a.gridRow - b.gridRow);
			}

			// Sort groups by earliest gridRow of their first node
			const groups = [...laneMap.entries()]
				.map(([lane, laneNodes]) => ({
					lane,
					nodes: laneNodes,
					color: laneNodes[0].color,
					side: laneNodes[0].side
				}))
				.sort((a, b) => a.nodes[0].gridRow - b.nodes[0].gridRow);

			// Each group occupies COMPACT_CARD_SPAN rows to fit card content
			// Push groups down to avoid overlap
			let nextRow = Math.min(...groups.map(g => g.nodes[0].gridRow));
			for (const group of groups) {
				const startRow = Math.max(group.nodes[0].gridRow, nextRow);
				const endRow = startRow + COMPACT_CARD_SPAN;
				// Set all nodes in the group to this position (SVG uses first node's gridRow)
				for (const n of group.nodes) {
					n.gridRow = startRow;
					n.gridRowEnd = endRow;
				}
				branchGroups.push({
					nodes: group.nodes,
					gridRow: startRow,
					gridRowEnd: endRow,
					color: group.color,
					side: group.side
				});
				nextRow = endRow;
			}

			totalGridRows = Math.max(TOTAL_YEARS, nextRow);

			// Update branch extents to match shifted node positions
			for (const branch of branches) {
				const branchNodes = nodes.filter(n => n.lane === branch.lane);
				if (branchNodes.length > 0) {
					branch.endRow = Math.min(...branchNodes.map(n => n.gridRow));
					branch.forkRow = Math.max(...branchNodes.map(n => n.gridRowEnd));
				}
			}
		}

		// Step 6: Build fork/merge curves
		const forks = [];
		for (const branch of branches) {
			forks.push({
				fromX: laneX(0),
				toX: laneX(branch.lane),
				y: nodeY(branch.forkRow, pxPerYear),
				color: branch.color,
				direction: 'down' as const
			});

			const isOngoing = branch.entries.some((e) => e.endYear === null);
			if (!isOngoing) {
				forks.push({
					fromX: laneX(branch.lane),
					toX: laneX(0),
					y: nodeY(branch.endRow, pxPerYear),
					color: branch.color,
					direction: 'up' as const
				});
			}
		}

		return { branches, nodes, forks, graphWidth, laneX, totalGridRows, branchGroups };
	});

	// Track which collapsible groups are open
	let openState = $state<Record<number, boolean>>({});

	// Rows each expanded entry needs (summary header ~2 rows + each entry ~3 rows)
	const SUMMARY_ROWS = 2;
	const ROWS_PER_EXPANDED_ENTRY = 3;

	// Recalculate grid positions — only push cards when expansion causes real overlap
	const adjustedLayout = $derived.by(() => {
		const groups = graphData.branchGroups;
		if (!compact || groups.length === 0) {
			return { positions: groups.map(g => ({ gridRow: g.gridRow, gridRowEnd: g.gridRowEnd })), totalGridRows: graphData.totalGridRows };
		}

		const positions: Array<{ gridRow: number; gridRowEnd: number }> = [];
		let pushed = 0; // accumulated rows pushed down from previous expansions

		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			const startRow = group.gridRow + pushed;
			let span = group.gridRowEnd - group.gridRow; // base span

			if ((openState[i] ?? false) && group.nodes.length > 1) {
				span = SUMMARY_ROWS + group.nodes.length * ROWS_PER_EXPANDED_ENTRY;
			}

			const endRow = startRow + span;
			positions.push({ gridRow: startRow, gridRowEnd: endRow });

			// Only push next cards if this card's end would overlap the next card's original start
			const nextOrigStart = (i + 1 < groups.length) ? groups[i + 1].gridRow : Infinity;
			if (endRow > nextOrigStart + pushed) {
				pushed += endRow - (nextOrigStart + pushed);
			}
		}

		const lastEnd = positions.length > 0 ? positions[positions.length - 1].gridRowEnd : 0;
		return { positions, totalGridRows: Math.max(graphData.totalGridRows, lastEnd) };
	});

	const totalHeight = $derived(graphData.totalGridRows * pxPerYear);
</script>

<div class="timeline-wrapper">
	<div class="timeline-grid" style="grid-template-rows: repeat({adjustedLayout.totalGridRows}, {pxPerYear}px);">
		{#if compact}
			<!-- Graph -->
			<TimelineGraph {graphData} {yearMarkers} {compact} {pxPerYear} {totalHeight} gridRowEnd={adjustedLayout.totalGridRows + 1} />

			<!-- Compact: collapsible branch groups -->
			{#each graphData.branchGroups as group, i}
				<div class="card-slot card-right" style="grid-row: {adjustedLayout.positions[i].gridRow} / {adjustedLayout.positions[i].gridRowEnd};">
					{#if group.nodes.length === 1}
						{#if group.nodes[0].entry.type === 'life' && !group.nodes[0].entry.showDates}
							<div class="sticky-card">
								<TimelineLifeChip title={group.nodes[0].entry.title} />
							</div>
						{:else}
							<div class="event-card sticky-card" style="border-left-color: {group.color};">
								<TimelineCard entry={group.nodes[0].entry} />
							</div>
						{/if}
					{:else}
						{@const org = group.nodes[0].entry.organization}
						{@const earliest = Math.min(...group.nodes.map(n => n.entry.startYear ?? 0))}
						{@const hasOngoing = group.nodes.some(n => n.entry.endYear === null)}
						{@const latest = hasOngoing ? null : Math.max(...group.nodes.map(n => n.entry.endYear ?? n.entry.startYear ?? 0))}
						{@const dateStr = hasOngoing ? `${earliest} — Present` : latest !== earliest ? `${earliest} — ${latest}` : `${earliest}`}
						<Collapsible.Root class="collapsible-root sticky-card" open={openState[i] ?? false} onOpenChange={(v) => { openState[i] = v; }}>
							<div class="event-card" style="border-left-color: {group.color};">
								<span class="date-label">{dateStr}</span>
								<h3 class="group-title">{group.nodes.length} positions</h3>
								<p class="group-org">{org}</p>
								<Collapsible.Trigger class="collapsible-trigger">
									Show details
									<span class="trigger-icon" aria-hidden="true">›</span>
								</Collapsible.Trigger>
								<Collapsible.Content>
									{#each group.nodes as node}
										<div class="collapsible-entry">
											<TimelineCard entry={node.entry} />
										</div>
									{/each}
								</Collapsible.Content>
							</div>
						</Collapsible.Root>
					{/if}
				</div>
			{/each}
		{:else}
			<!-- Left cards -->
			{#each graphData.nodes as node}
				{#if node.side === 'left'}
					<div class="card-slot card-left" style="grid-row: {node.gridRow} / {node.gridRowEnd};">
						<div class="event-card sticky-card" style="border-right-color: {node.color};">
							<TimelineCard entry={node.entry} />
						</div>
					</div>
				{/if}
			{/each}

			<!-- Graph -->
			<TimelineGraph {graphData} {yearMarkers} {compact} {pxPerYear} {totalHeight} />

			<!-- Right cards -->
			{#each graphData.nodes as node}
				{#if node.side === 'right'}
					<div class="card-slot card-right" style="grid-row: {node.gridRow} / {node.gridRowEnd};">
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
		{/if}
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
			grid-template-columns: auto 1fr;
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

		.sticky-card {
			position: static;
		}
	}

	:global(.collapsible-root) {
		width: 100%;
	}

	.date-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-surface-400);
		margin-bottom: 0.25rem;
	}

	:global(html.dark) .date-label {
		color: var(--color-surface-500);
	}

	.group-title {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
	}

	.group-org {
		font-size: 0.875rem;
		color: var(--color-surface-500);
	}

	:global(html.dark) .group-org {
		color: var(--color-surface-400);
	}

	:global(.collapsible-trigger) {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.5rem;
		padding: 0.25rem 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-surface-400);
		background: none;
		border: none;
		cursor: pointer;
	}

	:global(html.dark .collapsible-trigger) {
		color: var(--color-surface-500);
	}

	:global(.collapsible-trigger:hover) {
		color: var(--color-surface-600);
	}

	:global(html.dark .collapsible-trigger:hover) {
		color: var(--color-surface-300);
	}

	.trigger-icon {
		display: inline-block;
		transition: transform 0.2s ease;
		font-size: 0.875rem;
	}

	:global([data-state='open'] > .event-card .trigger-icon) {
		transform: rotate(90deg);
	}

	.collapsible-entry {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-surface-200);
	}

	:global(html.dark) .collapsible-entry {
		border-top-color: var(--color-surface-700);
	}
</style>
