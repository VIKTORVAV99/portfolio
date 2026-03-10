import { FORK_CURVE_MONTHS } from "./constants";
import { nodeY, type Branch, type ForkPath } from "./types";

export function buildForkPaths(
  branches: Branch[],
  laneX: (lane: number) => number,
  pxPerMonth: number,
): ForkPath[] {
  const forks: ForkPath[] = [];

  for (const branch of branches) {
    forks.push({
      fromX: laneX(0),
      toX: laneX(branch.lane),
      y: nodeY(branch.forkRow, pxPerMonth),
      curveHeight: pxPerMonth * FORK_CURVE_MONTHS,
      color: branch.color,
      direction: "down",
    });

    const isOngoing = branch.entries.some((e) => e.endYear === null);
    if (!isOngoing) {
      forks.push({
        fromX: laneX(branch.lane),
        toX: laneX(0),
        y: nodeY(branch.endRow, pxPerMonth),
        curveHeight: pxPerMonth * FORK_CURVE_MONTHS,
        color: branch.color,
        direction: "up",
      });
    }
  }

  return forks;
}
