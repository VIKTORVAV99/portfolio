import type { TimelineEntry } from '$interfaces/timelineEntry';
import {
	TOTAL_MONTHS,
	MIN_SPAN,
	COMPACT_CARD_SPAN,
	COLOR_LIFE,
	BRANCH_COLORS,
	LANE_SPACING,
	LANE_SPACING_MOBILE
} from './constants';
import {
	monthToRow,
	nodeY,
	entryStartAbsMonth,
	entryEndAbsMonth,
	type Branch,
	type GraphData,
	type BranchGroup
} from './types';

export function buildGraphData(entries: TimelineEntry[], compact: boolean, pxPerMonth: number): GraphData {
	// Step 1: Group entries into branches
	const groupMap = new Map<string, TimelineEntry[]>();
	let ungroupedIdx = 0;

	for (const entry of entries) {
		if (entry.type === 'life') continue;
		const key = entry.group ?? `__ungrouped_${ungroupedIdx++}`;
		if (!groupMap.has(key)) groupMap.set(key, []);
		groupMap.get(key)!.push(entry);
	}

	// Step 2: Sort each group's entries by startYear ascending
	for (const [, groupEntries] of groupMap) {
		groupEntries.sort((a, b) => entryStartAbsMonth(a) - entryStartAbsMonth(b));
	}

	// Step 3: Assign branches to lanes (reuse lanes when branches don't overlap in time)
	const branches: Branch[] = [];

	const sortedGroups = [...groupMap.entries()].sort((a, b) => {
		const aStart = Math.min(...a[1].map((e) => entryStartAbsMonth(e)));
		const bStart = Math.min(...b[1].map((e) => entryStartAbsMonth(e)));
		return aStart - bStart;
	});

	// Track which time ranges occupy each lane: Map<lane, {start, end}[]>
	const laneOccupancy = new Map<number, Array<{ start: number; end: number }>>();
	let nextLeftLane = -1;
	let nextRightLane = 1;

	function findReusableLane(side: 'left' | 'right', start: number, end: number): number | null {
		for (const [lane, ranges] of laneOccupancy) {
			if (side === 'left' && lane >= 0) continue;
			if (side === 'right' && lane <= 0) continue;
			const overlaps = ranges.some((r) => start <= r.end && end >= r.start);
			if (!overlaps) return lane;
		}
		return null;
	}

	let branchColorIdx = 0;
	for (const [id, groupEntries] of sortedGroups) {
		const type = groupEntries[0].type;
		const side: 'left' | 'right' = compact ? 'left' : type === 'education' ? 'left' : 'right';

		const earliestStart = Math.min(...groupEntries.map((e) => entryStartAbsMonth(e)));
		const latestEnd = Math.max(...groupEntries.map((e) => entryEndAbsMonth(e)));

		let lane = findReusableLane(side, earliestStart, latestEnd);
		if (lane === null) {
			lane = compact ? nextLeftLane-- : side === 'left' ? nextLeftLane-- : nextRightLane++;
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
			color: BRANCH_COLORS[branchColorIdx++ % BRANCH_COLORS.length]
		});
	}

	// Step 4: Compute lane X positions
	const spacing = compact ? LANE_SPACING_MOBILE : LANE_SPACING;
	const leftLaneCount = Math.abs(Math.min(0, ...branches.map((b) => b.lane)));
	const rightLaneCount = Math.max(0, ...branches.map((b) => b.lane));
	const maxLaneCount = Math.max(leftLaneCount, rightLaneCount);
	const graphWidth = (2 * maxLaneCount + 2) * spacing;

	function laneX(lane: number): number {
		return (maxLaneCount + lane) * spacing + spacing;
	}

	// Step 5: Build commit nodes
	const nodes = [];

	for (const entry of entries) {
		if (entry.type === 'life') {
			const start = entryStartAbsMonth(entry);
			const row = monthToRow(start);
			const rowEnd = row + MIN_SPAN;
			nodes.push({
				lane: 0,
				branchId: '__life',
				row,
				rowEnd,
				gridRow: row,
				gridRowEnd: rowEnd,
				color: COLOR_LIFE,
				entry,
				side: 'right' as const
			});
		}
	}

	for (const branch of branches) {
		for (const entry of branch.entries) {
			const start = entryStartAbsMonth(entry);
			const end = entryEndAbsMonth(entry);
			const midRow = monthToRow(Math.round((start + end) / 2));
			const row = midRow;
			const gridRow = midRow;
			let rowEnd = monthToRow(start) + 1;
			if (rowEnd - gridRow < MIN_SPAN) rowEnd = gridRow + MIN_SPAN;
			nodes.push({
				lane: branch.lane,
				branchId: branch.id,
				row,
				rowEnd,
				gridRow,
				gridRowEnd: rowEnd,
				color: branch.color,
				entry,
				side: branch.side
			});
		}
	}

	// Resolve card overlap in compact mode & build branch groups
	let totalGridRows = TOTAL_MONTHS;
	const branchGroups: BranchGroup[] = [];

	if (compact) {
		const branchMap = new Map<string, typeof nodes>();
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
				side: branchNodes[0].side
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
				side: group.side
			});
			nextRow = endRow;
		}

		totalGridRows = Math.max(TOTAL_MONTHS, nextRow);

		for (const branch of branches) {
			const branchNodes = nodes.filter((n) => n.branchId === branch.id);
			if (branchNodes.length > 0) {
				branch.endRow = Math.min(...branchNodes.map((n) => n.gridRow));
				branch.forkRow = Math.max(...branchNodes.map((n) => n.gridRowEnd));
			}
		}
	} else {
		// Resolve card overlap per side-column on desktop
		for (const side of ['left', 'right'] as const) {
			const sideNodes = nodes.filter((n) => n.side === side).sort((a, b) => a.gridRow - b.gridRow);
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
		totalGridRows = Math.max(TOTAL_MONTHS, ...nodes.map((n) => n.gridRowEnd));
	}

	// Step 6: Build fork/merge curves
	const forks = [];
	for (const branch of branches) {
		forks.push({
			fromX: laneX(0),
			toX: laneX(branch.lane),
			y: nodeY(branch.forkRow, pxPerMonth),
			curveHeight: pxPerMonth * 3,
			color: branch.color,
			direction: 'down' as const
		});

		const isOngoing = branch.entries.some((e) => e.endYear === null);
		if (!isOngoing) {
			forks.push({
				fromX: laneX(branch.lane),
				toX: laneX(0),
				y: nodeY(branch.endRow, pxPerMonth),
				curveHeight: pxPerMonth * 3,
				color: branch.color,
				direction: 'up' as const
			});
		}
	}

	return { branches, nodes, forks, graphWidth, laneX, totalGridRows, branchGroups };
}
