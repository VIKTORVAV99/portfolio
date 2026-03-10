import type { TimelineEntry } from '$interfaces/timelineEntry';
import { ORIGIN_YEAR, TOTAL_YEARS, PX_PER_YEAR, FORK_CURVE_HEIGHT } from './constants';

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
	color: string;
	entry: TimelineEntry;
	side: 'left' | 'right';
}

export interface ForkPath {
	fromX: number;
	toX: number;
	y: number;
	color: string;
	direction: 'down' | 'up';
}

export interface GraphData {
	branches: Branch[];
	nodes: CommitNode[];
	forks: ForkPath[];
	graphWidth: number;
	laneX: (lane: number) => number;
}

export function yearToRow(year: number): number {
	return TOTAL_YEARS - (year - ORIGIN_YEAR);
}

export function nodeY(row: number): number {
	return (row - 1) * PX_PER_YEAR + PX_PER_YEAR * 0.5;
}

export function formatDate(entry: TimelineEntry): string {
	if (!entry.showDates || entry.startYear == null) return '';
	if (entry.endYear === null) return `${entry.startYear} — Present`;
	if (entry.endYear != null && entry.endYear !== entry.startYear)
		return `${entry.startYear} — ${entry.endYear}`;
	return `${entry.startYear}`;
}

export function forkCurvePath(fork: ForkPath): string {
	const { fromX, toX, y, direction } = fork;
	if (direction === 'down') {
		const y1 = y + FORK_CURVE_HEIGHT;
		const y2 = y;
		return `M ${fromX} ${y1} C ${fromX} ${y1 - FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2 + FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2}`;
	} else {
		const y1 = y;
		const y2 = y - FORK_CURVE_HEIGHT;
		return `M ${fromX} ${y1} C ${fromX} ${y1 - FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2 + FORK_CURVE_HEIGHT * 0.6}, ${toX} ${y2}`;
	}
}
