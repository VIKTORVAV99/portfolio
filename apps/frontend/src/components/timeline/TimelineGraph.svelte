<script lang="ts">
  import { onMount } from "svelte";
  import { linear } from "svelte/easing";
  import { draw, scale, fade } from "svelte/transition";
  import { LINE_WIDTH, NODE_RADIUS } from "./constants";
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

  const maxGridRow = $derived(Math.max(...graphData.nodes.map((n) => n.gridRow)));

  let mounted = $state(false);
  onMount(() => { mounted = true; });

  /** ms delay per grid row, bottom-up: row closer to maxGridRow → shorter delay */
  const msPerRow = 3;
  const rowDelay = (row: number) => (maxGridRow - row) * msPerRow;

  /** Trunk total pixel length and px/ms rate — used to scale branch durations */
  const trunkPxLen = $derived(
    Math.abs(nodeY(maxGridRow, pxPerMonth) - nodeY(1, pxPerMonth)),
  );
  const trunkDuration = $derived(maxGridRow * msPerRow);
  const pxPerMs = $derived(trunkPxLen / trunkDuration);

  const trunkLabels = $derived.by(() => {
    const labels: Array<{ y: number; text: string }> = [];
    for (const year of yearMarkers) {
      labels.push({
        y: nodeY(monthToRow(toAbsoluteMonth(year, 1)), pxPerMonth),
        text: String(year),
      });
    }
    for (const node of graphData.nodes) {
      if (node.entry.type === "life" && !node.entry.showDates) {
        labels.push({
          y: nodeY(node.row, pxPerMonth),
          text: node.entry.title,
        });
      }
    }
    return labels;
  });

  const branchPaths = $derived.by(() => {
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
      const ch = branch.curveOffset * pxPerMonth;
      const { isOngoing } = branch;

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

      const verticalPx = Math.abs(forkY + ch - (isOngoing ? endY : endY - ch));
      return { d, color: branch.color, forkRow: branch.forkRow, verticalPx };
    });
  });

  // Empty until mounted so {#each} items are "added" and get intro transitions
  const visibleBranches = $derived(mounted ? branchPaths : []);
  const visibleNodes = $derived(mounted ? graphData.nodes : []);
  const visibleLeaders = $derived(mounted ? graphData.leaderLines : []);
  const visibleLabels = $derived(mounted ? trunkLabels : []);
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
      y1={nodeY(maxGridRow, pxPerMonth)}
      x2={graphData.laneX(0)}
      y2={nodeY(1, pxPerMonth)}
      class="stroke-surface-600"
      stroke-width={LINE_WIDTH}
      stroke-linecap="round"
    />

    <!-- Branch paths (fork curve + vertical + merge curve combined) -->
    {#each visibleBranches as bp}
      <path
        d={bp.d}
        fill="none"
        stroke={bp.color}
        stroke-width={LINE_WIDTH}
        stroke-linecap="round"
        in:draw={{ duration: Math.max(400, bp.verticalPx / pxPerMs), delay: rowDelay(bp.forkRow), easing: linear }}
      />
    {/each}

    <!-- Leader lines -->
    {#each visibleLeaders as leader}
      <polyline
        points={leader.points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={leader.color}
        stroke-width={1}
        stroke-dasharray="4 3"
        in:fade={{ duration: 300, delay: (1 - leader.points[0].y / totalHeight) * maxGridRow * msPerRow }}
      />
    {/each}

    <!-- Commit nodes -->
    {#each visibleNodes as node}
      {@const ny = nodeY(node.row, pxPerMonth)}
      <circle
        cx={graphData.laneX(node.lane)}
        cy={ny}
        r={NODE_RADIUS}
        fill={node.color}
        class="[transform-box:fill-box] origin-center stroke-surface-950 stroke-3"
        in:scale={{ duration: 300, delay: rowDelay(node.row), start: 0 }}
      />
    {/each}

    <!-- Trunk labels (year markers + life labels) -->
    {#each visibleLabels as label}
      {@const mx = graphData.laneX(0)}
      <g in:fade={{ duration: 300, delay: (1 - label.y / totalHeight) * maxGridRow * msPerRow }}>
        <rect
          x={mx - 16}
          y={label.y - 8}
          width="32"
          height="16"
          rx="3"
          class="fill-surface-950"
        />
        <text
          x={mx}
          y={label.y + 4}
          text-anchor="middle"
          class="fill-surface-500 font-semibold tracking-[0.05em]"
          style="font-size: 0.5625rem;">{label.text}</text
        >
      </g>
    {/each}
  </svg>
</div>
