import { describe, it, expect } from "bun:test"
import type { TimelineEntry } from "$interfaces/timelineEntry"
import type { CommitNode, Branch } from "./types"
import {
  estimateCardRows,
  resolveCompactOverlap,
  resolveDesktopOverlap,
} from "./overlap"
import { PX_PER_MONTH, COMPACT_CARD_SPAN, CARD_GAP } from "./constants"

function makeNode(overrides: Partial<CommitNode> = {}): CommitNode {
  return {
    lane: 1,
    branchId: "test",
    row: 10,
    gridRow: 10,
    gridRowEnd: 13,
    color: "#3b82f6",
    entry: {
      title: "Test",
      organization: "Corp",
      type: "work",
      startYear: 2020,
      showDates: true,
    } as TimelineEntry,
    side: "right",
    ...overrides,
  }
}

function makeBranch(overrides: Partial<Branch> = {}): Branch {
  return {
    id: "test",
    type: "work",
    side: "right",
    lane: 1,
    entries: [],
    forkRow: 5,
    endRow: 15,
    color: "#3b82f6",
    ...overrides,
  }
}

describe("estimateCardRows", () => {
  it("returns at least 2 for a minimal entry", () => {
    const entry: TimelineEntry = {
      title: "X",
      organization: "Y",
      type: "work",
      startYear: 2020,
      showDates: false,
    }
    expect(estimateCardRows(entry, PX_PER_MONTH)).toBeGreaterThanOrEqual(2)
  })

  it("returns more rows for entries with more fields", () => {
    const minimal: TimelineEntry = {
      title: "X",
      organization: "Y",
      type: "work",
      startYear: 2020,
      showDates: false,
    }
    const full: TimelineEntry = {
      title: "A longer title that wraps",
      organization: "A Corp",
      type: "work",
      startYear: 2020,
      showDates: true,
      degree: "BSc",
      employmentType: "Full-time",
      location: "City",
      description: "A description that spans multiple lines for testing purposes",
    }
    expect(estimateCardRows(full, PX_PER_MONTH)).toBeGreaterThan(
      estimateCardRows(minimal, PX_PER_MONTH),
    )
  })

  it("returns fewer rows when pxPerMonth is larger", () => {
    const entry: TimelineEntry = {
      title: "Test",
      organization: "Corp",
      type: "work",
      startYear: 2020,
      showDates: true,
      description: "Some description",
    }
    expect(estimateCardRows(entry, 16)).toBeLessThan(
      estimateCardRows(entry, 4),
    )
  })
})

describe("resolveCompactOverlap", () => {
  it("collapses all nodes in a branch to same gridRow", () => {
    const nodes = [
      makeNode({ branchId: "a", gridRow: 10, gridRowEnd: 13 }),
      makeNode({ branchId: "a", gridRow: 20, gridRowEnd: 23 }),
    ]
    const branches = [makeBranch({ id: "a" })]
    resolveCompactOverlap(nodes, branches, 100)
    expect(nodes[0].gridRow).toBe(nodes[1].gridRow)
    expect(nodes[0].gridRowEnd).toBe(nodes[1].gridRowEnd)
  })

  it("uses COMPACT_CARD_SPAN for group span", () => {
    const nodes = [makeNode({ branchId: "a", gridRow: 10, gridRowEnd: 13 })]
    const branches = [makeBranch({ id: "a" })]
    resolveCompactOverlap(nodes, branches, 100)
    expect(nodes[0].gridRowEnd - nodes[0].gridRow).toBe(COMPACT_CARD_SPAN)
  })

  it("returns branchGroups with correct structure", () => {
    const nodes = [
      makeNode({ branchId: "a", gridRow: 10, gridRowEnd: 13, color: "#aaa", side: "left" }),
      makeNode({ branchId: "b", gridRow: 50, gridRowEnd: 53, color: "#bbb", side: "left" }),
    ]
    const branches = [
      makeBranch({ id: "a" }),
      makeBranch({ id: "b" }),
    ]
    const { branchGroups } = resolveCompactOverlap(nodes, branches, 100)
    expect(branchGroups).toHaveLength(2)
    expect(branchGroups[0].color).toBe("#aaa")
    expect(branchGroups[1].color).toBe("#bbb")
  })

  it("stacks groups without overlap", () => {
    const nodes = [
      makeNode({ branchId: "a", gridRow: 10, gridRowEnd: 13 }),
      makeNode({ branchId: "b", gridRow: 10, gridRowEnd: 13 }),
    ]
    const branches = [
      makeBranch({ id: "a" }),
      makeBranch({ id: "b" }),
    ]
    const { branchGroups } = resolveCompactOverlap(nodes, branches, 100)
    // Second group should start at or after first group ends
    expect(branchGroups[1].gridRow).toBeGreaterThanOrEqual(
      branchGroups[0].gridRowEnd,
    )
  })

  it("updates branch forkRow and endRow", () => {
    const nodes = [makeNode({ branchId: "a", gridRow: 10, gridRowEnd: 13 })]
    const branches = [makeBranch({ id: "a" })]
    resolveCompactOverlap(nodes, branches, 100)
    // After compact overlap, branch endRow = min gridRow, forkRow = max gridRowEnd
    expect(branches[0].endRow).toBe(nodes[0].gridRow)
    expect(branches[0].forkRow).toBe(nodes[0].gridRowEnd)
  })
})

describe("resolveDesktopOverlap", () => {
  it("shifts overlapping same-side nodes down", () => {
    const nodes = [
      makeNode({ gridRow: 10, gridRowEnd: 20, side: "right" }),
      makeNode({ gridRow: 15, gridRowEnd: 25, side: "right" }),
    ]
    resolveDesktopOverlap(nodes, PX_PER_MONTH, 100)
    // Second node should be shifted so it doesn't overlap
    expect(nodes[1].gridRow).toBeGreaterThanOrEqual(
      nodes[0].gridRowEnd + CARD_GAP,
    )
  })

  it("does not shift nodes on opposite sides", () => {
    const nodes = [
      makeNode({ gridRow: 10, gridRowEnd: 20, side: "left" }),
      makeNode({ gridRow: 10, gridRowEnd: 20, side: "right" }),
    ]
    resolveDesktopOverlap(nodes, PX_PER_MONTH, 100)
    // Nodes on different sides should not affect each other
    expect(nodes[0].gridRow).toBe(10)
    expect(nodes[1].gridRow).toBe(10)
  })

  it("returns empty branchGroups", () => {
    const { branchGroups } = resolveDesktopOverlap([], PX_PER_MONTH, 100)
    expect(branchGroups).toHaveLength(0)
  })

  it("expands small cards to estimateCardRows minimum", () => {
    const entry: TimelineEntry = {
      title: "A reasonably long title for a card",
      organization: "Corp",
      type: "work",
      startYear: 2020,
      showDates: true,
      description: "A description",
      location: "City",
    }
    const nodes = [
      makeNode({ gridRow: 10, gridRowEnd: 11, side: "right", entry }),
    ]
    resolveDesktopOverlap(nodes, PX_PER_MONTH, 100)
    expect(nodes[0].gridRowEnd - nodes[0].gridRow).toBeGreaterThan(1)
  })
})
