import type { TimelineEntry } from "$interfaces/timelineEntry";
import { BRANCH_COLORS, MAX_LEADER_CHANNELS, LEADER_CHANNEL_GAP } from "./constants";
import {
  monthToRow,
  entryStartAbsMonth,
  entryEndAbsMonth,
  type Branch,
  type TimelineMode,
} from "./types";

export interface AssignLanesResult {
  branches: Branch[];
  leftLaneCount: number;
  rightLaneCount: number;
}

export interface LaneLayout {
  graphWidth: number;
  laneX: (lane: number) => number;
}

export function assignLanes(
  entries: TimelineEntry[],
  mode: TimelineMode = "desktop",
): AssignLanesResult {
  // Group entries into branches
  const groupMap = new Map<string, TimelineEntry[]>();
  let ungroupedIdx = 0;

  for (const entry of entries) {
    if (entry.type === "life") continue;
    const key = entry.group ?? `__ungrouped_${ungroupedIdx++}`;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(entry);
  }

  // Sort each group's entries by startYear ascending
  for (const [, groupEntries] of groupMap) {
    groupEntries.sort((a, b) => entryStartAbsMonth(a) - entryStartAbsMonth(b));
  }

  // Assign branches to lanes (reuse lanes when branches don't overlap in time)
  const branches: Branch[] = [];

  const sortedGroups = [...groupMap.entries()].sort((a, b) => {
    const aStart = Math.min(...a[1].map((e) => entryStartAbsMonth(e)));
    const bStart = Math.min(...b[1].map((e) => entryStartAbsMonth(e)));
    return aStart - bStart;
  });

  // Track which time ranges occupy each lane
  const laneOccupancy = new Map<number, Array<{ start: number; end: number }>>();
  let nextLeftLane = -1;
  let nextRightLane = 1;

  function findReusableLane(side: "left" | "right", start: number, end: number): number | null {
    for (const [lane, ranges] of laneOccupancy) {
      if (side === "left" && lane >= 0) continue;
      if (side === "right" && lane <= 0) continue;
      const overlaps = ranges.some((r) => start <= r.end && end >= r.start);
      if (!overlaps) return lane;
    }
    return null;
  }

  let branchColorIdx = 0;
  for (const [id, groupEntries] of sortedGroups) {
    const type = groupEntries[0].type;
    const side: "left" | "right" =
      mode === "compact" ? "left" : type === "education" ? "left" : "right";

    const earliestStart = Math.min(...groupEntries.map((e) => entryStartAbsMonth(e)));
    const latestEnd = Math.max(...groupEntries.map((e) => entryEndAbsMonth(e)));

    let lane = findReusableLane(side, earliestStart, latestEnd);
    if (lane === null) {
      lane = side === "left" ? nextLeftLane-- : nextRightLane++;
    }

    if (!laneOccupancy.has(lane)) laneOccupancy.set(lane, []);
    laneOccupancy.get(lane)!.push({ start: earliestStart, end: latestEnd });

    branches.push({
      id,
      type,
      side,
      lane,
      entries: groupEntries,
      forkRow: monthToRow(earliestStart) - 1,
      endRow: monthToRow(latestEnd),
      color: BRANCH_COLORS[branchColorIdx++ % BRANCH_COLORS.length],
    });
  }

  const leftLaneCount = Math.abs(Math.min(0, ...branches.map((b) => b.lane)));
  const rightLaneCount = Math.max(0, ...branches.map((b) => b.lane));

  return { branches, leftLaneCount, rightLaneCount };
}

export function buildLaneLayout(
  leftLaneCount: number,
  rightLaneCount: number,
  spacing: number,
  mode: TimelineMode = "desktop",
): LaneLayout {
  if (mode === "compact") {
    const leaderChannelWidth = MAX_LEADER_CHANNELS * LEADER_CHANNEL_GAP;
    const graphWidth = (leftLaneCount + 2) * spacing + leaderChannelWidth;

    function laneX(lane: number): number {
      // lane 0 (trunk) sits at the right side of the branch area
      return (leftLaneCount + 1) * spacing + lane * spacing;
    }

    return { graphWidth, laneX };
  }

  const maxLaneCount = Math.max(leftLaneCount, rightLaneCount);
  const graphWidth = (2 * maxLaneCount + 2) * spacing;

  function laneX(lane: number): number {
    return (maxLaneCount + lane) * spacing + spacing;
  }

  return { graphWidth, laneX };
}
