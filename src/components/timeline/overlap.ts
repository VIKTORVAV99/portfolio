import type { TimelineEntry } from "$interfaces/timelineEntry";
import { CARD_GAP, COMPACT_CARD_SPAN } from "./constants";
import type { CommitNode, Branch, BranchGroup } from "./types";

export function estimateCardRows(entry: TimelineEntry, pxPerMonth: number): number {
  const CARD_WIDTH = 352;
  const LINE_H = 20;
  const PADDING_PX = 4;
  const wrapLines = (text: string, charsPerLine: number) =>
    Math.max(1, Math.ceil(text.length / charsPerLine));
  const charsPerLine = Math.floor(CARD_WIDTH / 8);

  let px = PADDING_PX;
  if (entry.showDates) px += LINE_H;
  if (entry.degree) px += LINE_H;
  px += LINE_H * wrapLines(entry.title, charsPerLine);
  px += LINE_H;
  if (entry.employmentType) px += LINE_H;
  if (entry.location) px += LINE_H;
  if (entry.description) px += LINE_H * wrapLines(entry.description, charsPerLine) + 8;

  return Math.ceil(px / pxPerMonth) + 1;
}

export function resolveCompactOverlap(
  nodes: CommitNode[],
  branches: Branch[],
  baseTotalRows: number,
): { totalGridRows: number; branchGroups: BranchGroup[] } {
  const branchGroups: BranchGroup[] = [];

  const branchMap = new Map<string, CommitNode[]>();
  for (const node of nodes) {
    if (!branchMap.has(node.branchId)) branchMap.set(node.branchId, []);
    branchMap.get(node.branchId)!.push(node);
  }
  for (const branchNodes of branchMap.values()) {
    branchNodes.sort((a, b) => a.gridRow - b.gridRow);
  }

  const groups = [...branchMap.entries()]
    .map(([, branchNodes]) => ({
      nodes: branchNodes,
      color: branchNodes[0].color,
      side: branchNodes[0].side,
    }))
    .sort((a, b) => a.nodes[0].gridRow - b.nodes[0].gridRow);

  let nextRow = Math.min(...groups.map((g) => g.nodes[0].gridRow));
  for (const group of groups) {
    const startRow = Math.max(group.nodes[0].gridRow, nextRow);
    const endRow = startRow + COMPACT_CARD_SPAN;
    for (const n of group.nodes) {
      n.gridRow = startRow;
      n.gridRowEnd = endRow;
    }
    branchGroups.push({
      nodes: group.nodes,
      gridRow: startRow,
      gridRowEnd: endRow,
      color: group.color,
      side: group.side,
    });
    nextRow = endRow;
  }

  const totalGridRows = Math.max(baseTotalRows, nextRow);

  for (const branch of branches) {
    const branchNodes = nodes.filter((n) => n.branchId === branch.id);
    if (branchNodes.length > 0) {
      branch.endRow = Math.min(...branchNodes.map((n) => n.gridRow));
      branch.forkRow = Math.max(...branchNodes.map((n) => n.gridRowEnd));
    }
  }

  return { totalGridRows, branchGroups };
}

export function resolveDesktopOverlap(
  nodes: CommitNode[],
  pxPerMonth: number,
  baseTotalRows: number,
): { totalGridRows: number; branchGroups: BranchGroup[] } {
  for (const side of ["left", "right"] as const) {
    const sideNodes = nodes.filter((n) => n.side === side).sort((a, b) => a.gridRow - b.gridRow);
    for (const node of sideNodes) {
      const minSpan = estimateCardRows(node.entry, pxPerMonth);
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
      nextRow = node.gridRowEnd + CARD_GAP;
    }
  }

  const totalGridRows = Math.max(baseTotalRows, ...nodes.map((n) => n.gridRowEnd));
  return { totalGridRows, branchGroups: [] };
}
