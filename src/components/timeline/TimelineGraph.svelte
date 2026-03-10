<script lang="ts">
	import {
		LINE_WIDTH,
		NODE_RADIUS
	} from './constants';
	import {
		type GraphData,
		nodeY,
		yearToRow,
		forkCurvePath
	} from './types';

	let {
		graphData,
		yearMarkers,
		compact,
		pxPerYear,
		totalHeight,
		gridRowEnd
	}: {
		graphData: GraphData;
		yearMarkers: number[];
		compact: boolean;
		pxPerYear: number;
		totalHeight: number;
		gridRowEnd?: number;
	} = $props();
</script>

<div class="graph-col" style="grid-row: 1 / {gridRowEnd ?? (graphData.totalGridRows + 1)}; width: {graphData.graphWidth}px;">
	<svg
		width={graphData.graphWidth}
		height={totalHeight}
		viewBox="0 0 {graphData.graphWidth} {totalHeight}"
		class="graph-svg"
	>
		<!-- Main branch line -->
		<line
			x1={graphData.laneX(0)}
			y1={nodeY(1, pxPerYear)}
			x2={graphData.laneX(0)}
			y2={nodeY(graphData.totalGridRows, pxPerYear)}
			class="main-branch-line"
			stroke-width={LINE_WIDTH}
			stroke-linecap="round"
		/>

		<!-- Branch lines -->
		{#each graphData.branches as branch}
			{@const bx = graphData.laneX(branch.lane)}
			<line
				x1={bx}
				y1={nodeY(branch.endRow, pxPerYear)}
				x2={bx}
				y2={nodeY(branch.forkRow, pxPerYear)}
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

		{#if !compact}
			<!-- Leader lines -->
			{#each graphData.nodes as node}
				{@const nx = graphData.laneX(node.lane)}
				{@const ny = nodeY(node.row, pxPerYear)}
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
		{/if}

		<!-- Year markers -->
		{#each yearMarkers as year}
			{@const mx = graphData.laneX(0)}
			{@const my = nodeY(yearToRow(year), pxPerYear)}
			<rect x={mx - 16} y={my - 8} width="32" height="16" rx="3" class="year-marker-bg" />
			<text x={mx} y={my + 4} text-anchor="middle" class="year-marker-text">{year}</text>
		{/each}

		<!-- Commit nodes -->
		{#each graphData.nodes as node}
			{@const ny = nodeY(node.gridRow, pxPerYear)}
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

<style>
	.graph-col {
		grid-column: 2;
		position: relative;
	}

	.graph-svg {
		display: block;
	}

	.main-branch-line {
		stroke: var(--color-surface-300);
	}

	:global(html.dark) .main-branch-line {
		stroke: var(--color-surface-600);
	}

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

	.commit-node {
		stroke: var(--color-surface-50);
		stroke-width: 3;
	}

	:global(html.dark) .commit-node {
		stroke: var(--color-surface-950);
	}

	@media (max-width: 639px) {
		.graph-col {
			grid-column: 1;
		}
	}
</style>
