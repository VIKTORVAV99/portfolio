import type { TimelineEntry } from "$interfaces/timelineEntry";
import type { CommitNode } from "./types";

export function resolveDesktopOverlap(
  nodes: CommitNode[],
  pxPerMonth: number,
  baseTotalRows: number,
  measuredHeightsByEntry?: Map<TimelineEntry, number>,
): { totalGridRows: number } {
  for (const side of ["left", "right"] as const) {
    const sideNodes = nodes.filter((n) => n.side === side).sort((a, b) => a.gridRow - b.gridRow);
    for (const node of sideNodes) {
      const measuredHeight = measuredHeightsByEntry?.get(node.entry);
      const minSpan =
        measuredHeight != null ? Math.max(2, Math.ceil(measuredHeight / pxPerMonth) + 1) : 2;
      if (node.gridRowEnd - node.gridRow < minSpan) {
        node.gridRowEnd = node.gridRow + minSpan;
      }
    }
    let nextRow = -Infinity;
    for (const node of sideNodes) {
      if (node.gridRow < nextRow) {
        const shift = nextRow - node.gridRow;
        node.gridRow += shift;
        node.gridRowEnd += shift;
      }
      nextRow = node.gridRowEnd;
    }
  }

  const totalGridRows = Math.max(baseTotalRows, ...nodes.map((n) => n.gridRowEnd));
  return { totalGridRows };
}
