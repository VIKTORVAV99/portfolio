<script lang="ts">
	import { LINE_WIDTH, NODE_RADIUS } from './constants';
	import { type GraphData, nodeY, monthToRow, toAbsoluteMonth, forkCurvePath } from './types';

	let {
		graphData,
		yearMarkers,
		compact,
		pxPerMonth,
		totalHeight,
		gridRowEnd
	}: {
		graphData: GraphData;
		yearMarkers: number[];
		compact: boolean;
		pxPerMonth: number;
		totalHeight: number;
		gridRowEnd?: number;
	} = $props();
</script>

<div
	class="col-start-2 relative max-sm:col-start-1"
	style="grid-row: 1 / {gridRowEnd ?? graphData.totalGridRows + 1}; width: {graphData.graphWidth}px;"
>
	<svg
		width={graphData.graphWidth}
		height={totalHeight}
		viewBox="0 0 {graphData.graphWidth} {totalHeight}"
		class="block"
	>
		<!-- Main branch line -->
		<line
			x1={graphData.laneX(0)}
			y1={nodeY(1, pxPerMonth)}
			x2={graphData.laneX(0)}
			y2={nodeY(Math.max(...graphData.nodes.map((n) => n.gridRow)), pxPerMonth)}
			class="stroke-surface-300 dark:stroke-surface-600"
			stroke-width={LINE_WIDTH}
			stroke-linecap="round"
		/>

		<!-- Branch lines -->
		{#each graphData.branches as branch}
			{@const bx = graphData.laneX(branch.lane)}
			<line
				x1={bx}
				y1={nodeY(branch.endRow, pxPerMonth)}
				x2={bx}
				y2={nodeY(branch.forkRow, pxPerMonth)}
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
				{@const ny = nodeY(node.row, pxPerMonth)}
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
			{@const my = nodeY(monthToRow(toAbsoluteMonth(year, 1)), pxPerMonth)}
			<rect
				x={mx - 16}
				y={my - 8}
				width="32"
				height="16"
				rx="3"
				class="fill-surface-50 dark:fill-surface-950"
			/>
			<text
				x={mx}
				y={my + 4}
				text-anchor="middle"
				class="fill-surface-400 dark:fill-surface-500 font-semibold tracking-[0.05em]"
				style="font-size: 0.5625rem;">{year}</text
			>
		{/each}

		<!-- Commit nodes -->
		{#each graphData.nodes as node}
			{#if !(compact && node.entry.type === 'life' && !node.entry.showDates)}
				{@const ny = nodeY(node.gridRow, pxPerMonth)}
				<circle
					cx={graphData.laneX(node.lane)}
					cy={ny}
					r={NODE_RADIUS}
					fill={node.color}
					class="stroke-surface-50 dark:stroke-surface-950 [stroke-width:3]"
				/>
			{/if}
		{/each}

		<!-- Life labels -->
		{#each graphData.nodes as node}
			{#if node.entry.type === 'life' && !node.entry.showDates}
				{@const mx = graphData.laneX(0)}
				{@const my = nodeY(node.row, pxPerMonth)}
				<rect
					x={mx - 16}
					y={my - 8}
					width="32"
					height="16"
					rx="3"
					class="fill-surface-50 dark:fill-surface-950"
				/>
				<text
					x={mx}
					y={my + 4}
					text-anchor="middle"
					class="fill-surface-400 dark:fill-surface-500 font-semibold tracking-[0.05em]"
					style="font-size: 0.5625rem;"
					>{node.entry.title}</text
				>
			{/if}
		{/each}
	</svg>
</div>
