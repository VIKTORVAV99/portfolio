import { NODE_RADIUS, LEADER_CHANNEL_GAP, MAX_LEADER_CHANNELS } from "./constants";
import { nodeY, type CommitNode, type LeaderLine } from "./types";

export function buildLeaderLines(
  nodes: CommitNode[],
  laneX: (lane: number) => number,
  graphWidth: number,
  pxPerMonth: number,
  trunkX: number,
): LeaderLine[] {
  // Separate channel tracking for left and right sides
  const rightChannelRanges: Array<Array<{ min: number; max: number }>> = Array.from(
    { length: MAX_LEADER_CHANNELS },
    () => [],
  );
  const leftChannelRanges: Array<Array<{ min: number; max: number }>> = Array.from(
    { length: MAX_LEADER_CHANNELS },
    () => [],
  );

  // Compute outermost dot edges per side so channels are always past all dots
  let rightOuterDotEdge = trunkX + NODE_RADIUS + 2;
  let leftOuterDotEdge = trunkX - NODE_RADIUS - 2;

  for (const node of nodes) {
    if (node.entry.type === "life" && !node.entry.showDates) continue;
    const nx = laneX(node.lane);
    if (node.side === "right") {
      rightOuterDotEdge = Math.max(rightOuterDotEdge, nx + NODE_RADIUS + 2);
    } else {
      leftOuterDotEdge = Math.min(leftOuterDotEdge, nx - NODE_RADIUS - 2);
    }
  }

  const rightChannelBase = rightOuterDotEdge + 2;
  const leftChannelBase = leftOuterDotEdge - 2;

  const lines: LeaderLine[] = [];

  for (const node of nodes) {
    if (node.entry.type === "life" && !node.entry.showDates) continue;

    const nx = laneX(node.lane);
    const dotY = nodeY(node.row, pxPerMonth);
    const cardY = nodeY(node.gridRow, pxPerMonth);
    const isLeft = node.side === "left";
    const dotEdgeX = nx + (isLeft ? -NODE_RADIUS - 2 : NODE_RADIUS + 2);
    const targetX = isLeft ? 0 : graphWidth;

    if (Math.abs(dotY - cardY) < 1) {
      // Straight horizontal line
      lines.push({
        points: [
          { x: dotEdgeX, y: dotY },
          { x: targetX, y: dotY },
        ],
        color: node.color,
      });
    } else {
      const channelRanges = isLeft ? leftChannelRanges : rightChannelRanges;

      // Find a free channel for the vertical segment
      const yMin = Math.min(dotY, cardY);
      const yMax = Math.max(dotY, cardY);
      let channelIdx = 0;
      for (let i = 0; i < MAX_LEADER_CHANNELS; i++) {
        const overlaps = channelRanges[i].some((r) => yMin <= r.max + 4 && yMax >= r.min - 4);
        if (!overlaps) {
          channelIdx = i;
          break;
        }
        channelIdx = i + 1;
      }

      // Clamp to last channel if all are occupied
      if (channelIdx >= MAX_LEADER_CHANNELS) {
        channelIdx = MAX_LEADER_CHANNELS - 1;
      }

      const channelX = isLeft
        ? leftChannelBase - channelIdx * LEADER_CHANNEL_GAP
        : rightChannelBase + channelIdx * LEADER_CHANNEL_GAP;

      if (channelIdx < MAX_LEADER_CHANNELS) {
        channelRanges[channelIdx].push({ min: yMin, max: yMax });
      }

      // 90-degree L-shaped path: dot → channel → card edge
      lines.push({
        points: [
          { x: dotEdgeX, y: dotY },
          { x: channelX, y: dotY },
          { x: channelX, y: cardY },
          { x: targetX, y: cardY },
        ],
        color: node.color,
      });
    }
  }

  return lines;
}
