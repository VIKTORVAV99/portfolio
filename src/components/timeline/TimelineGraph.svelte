<script lang="ts">
	import {
		TOTAL_YEARS,
		TOTAL_HEIGHT,
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
		yearMarkers
	}: {
		graphData: GraphData;
		yearMarkers: number[];
	} = $props();
</script>

<div class="graph-col" style="grid-row: 1 / {TOTAL_YEARS + 1}; width: {graphData.graphWidth}px;">
	<svg
		width={graphData.graphWidth}
		height={TOTAL_HEIGHT}
		viewBox="0 0 {graphData.graphWidth} {TOTAL_HEIGHT}"
		class="graph-svg"
	>
		<!-- Main branch line -->
		<line
			x1={graphData.laneX(0)}
			y1={nodeY(1)}
			x2={graphData.laneX(0)}
			y2={nodeY(TOTAL_YEARS)}
			class="main-branch-line"
			stroke-width={LINE_WIDTH}
			stroke-linecap="round"
		/>

		<!-- Branch lines -->
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

		<!-- Leader lines -->
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

		<!-- Year markers -->
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
			width: 50px !important;
		}

		.graph-svg {
			width: 50px;
		}
	}
</style>
