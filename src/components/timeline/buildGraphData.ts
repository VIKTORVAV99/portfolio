import type { TimelineEntry } from "$interfaces/timelineEntry";
import { TOTAL_MONTHS, LANE_SPACING, LANE_SPACING_MOBILE } from "./constants";
import type { GraphData } from "./types";
import { assignLanes, buildLaneLayout } from "./lanes";
import { buildLifeNodes, buildBranchNodes } from "./nodes";
import { resolveCompactOverlap, resolveDesktopOverlap } from "./overlap";
import { buildForkPaths } from "./forks";

export function buildGraphData(
  entries: TimelineEntry[],
  compact: boolean,
  pxPerMonth: number,
  measuredHeightsByEntry?: Map<TimelineEntry, number>,
): GraphData {
  const { branches, leftLaneCount, rightLaneCount } = assignLanes(entries, compact);

  const spacing = compact ? LANE_SPACING_MOBILE : LANE_SPACING;
  const { graphWidth, laneX } = buildLaneLayout(leftLaneCount, rightLaneCount, spacing);

  const nodes = [...buildLifeNodes(entries), ...buildBranchNodes(branches)];

  const { totalGridRows, branchGroups } = compact
    ? resolveCompactOverlap(nodes, branches, TOTAL_MONTHS)
    : resolveDesktopOverlap(nodes, pxPerMonth, TOTAL_MONTHS, measuredHeightsByEntry);

  const forks = buildForkPaths(branches, laneX, pxPerMonth);

  return { branches, nodes, forks, graphWidth, laneX, totalGridRows, branchGroups };
}
