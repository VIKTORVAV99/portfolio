import { describe, it, expect } from "bun:test";
import { buildForkPaths } from "./forks";
import { FORK_CURVE_MONTHS } from "./constants";
import type { Branch } from "./types";

const laneX = (lane: number) => 100 + lane * 40;
const pxPerMonth = 8;

function makeBranch(overrides: Partial<Branch> = {}): Branch {
  return {
    id: "test",
    type: "work",
    side: "right",
    lane: 1,
    entries: [
      {
        title: "Job",
        organization: "Corp",
        type: "work",
        startYear: 2020,
        startMonth: 1,
        endYear: 2021,
        endMonth: 12,
        showDates: true,
      },
    ],
    forkRow: 10,
    endRow: 5,
    color: "#3b82f6",
    ...overrides,
  };
}

describe("buildForkPaths", () => {
  it("returns 2 paths for a completed branch (fork down + merge up)", () => {
    const paths = buildForkPaths([makeBranch()], laneX, pxPerMonth);
    expect(paths).toHaveLength(2);
    expect(paths[0].direction).toBe("down");
    expect(paths[1].direction).toBe("up");
  });

  it("returns 1 path for an ongoing branch (fork down only)", () => {
    const branch = makeBranch({
      entries: [
        {
          title: "Current Job",
          organization: "Corp",
          type: "work",
          startYear: 2022,
          startMonth: 1,
          endYear: null,
          showDates: true,
        },
      ],
    });
    const paths = buildForkPaths([branch], laneX, pxPerMonth);
    expect(paths).toHaveLength(1);
    expect(paths[0].direction).toBe("down");
  });

  it("uses FORK_CURVE_MONTHS for curveHeight", () => {
    const paths = buildForkPaths([makeBranch()], laneX, pxPerMonth);
    const expected = pxPerMonth * FORK_CURVE_MONTHS;
    for (const p of paths) {
      expect(p.curveHeight).toBe(expected);
    }
  });

  it("returns empty array for empty branches", () => {
    expect(buildForkPaths([], laneX, pxPerMonth)).toHaveLength(0);
  });
});
