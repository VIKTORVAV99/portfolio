import type { TimelineEntry } from '$interfaces/timelineEntry';
import {
	ORIGIN_YEAR,
	ORIGIN_MONTH,
	TOTAL_MONTHS,
	PX_PER_MONTH,
	CURRENT_YEAR,
	CURRENT_MONTH,
	GRAPH_TOP_PADDING_PX
} from './constants';

export interface Branch {
	id: string;
	type: TimelineEntry['type'];
	side: 'left' | 'right';
	lane: number;
	entries: TimelineEntry[];
	forkRow: number;
	endRow: number;
	color: string;
}

export interface CommitNode {
	lane: number;
	row: number;
	rowEnd: number;
	gridRow: number;
	gridRowEnd: number;
	color: string;
	entry: TimelineEntry;
	side: 'left' | 'right';
}

export interface ForkPath {
	fromX: number;
	toX: number;
	y: number;
	curveHeight: number;
	color: string;
	direction: 'down' | 'up';
}

export interface GraphData {
	branches: Branch[];
	nodes: CommitNode[];
	forks: ForkPath[];
	graphWidth: number;
	laneX: (lane: number) => number;
	totalGridRows: number;
	branchGroups: BranchGroup[];
}

export interface BranchGroup {
	nodes: CommitNode[];
	gridRow: number;
	gridRowEnd: number;
	color: string;
	side: 'left' | 'right';
}

export function toAbsoluteMonth(year: number, month: number = 1): number {
	return (year - ORIGIN_YEAR) * 12 + month;
}

export function entryStartAbsMonth(entry: TimelineEntry): number {
	return toAbsoluteMonth(entry.startYear ?? ORIGIN_YEAR, entry.startMonth ?? ORIGIN_MONTH);
}

export function entryEndAbsMonth(entry: TimelineEntry): number {
	if (entry.endYear === null) {
		return toAbsoluteMonth(CURRENT_YEAR, CURRENT_MONTH);
	}
	if (entry.endYear === undefined) {
		return toAbsoluteMonth(entry.startYear ?? ORIGIN_YEAR, entry.startMonth ?? ORIGIN_MONTH);
	}
	return toAbsoluteMonth(entry.endYear, entry.endMonth ?? 12);
}

export function monthToRow(absMonth: number): number {
	return TOTAL_MONTHS - absMonth + 1;
}

export function nodeY(row: number, pxPerMonth: number = PX_PER_MONTH): number {
	return (row - 1) * pxPerMonth + pxPerMonth * 0.5 + GRAPH_TOP_PADDING_PX;
}

export function formatDate(entry: TimelineEntry): string {
	if (!entry.showDates || entry.startYear == null) return '';
	const startStr =
		entry.startMonth != null
			? `${entry.startYear}/${String(entry.startMonth).padStart(2, '0')}`
			: `${entry.startYear}`;
	if (entry.endYear === null) return `${startStr} — Present`;
	if (entry.endYear != null) {
		const endStr =
			entry.endMonth != null
				? `${entry.endYear}/${String(entry.endMonth).padStart(2, '0')}`
				: `${entry.endYear}`;
		if (startStr !== endStr) return `${startStr} — ${endStr}`;
	}
	return startStr;
}

export function forkCurvePath(fork: ForkPath): string {
	const { fromX, toX, y, curveHeight, direction } = fork;
	if (direction === 'down') {
		const y1 = y + curveHeight;
		const y2 = y;
		return `M ${fromX} ${y1} C ${fromX} ${y1 - curveHeight * 0.6}, ${toX} ${y2 + curveHeight * 0.6}, ${toX} ${y2}`;
	} else {
		const y1 = y;
		const y2 = y - curveHeight;
		return `M ${fromX} ${y1} C ${fromX} ${y1 - curveHeight * 0.6}, ${toX} ${y2 + curveHeight * 0.6}, ${toX} ${y2}`;
	}
}
