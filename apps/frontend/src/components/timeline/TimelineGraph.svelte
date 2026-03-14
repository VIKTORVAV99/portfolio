<script lang="ts">
  import { LINE_WIDTH, NODE_RADIUS, FORK_CURVE_MONTHS } from "./constants";
  import {
    type GraphData,
    nodeY,
    monthToRow,
    toAbsoluteMonth,
    entryEndAbsMonth,
  } from "./types";

  let {
    graphData,
    yearMarkers,
    pxPerMonth,
    totalHeight,
  }: {
    graphData: GraphData;
    yearMarkers: number[];
    pxPerMonth: number;
    totalHeight: number;
  } = $props();

  const branchPaths = $derived.by(() => {
    const ch = pxPerMonth * FORK_CURVE_MONTHS;

    // Build tick y-positions per branch
    const ticksByBranch = new Map<string, number[]>();
    const byBranch = new Map<string, (typeof graphData.nodes)[number][]>();
    for (const node of graphData.nodes) {
      if (!byBranch.has(node.branchId)) byBranch.set(node.branchId, []);
      byBranch.get(node.branchId)!.push(node);
    }
    for (const [branchId, nodes] of byBranch) {
      if (nodes.length < 2) continue;
      const sorted = [...nodes].sort((a, b) => b.row - a.row);
      ticksByBranch.set(
        branchId,
        sorted
          .slice(0, -1)
          .map((n) => nodeY(monthToRow(entryEndAbsMonth(n.entry)), pxPerMonth)),
      );
    }

    return graphData.branches.map((branch) => {
      const mainX = graphData.laneX(0);
      const bx = graphData.laneX(branch.lane);
      const forkY = nodeY(branch.forkRow, pxPerMonth);
      const endY = nodeY(branch.endRow, pxPerMonth);
      const isOngoing = branch.entries.some((e) => e.endYear === null);

      let d =
        `M ${mainX} ${forkY + ch}` +
        ` C ${mainX} ${forkY + 0.4 * ch}, ${bx} ${forkY + 0.6 * ch}, ${bx} ${forkY}`;

      // Interleave tick segments (sorted descending y, bottom to top)
      for (const ty of ticksByBranch.get(branch.id) ?? []) {
        d += ` L ${bx} ${ty} L ${bx - 5} ${ty} L ${bx + 5} ${ty} L ${bx} ${ty}`;
      }

      d += ` L ${bx} ${endY}`;

      if (!isOngoing) {
        d +=
          ` C ${bx} ${endY - 0.6 * ch}, ${mainX} ${endY - 0.4 * ch}, ${mainX} ${endY - ch}`;
      }

      return { d, color: branch.color };
    });
  });
</script>

<div
  class="{graphData.mode === 'compact' ? 'col-start-1' : 'col-start-2'} relative"
  style="grid-row: 1 / {graphData.totalGridRows + 1}; width: {graphData.graphWidth}px;"
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
      y1={nodeY(Math.max(...graphData.nodes.map((n) => n.gridRow)), pxPerMonth)}
      x2={graphData.laneX(0)}
      y2={nodeY(1, pxPerMonth)}
      class="stroke-surface-300 dark:stroke-surface-600 graph-line"
      stroke-width={LINE_WIDTH}
      stroke-linecap="round"
      pathLength="1"
      style="animation-delay: 200ms;"
    />

    <!-- Branch paths (fork curve + vertical + merge curve combined) -->
    {#each branchPaths as bp, i}
      <path
        d={bp.d}
        fill="none"
        stroke={bp.color}
        stroke-width={LINE_WIDTH}
        stroke-linecap="round"
        class="graph-line"
        pathLength="1"
        style="animation-delay: {300 + i * 100}ms;"
      />
    {/each}

    <!-- Leader lines -->
    {#each graphData.leaderLines as leader, i}
      <polyline
        points={leader.points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={leader.color}
        stroke-width={1}
        stroke-dasharray="4 3"
        class="graph-fade"
        style="animation-delay: {600 + i * 50}ms;"
      />
    {/each}

    <!-- Year markers -->
    {#each yearMarkers as year, i}
      {@const mx = graphData.laneX(0)}
      {@const my = nodeY(monthToRow(toAbsoluteMonth(year, 1)), pxPerMonth)}
      <g class="graph-fade" style="animation-delay: {800 + i * 50}ms;">
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
      </g>
    {/each}

    <!-- Commit nodes -->
    {#each graphData.nodes as node, i}
      {@const ny = nodeY(node.row, pxPerMonth)}
      <circle
        cx={graphData.laneX(node.lane)}
        cy={ny}
        r={NODE_RADIUS}
        fill={node.color}
        class="stroke-surface-50 dark:stroke-surface-950 stroke-3 graph-node"
        style="animation-delay: {600 + i * 50}ms;"
      />
    {/each}

    <!-- Life labels -->
    {#each graphData.nodes as node, i}
      {#if node.entry.type === "life" && !node.entry.showDates}
        {@const mx = graphData.laneX(0)}
        {@const my = nodeY(node.row, pxPerMonth)}
        <g class="graph-fade" style="animation-delay: {800 + i * 50}ms;">
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
            style="font-size: 0.5625rem;">{node.entry.title}</text
          >
        </g>
      {/if}
    {/each}
  </svg>
</div>
