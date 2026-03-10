// Layout constants
export const ORIGIN_YEAR = 1999;
export const CURRENT_YEAR = new Date().getFullYear();
export const PX_PER_YEAR = 100;
export const PX_PER_YEAR_MOBILE = 60;
export const TOTAL_YEARS = CURRENT_YEAR - ORIGIN_YEAR + 1;
export const TOTAL_HEIGHT = TOTAL_YEARS * PX_PER_YEAR;
export const MIN_SPAN = 2;
export const COMPACT_CARD_SPAN = 3;
export const LANE_SPACING_MOBILE = 14;

// Graph constants
export const LANE_SPACING = 40;
export const NODE_RADIUS = 7;
export const LINE_WIDTH = 2;
export const FORK_CURVE_HEIGHT = 40;

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
