import type { TimelineEntry } from "$interfaces/timelineEntry";
import { MIN_SPAN, COLOR_LIFE } from "./constants";
import {
  monthToRow,
  entryStartAbsMonth,
  entryEndAbsMonth,
  type CommitNode,
  type Branch,
} from "./types";

export function buildLifeNodes(entries: TimelineEntry[]): CommitNode[] {
  const nodes: CommitNode[] = [];
  for (const entry of entries) {
    if (entry.type === "life") {
      const start = entryStartAbsMonth(entry);
      const row = monthToRow(start);
      const gridRowEnd = row + MIN_SPAN;
      nodes.push({
        lane: 0,
        branchId: "__life",
        row,
        gridRow: row,
        gridRowEnd,
        color: COLOR_LIFE,
        entry,
        side: "right",
      });
    }
  }
  return nodes;
}

export function buildBranchNodes(branches: Branch[]): CommitNode[] {
  const nodes: CommitNode[] = [];
  for (const branch of branches) {
    for (const entry of branch.entries) {
      const start = entryStartAbsMonth(entry);
      const end = entryEndAbsMonth(entry);
      const midRow = monthToRow(Math.round((start + end) / 2));
      const row = midRow;
      const gridRow = midRow;
      let gridRowEnd = monthToRow(start) + 1;
      if (gridRowEnd - gridRow < MIN_SPAN) gridRowEnd = gridRow + MIN_SPAN;
      nodes.push({
        lane: branch.lane,
        branchId: branch.id,
        row,
        gridRow,
        gridRowEnd,
        color: branch.color,
        entry,
        side: branch.side,
      });
    }
  }
  return nodes;
}
