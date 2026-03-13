import type { TimelineEntry } from "$interfaces/timelineEntry";
import { TOTAL_MONTHS, LANE_SPACING } from "./constants";
import type { GraphData } from "./types";
import { assignLanes, buildLaneLayout } from "./lanes";
import { buildLifeNodes, buildBranchNodes } from "./nodes";
import { resolveDesktopOverlap } from "./overlap";
import { buildForkPaths } from "./forks";

export function buildGraphData(
  entries: TimelineEntry[],
  pxPerMonth: number,
  measuredHeightsByEntry?: Map<TimelineEntry, number>,
): GraphData {
  const { branches, leftLaneCount, rightLaneCount } = assignLanes(entries);

  const { graphWidth, laneX } = buildLaneLayout(leftLaneCount, rightLaneCount, LANE_SPACING);

  const nodes = [...buildLifeNodes(entries), ...buildBranchNodes(branches)];

  const { totalGridRows } = resolveDesktopOverlap(nodes, pxPerMonth, TOTAL_MONTHS, measuredHeightsByEntry);

  const forks = buildForkPaths(branches, laneX, pxPerMonth);

  return { branches, nodes, forks, graphWidth, laneX, totalGridRows };
}
