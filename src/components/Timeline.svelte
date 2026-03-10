<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';

	let { entries }: { entries: TimelineEntry[] } = $props();

	const ORIGIN_YEAR = 1999;
	const CURRENT_YEAR = new Date().getFullYear();
	const PX_PER_YEAR = 100;
	const TOTAL_YEARS = CURRENT_YEAR - ORIGIN_YEAR + 1;
	const MIN_SPAN = 2;

	function yearToRow(year: number): number {
		return TOTAL_YEARS - (year - ORIGIN_YEAR);
	}

	function formatDate(entry: TimelineEntry): string {
		if (!entry.showDates || entry.startYear == null) return '';
		if (entry.endYear === null) return `${entry.startYear} — Present`;
		if (entry.endYear != null && entry.endYear !== entry.startYear)
			return `${entry.startYear} — ${entry.endYear}`;
		return `${entry.startYear}`;
	}

	// Year markers every 5 years
	const yearMarkers = $derived.by(() => {
		const markers: number[] = [];
		const first = Math.ceil(ORIGIN_YEAR / 5) * 5;
		for (let y = first; y <= CURRENT_YEAR; y += 5) {
			markers.push(y);
		}
		return markers;
	});

	interface PositionedEntry {
		entry: TimelineEntry;
		rowStart: number;
		rowEnd: number;
		side: 'left' | 'right';
	}

	// A lane is either a single entry or a merged group of entries
	interface TimelineLane {
		entries: PositionedEntry[];
		rowStart: number;
		rowEnd: number;
		side: 'left' | 'right';
	}

	const lanes = $derived.by(() => {
		// Sort newest-first so the top of the timeline gets placed first
		const sorted = [...entries].sort((a, b) => {
			return (b.startYear ?? ORIGIN_YEAR) - (a.startYear ?? ORIGIN_YEAR);
		});

		const positioned: PositionedEntry[] = [];
		let leftEnd = 0;
		let rightEnd = 0;
		let prefer: 'left' | 'right' = 'left';
		const groupSides: Record<string, 'left' | 'right'> = {};

		for (const entry of sorted) {
			const start = entry.startYear ?? ORIGIN_YEAR;
			const end = entry.endYear === null ? CURRENT_YEAR : (entry.endYear ?? start);

			const rowStart = yearToRow(end);
			let rowEnd = yearToRow(start) + 1;
			if (rowEnd - rowStart < MIN_SPAN) rowEnd = rowStart + MIN_SPAN;

			let side: 'left' | 'right';

			if (entry.group && groupSides[entry.group]) {
				side = groupSides[entry.group];
			} else {
				const fitsLeft = rowStart >= leftEnd;
				const fitsRight = rowStart >= rightEnd;

				if (fitsLeft && fitsRight) {
					side = prefer;
					prefer = prefer === 'left' ? 'right' : 'left';
				} else if (fitsLeft) {
					side = 'left';
				} else {
					side = 'right';
				}

				if (entry.group) {
					groupSides[entry.group] = side;
				}
			}

			if (side === 'left') leftEnd = Math.max(leftEnd, rowEnd);
			else rightEnd = Math.max(rightEnd, rowEnd);

			positioned.push({ entry, rowStart, rowEnd, side });
		}

		// Merge grouped entries into single lanes
		const groupLanes: Record<string, TimelineLane> = {};
		const result: TimelineLane[] = [];

		for (const pe of positioned) {
			if (pe.entry.group) {
				if (!groupLanes[pe.entry.group]) {
					const lane: TimelineLane = {
						entries: [pe],
						rowStart: pe.rowStart,
						rowEnd: pe.rowEnd,
						side: pe.side
					};
					groupLanes[pe.entry.group] = lane;
					result.push(lane);
				} else {
					const lane = groupLanes[pe.entry.group];
					lane.entries.push(pe);
					lane.rowStart = Math.min(lane.rowStart, pe.rowStart);
					lane.rowEnd = Math.max(lane.rowEnd, pe.rowEnd);
				}
			} else {
				result.push({
					entries: [pe],
					rowStart: pe.rowStart,
					rowEnd: pe.rowEnd,
					side: pe.side
				});
			}
		}

		return result;
	});

	// Collect all dots (one per entry)
	const allDots = $derived(
		lanes.flatMap((lane) => lane.entries.map((pe) => ({ rowStart: pe.rowStart, type: pe.entry.type })))
	);
</script>

<div class="timeline-grid" style="grid-template-rows: repeat({TOTAL_YEARS}, {PX_PER_YEAR}px);">
	<!-- Spine -->
	<div class="spine" style="grid-row: 1 / {TOTAL_YEARS + 1};"></div>

	<!-- Year markers -->
	{#each yearMarkers as year}
		<div class="year-marker" style="grid-row: {yearToRow(year)};">
			<span>{year}</span>
		</div>
	{/each}

	<!-- Events: dots -->
	{#each allDots as dot}
		<div class="dot dot-{dot.type}" style="grid-row: {dot.rowStart};"></div>
	{/each}

	<!-- Events: lanes -->
	{#each lanes as lane}
		<div
			class="event-lane {lane.side === 'left' ? 'lane-left' : 'lane-right'}"
			style="grid-row: {lane.rowStart} / {lane.rowEnd};"
		>
			{#if lane.entries.length === 1 && lane.entries[0].entry.type === 'life' && !lane.entries[0].entry.showDates}
				<div class="life-chip sticky-card">
					<span class="font-bold">{lane.entries[0].entry.title}</span>
				</div>
			{:else if lane.entries.length === 1}
				{@const entry = lane.entries[0].entry}
				<div class="event-card card-{entry.type} sticky-card">
					{#if entry.showDates}
						<span class="date-label">{formatDate(entry)}</span>
					{/if}
					<h3 class="card-title">{entry.title}</h3>
					<p class="card-org">{entry.organization}</p>
					{#if entry.description}
						<p class="card-desc">{entry.description}</p>
					{/if}
				</div>
			{:else}
				<!-- Grouped entries: single sticky wrapper -->
				<div class="group-stack sticky-card">
					{#each lane.entries as pe, i}
						{#if i > 0}
							<div class="group-connector group-connector-{pe.entry.type}"></div>
						{/if}
						<div class="event-card card-{pe.entry.type}">
							{#if pe.entry.showDates}
								<span class="date-label">{formatDate(pe.entry)}</span>
							{/if}
							<h3 class="card-title">{pe.entry.title}</h3>
							<p class="card-org">{pe.entry.organization}</p>
							{#if pe.entry.description}
								<p class="card-desc">{pe.entry.description}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<!-- Legend -->
<div class="legend">
	<span class="legend-item">
		<span class="legend-swatch dot-work"></span> Work
	</span>
	<span class="legend-item">
		<span class="legend-swatch dot-education"></span> Education
	</span>
	<span class="legend-item">
		<span class="legend-swatch dot-life"></span> Life
	</span>
</div>

<style>
	.timeline-grid {
		display: grid;
		grid-template-columns: 1fr 3rem 1fr;
		width: 100%;
		max-width: 56rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Spine */
	.spine {
		grid-column: 2;
		justify-self: center;
		width: 2px;
		background: var(--color-surface-200);
	}

	:global(html.dark) .spine {
		background: var(--color-surface-700);
	}

	/* Year markers */
	.year-marker {
		grid-column: 2;
		z-index: 2;
		justify-self: center;
		align-self: center;
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--color-surface-400);
		background: var(--color-surface-50);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		letter-spacing: 0.05em;
	}

	:global(html.dark) .year-marker {
		color: var(--color-surface-500);
		background: var(--color-surface-950);
	}

	/* Dots */
	.dot {
		grid-column: 2;
		z-index: 3;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		justify-self: center;
		align-self: start;
		margin-top: 3px;
		box-shadow: 0 0 0 3px var(--color-surface-50);
	}

	:global(html.dark) .dot {
		box-shadow: 0 0 0 3px var(--color-surface-950);
	}

	.dot-work {
		background: var(--color-secondary-500);
	}
	.dot-education {
		background: var(--color-success-500);
	}
	.dot-life {
		background: var(--color-tertiary-400);
	}

	:global(html.dark) .dot-life {
		background: var(--color-tertiary-500);
	}

	/* Event lanes */
	.lane-left {
		grid-column: 1;
		display: flex;
		justify-content: flex-end;
		padding-right: 1.25rem;
	}

	.lane-right {
		grid-column: 3;
		display: flex;
		justify-content: flex-start;
		padding-left: 1.25rem;
	}

	/* Sticky card behavior — sticks near bottom as you scroll up through history */
	.sticky-card {
		position: sticky;
		top: 6rem;
		align-self: start;
	}

	/* Card */
	.event-card {
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		background: var(--color-surface-100);
		max-width: 22rem;
		width: 100%;
		border-left: 4px solid transparent;
	}

	:global(html.dark) .event-card {
		background: var(--color-surface-800);
	}

	/* Group stack: single sticky container for all cards in a group */
	.group-stack {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		max-width: 22rem;
		width: 100%;
	}

	.group-stack .event-card {
		max-width: none;
	}

	.group-connector {
		width: 2px;
		height: 1.25rem;
		align-self: center;
		border-radius: 1px;
	}

	.group-connector-work {
		background: var(--color-secondary-500);
		opacity: 0.4;
	}

	.group-connector-education {
		background: var(--color-success-500);
		opacity: 0.4;
	}

	.group-connector-life {
		background: var(--color-tertiary-500);
		opacity: 0.4;
	}

	.card-work {
		border-left-color: var(--color-secondary-500);
	}
	.card-education {
		border-left-color: var(--color-success-500);
	}
	.card-life {
		border-left-color: var(--color-tertiary-500);
	}

	.date-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-surface-400);
		margin-bottom: 0.25rem;
	}

	:global(html.dark) .date-label {
		color: var(--color-surface-500);
	}

	.card-title {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
	}

	.card-org {
		font-size: 0.875rem;
		color: var(--color-surface-500);
	}

	:global(html.dark) .card-org {
		color: var(--color-surface-400);
	}

	.card-desc {
		font-size: 0.875rem;
		margin-top: 0.5rem;
		color: var(--color-surface-400);
		line-height: 1.5;
	}

	:global(html.dark) .card-desc {
		color: var(--color-surface-500);
	}

	/* Life event chip */
	.life-chip {
		display: inline-flex;
		padding: 0.375rem 1.25rem;
		border-radius: 9999px;
		border: 1px solid var(--color-surface-200);
		background: var(--color-surface-100);
		font-size: 0.875rem;
	}

	:global(html.dark) .life-chip {
		border-color: var(--color-surface-700);
		background: var(--color-surface-800);
	}

	/* Legend */
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1.5rem;
		margin-bottom: 2rem;
		font-size: 0.875rem;
		color: var(--color-surface-600);
	}

	:global(html.dark) .legend {
		color: var(--color-surface-300);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-swatch {
		display: inline-block;
		width: 0.625rem;
		height: 0.625rem;
		border-radius: 50%;
	}

	/* Mobile: single column */
	@media (max-width: 639px) {
		.timeline-grid {
			grid-template-columns: 2.5rem 1fr;
		}

		.lane-left,
		.lane-right {
			grid-column: 2;
			justify-content: flex-start;
			padding-left: 0.75rem;
			padding-right: 0;
		}

		.event-card {
			max-width: none;
		}
	}
</style>
