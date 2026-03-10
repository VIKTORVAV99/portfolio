import { timelineEntries } from '$data/timeline';

// Layout constants
const lifeEntry = timelineEntries.find((e) => e.type === 'life');
export const ORIGIN_YEAR = lifeEntry?.startYear ?? 1999;
export const ORIGIN_MONTH = lifeEntry?.startMonth ?? 1;
export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const PX_PER_YEAR = 96;
export const PX_PER_YEAR_MOBILE = 60;
export const PX_PER_MONTH = PX_PER_YEAR / 12;
export const PX_PER_MONTH_MOBILE = PX_PER_YEAR_MOBILE / 12;
export const TOTAL_YEARS = CURRENT_YEAR - ORIGIN_YEAR + 1;
export const TOTAL_MONTHS = (CURRENT_YEAR - ORIGIN_YEAR) * 12 + CURRENT_MONTH;
export const TOTAL_HEIGHT = TOTAL_MONTHS * PX_PER_MONTH;
export const MIN_SPAN = 3;
export const GRAPH_TOP_PADDING_PX = 12;
export const COMPACT_CARD_SPAN = 36;
export const LANE_SPACING_MOBILE = 14;

// Graph constants
export const LANE_SPACING = 40;
export const NODE_RADIUS = 7;
export const LINE_WIDTH = 2;

// Colors
export const COLOR_LIFE = 'var(--color-tertiary-400)';

export const BRANCH_COLORS = [
	'#3b82f6', // blue
	'#22c55e', // green
	'#f59e0b', // amber
	'#ef4444', // red
	'#a855f7', // purple
	'#06b6d4', // cyan
	'#ec4899', // pink
	'#14b8a6', // teal
	'#f97316', // orange
	'#8b5cf6' // violet
];
