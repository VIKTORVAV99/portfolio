<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';

	let { entries }: { entries: TimelineEntry[] } = $props();

	const ORIGIN_YEAR = 1999;
	const CURRENT_YEAR = new Date().getFullYear();
	const PX_PER_YEAR = 100;
	const TOTAL_YEARS = CURRENT_YEAR - ORIGIN_YEAR + 1;
	const TOTAL_HEIGHT = TOTAL_YEARS * PX_PER_YEAR;
	const MIN_SPAN = 2;

	// Graph layout constants
	const LANE_SPACING = 40;
	const NODE_RADIUS = 7;
	const LINE_WIDTH = 2;
	const FORK_CURVE_HEIGHT = 40;

	function yearToRow(year: number): number {
		return TOTAL_YEARS - (year - ORIGIN_YEAR);
	}

	function nodeY(row: number): number {
		return (row - 1) * PX_PER_YEAR + PX_PER_YEAR * 0.5;
	}

	function formatDate(entry: TimelineEntry): string {
		if (!entry.showDates || entry.startYear == null) return '';
		if (entry.endYear === null) return `${entry.startYear} — Present`;
		if (entry.endYear != null && entry.endYear !== entry.startYear)
			return `${entry.startYear} — ${entry.endYear}`;
		return `${entry.startYear}`;
	}

	const yearMarkers = $derived.by(() => {
		const markers: number[] = [];
		const first = Math.ceil(ORIGIN_YEAR / 5) * 5;
		for (let y = first; y <= CURRENT_YEAR; y += 5) {
			markers.push(y);
		}
		return markers;
	});

	const COLOR_WORK = 'var(--color-secondary-500)';
	const COLOR_EDU = 'var(--color-success-500)';
	const COLOR_LIFE = 'var(--color-tertiary-400)';

	function typeColor(type: TimelineEntry['type']): string {
		if (type === 'work') return COLOR_WORK;
		if (type === 'education') return COLOR_EDU;
		return COLOR_LIFE;
	}

	/** A branch groups one or more entries that share the same group key (or a single ungrouped entry). */
	interface Branch {
		id: string;
		type: TimelineEntry['type'];
		side: 'left' | 'right';
		lane: number; // lane offset from center: negative = left, positive = right
		entries: TimelineEntry[];
		/** Row where branch forks from main (bottom of branch, highest row number) */
		forkRow: number;
		/** Row where branch merges back or ends (top of branch, lowest row number). For ongoing: row 1. */
		endRow: number;
		color: string;
	}

	interface CommitNode {
		lane: number;
		row: number;
		rowEnd: number;
		color: string;
		entry: TimelineEntry;
		side: 'left' | 'right';
	}

	interface ForkPath {
		fromX: number;
		toX: number;
		y: number;
		color: string;
		direction: 'down' | 'up'; // down = fork from main, up = merge back to main
	}

	const graphData = $derived.by(() => {
		// Step 1: Group entries into branches
		const groupMap = new Map<string, TimelineEntry[]>();
		let ungroupedIdx = 0;

		for (const entry of entries) {
			if (entry.type === 'life') continue; // life events go on main, not their own branch
			const key = entry.group ?? `__ungrouped_${ungroupedIdx++}`;
			if (!groupMap.has(key)) groupMap.set(key, []);
			groupMap.get(key)!.push(entry);
		}

		// Step 2: Sort each group's entries by startYear ascending (oldest first = bottom of branch)
		for (const [, groupEntries] of groupMap) {
			groupEntries.sort((a, b) => (a.startYear ?? ORIGIN_YEAR) - (b.startYear ?? ORIGIN_YEAR));
		}

		// Step 3: Assign branches to lanes — education goes left, work goes right
		const branches: Branch[] = [];
		let nextLeftLane = -1;
		let nextRightLane = 1;

		// Sort groups by earliest startYear so branches are assigned in chronological order
		const sortedGroups = [...groupMap.entries()].sort((a, b) => {
			const aStart = Math.min(...a[1].map((e) => e.startYear ?? ORIGIN_YEAR));
			const bStart = Math.min(...b[1].map((e) => e.startYear ?? ORIGIN_YEAR));
			return aStart - bStart;
		});

		for (const [id, groupEntries] of sortedGroups) {
			const type = groupEntries[0].type;
			const side: 'left' | 'right' = type === 'education' ? 'left' : 'right';
			const lane = side === 'left' ? nextLeftLane-- : nextRightLane++;

			const earliestStart = Math.min(...groupEntries.map((e) => e.startYear ?? ORIGIN_YEAR));
			const latestEnd = groupEntries.some((e) => e.endYear === null)
				? CURRENT_YEAR
				: Math.max(...groupEntries.map((e) => e.endYear ?? e.startYear ?? ORIGIN_YEAR));

			const forkRow = yearToRow(earliestStart) + 1;
			const endRow = yearToRow(latestEnd);

			branches.push({
				id,
				type,
				side,
				lane,
				entries: groupEntries,
				forkRow,
				endRow,
				color: typeColor(type)
			});
		}

		// Step 4: Compute lane X positions dynamically
		const leftLaneCount = Math.abs(Math.min(0, ...branches.map((b) => b.lane)));
		const rightLaneCount = Math.max(0, ...branches.map((b) => b.lane));
		const totalLanes = leftLaneCount + 1 + rightLaneCount; // +1 for main
		const graphWidth = totalLanes * LANE_SPACING + LANE_SPACING;

		function laneX(lane: number): number {
			// Center lane (0) is at the middle
			return (leftLaneCount + lane) * LANE_SPACING + LANE_SPACING / 2 + LANE_SPACING / 2;
		}

		// Step 5: Build commit nodes
		const nodes: CommitNode[] = [];

		// Life events on main branch (lane 0)
		for (const entry of entries) {
			if (entry.type === 'life') {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const row = yearToRow(start);
				let rowEnd = row + MIN_SPAN;
				nodes.push({ lane: 0, row, rowEnd, color: COLOR_LIFE, entry, side: 'right' });
			}
		}

		// Branch entries
		for (const branch of branches) {
			for (const entry of branch.entries) {
				const start = entry.startYear ?? ORIGIN_YEAR;
				const end = entry.endYear === null ? CURRENT_YEAR : (entry.endYear ?? start);
				const row = yearToRow(end);
				let rowEnd = yearToRow(start) + 1;
				if (rowEnd - row < MIN_SPAN) rowEnd = row + MIN_SPAN;
				nodes.push({
					lane: branch.lane,
					row,
					rowEnd,
					color: branch.color,
					entry,
					side: branch.side
				});
			}
		}

		// Step 6: Build fork/merge curves
		const forks: ForkPath[] = [];
		for (const branch of branches) {
			// Fork: curve from main at forkRow upward to the bottom of the branch
			forks.push({
				fromX: laneX(0),
				toX: laneX(branch.lane),
				y: nodeY(branch.forkRow),
				color: branch.color,
				direction: 'down'
			});

			// Merge: curve from the top of the branch back down to main at endRow
			const isOngoing = branch.entries.some((e) => e.endYear === null);
			if (!isOngoing) {
				forks.push({
					fromX: laneX(branch.lane),
					toX: laneX(0),
					y: nodeY(branch.endRow),
					color: branch.color,
					direction: 'up'
				});
			}
		}

		return { branches, nodes, forks, graphWidth, laneX };
	});

	function forkCurvePath(fork: ForkPath): string {
		const { fromX, toX, y, direction } = fork;
		if (direction === 'down') {
			// Fork: from main (below branch bottom) curving upward+outward to branch bottom
			const y1 = y + FORK_CURVE_HEIGHT; // main contact (below)
			const y2 = y; // branch contact (at branch bottom)
			return `M ${fromX} ${y1} C ${fromX} ${y1 - FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2 + FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2}`;
		} else {
			// Merge: from branch top curving upward+inward to main (above branch top)
			const y1 = y; // branch contact (at branch top)
			const y2 = y - FORK_CURVE_HEIGHT; // main contact (above)
			return `M ${fromX} ${y1} C ${fromX} ${y1 - FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2 + FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2}`;
		}
	}
</script>

<div class="timeline-wrapper">
	<div class="timeline-grid" style="grid-template-rows: repeat({TOTAL_YEARS}, {PX_PER_YEAR}px);">
		<!-- Left cards column -->
		{#each graphData.nodes as node}
			{#if node.side === 'left'}
				<div class="card-slot card-left" style="grid-row: {node.row} / {node.rowEnd};">
					<div class="event-card card-{node.entry.type} sticky-card">
						{#if node.entry.showDates}
							<span class="date-label">{formatDate(node.entry)}</span>
						{/if}
						<h3 class="card-title">{node.entry.title}</h3>
						<p class="card-org">{node.entry.organization}</p>
						{#if node.entry.description}
							<p class="card-desc">{node.entry.description}</p>
						{/if}
					</div>
				</div>
			{/if}
		{/each}

		<!-- SVG Graph column -->
		<div class="graph-col" style="grid-row: 1 / {TOTAL_YEARS + 1}; width: {graphData.graphWidth}px;">
			<svg
				width={graphData.graphWidth}
				height={TOTAL_HEIGHT}
				viewBox="0 0 {graphData.graphWidth} {TOTAL_HEIGHT}"
				class="graph-svg"
			>
				<!-- Main branch line (always full height) -->
				<line
					x1={graphData.laneX(0)}
					y1={nodeY(1)}
					x2={graphData.laneX(0)}
					y2={nodeY(TOTAL_YEARS)}
					class="main-branch-line"
					stroke-width={LINE_WIDTH}
					stroke-linecap="round"
				/>

				<!-- Branch lines (vertical segments, full span) -->
				{#each graphData.branches as branch}
					{@const bx = graphData.laneX(branch.lane)}
					<line
						x1={bx}
						y1={nodeY(branch.endRow)}
						x2={bx}
						y2={nodeY(branch.forkRow)}
						stroke={branch.color}
						stroke-width={LINE_WIDTH}
						stroke-linecap="round"
					/>
				{/each}

				<!-- Fork/merge curves -->
				{#each graphData.forks as fork}
					<path
						d={forkCurvePath(fork)}
						fill="none"
						stroke={fork.color}
						stroke-width={LINE_WIDTH}
						stroke-linecap="round"
					/>
				{/each}

				<!-- Leader lines (horizontal dashed lines from node to card edge) -->
				{#each graphData.nodes as node}
					{@const nx = graphData.laneX(node.lane)}
					{@const ny = nodeY(node.row)}
					{@const targetX = node.side === 'left' ? 0 : graphData.graphWidth}
					<line
						x1={nx + (node.side === 'left' ? -NODE_RADIUS - 2 : NODE_RADIUS + 2)}
						y1={ny}
						x2={targetX}
						y2={ny}
						stroke={node.color}
						stroke-width={1}
						stroke-dasharray="4 3"
						opacity="0.35"
					/>
				{/each}

				<!-- Year markers on main branch -->
				{#each yearMarkers as year}
					{@const mx = graphData.laneX(0)}
					{@const my = nodeY(yearToRow(year))}
					<rect x={mx - 16} y={my - 8} width="32" height="16" rx="3" class="year-marker-bg" />
					<text x={mx} y={my + 4} text-anchor="middle" class="year-marker-text">{year}</text>
				{/each}

				<!-- Commit nodes -->
				{#each graphData.nodes as node}
					{@const ny = nodeY(node.row)}
					<circle
						cx={graphData.laneX(node.lane)}
						cy={ny}
						r={NODE_RADIUS}
						fill={node.color}
						class="commit-node"
					/>
				{/each}
			</svg>
		</div>

		<!-- Right cards column -->
		{#each graphData.nodes as node}
			{#if node.side === 'right'}
				<div class="card-slot card-right" style="grid-row: {node.row} / {node.rowEnd};">
					{#if node.entry.type === 'life' && !node.entry.showDates}
						<div class="life-chip sticky-card">
							<span class="font-bold">{node.entry.title}</span>
						</div>
					{:else}
						<div class="event-card card-{node.entry.type} sticky-card">
							{#if node.entry.showDates}
								<span class="date-label">{formatDate(node.entry)}</span>
							{/if}
							<h3 class="card-title">{node.entry.title}</h3>
							<p class="card-org">{node.entry.organization}</p>
							{#if node.entry.description}
								<p class="card-desc">{node.entry.description}</p>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>

<!-- Legend -->
<div class="legend">
	<span class="legend-item">
		<svg width="24" height="12" viewBox="0 0 24 12" class="legend-icon">
			<line x1="0" y1="6" x2="16" y2="6" stroke={COLOR_WORK} stroke-width="2" />
			<circle cx="20" cy="6" r="4" fill={COLOR_WORK} />
		</svg>
		Work
	</span>
	<span class="legend-item">
		<svg width="24" height="12" viewBox="0 0 24 12" class="legend-icon">
			<line x1="0" y1="6" x2="16" y2="6" stroke={COLOR_EDU} stroke-width="2" />
			<circle cx="20" cy="6" r="4" fill={COLOR_EDU} />
		</svg>
		Education
	</span>
	<span class="legend-item">
		<svg width="24" height="12" viewBox="0 0 24 12" class="legend-icon">
			<circle cx="6" cy="6" r="4" fill={COLOR_LIFE} />
		</svg>
		Life
	</span>
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

	/* Graph column */
	.graph-col {
		grid-column: 2;
		position: relative;
	}

	.graph-svg {
		display: block;
	}

	/* Main branch line */
	.main-branch-line {
		stroke: var(--color-surface-300);
	}

	:global(html.dark) .main-branch-line {
		stroke: var(--color-surface-600);
	}

	/* Year markers in SVG */
	.year-marker-bg {
		fill: var(--color-surface-50);
	}

	:global(html.dark) .year-marker-bg {
		fill: var(--color-surface-950);
	}

	.year-marker-text {
		font-size: 0.5625rem;
		font-weight: 600;
		fill: var(--color-surface-400);
		letter-spacing: 0.05em;
	}

	:global(html.dark) .year-marker-text {
		fill: var(--color-surface-500);
	}

	/* Commit nodes */
	.commit-node {
		stroke: var(--color-surface-50);
		stroke-width: 3;
	}

	:global(html.dark) .commit-node {
		stroke: var(--color-surface-950);
	}

	/* Card slots */
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

	/* Sticky card behavior */
	.sticky-card {
		position: sticky;
		top: 6rem;
		align-self: start;
	}

	/* Card */
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

	.card-work {
		border-left-color: var(--color-secondary-500);
	}
	.card-education {
		border-left-color: var(--color-success-500);
	}
	.card-life {
		border-left-color: var(--color-tertiary-500);
	}

	/* For left-side cards, use right border instead */
	.card-left .event-card {
		border-left: none;
		border-right: 4px solid transparent;
		text-align: right;
	}

	.card-left .card-education {
		border-right-color: var(--color-success-500);
	}

	.card-left .card-work {
		border-right-color: var(--color-secondary-500);
	}

	.card-left .card-life {
		border-right-color: var(--color-tertiary-500);
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

	.card-title {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
	}

	.card-org {
		font-size: 0.875rem;
		color: var(--color-surface-500);
	}

	:global(html.dark) .card-org {
		color: var(--color-surface-400);
	}

	.card-desc {
		font-size: 0.875rem;
		margin-top: 0.5rem;
		color: var(--color-surface-400);
		line-height: 1.5;
	}

	:global(html.dark) .card-desc {
		color: var(--color-surface-500);
	}

	/* Life event chip */
	.life-chip {
		display: inline-flex;
		padding: 0.375rem 1.25rem;
		border-radius: 9999px;
		border: 1px solid var(--color-surface-200);
		background: var(--color-surface-100);
		font-size: 0.875rem;
	}

	:global(html.dark) .life-chip {
		border-color: var(--color-surface-700);
		background: var(--color-surface-800);
	}

	/* Legend */
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1.5rem;
		margin-bottom: 2rem;
		font-size: 0.875rem;
		color: var(--color-surface-600);
	}

	:global(html.dark) .legend {
		color: var(--color-surface-300);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-icon {
		display: inline-block;
		vertical-align: middle;
	}

	/* Mobile: collapse to single side */
	@media (max-width: 639px) {
		.timeline-grid {
			grid-template-columns: 50px 1fr;
		}

		.graph-col {
			grid-column: 1;
			width: 50px !important;
		}

		.graph-svg {
			width: 50px;
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

		.card-left .card-education {
			border-left-color: var(--color-success-500);
			border-right-color: transparent;
		}

		.card-left .card-work {
			border-left-color: var(--color-secondary-500);
			border-right-color: transparent;
		}

		.event-card {
			max-width: none;
		}
	}
</style>
