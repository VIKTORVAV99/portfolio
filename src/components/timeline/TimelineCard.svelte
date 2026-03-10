<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import { formatDate } from './types';

	let { entry }: { entry: TimelineEntry } = $props();
</script>

{#if entry.showDates}
	<span class="date-label">{formatDate(entry)}</span>
{/if}
<h3 class="card-title">{entry.title}</h3>
<p class="card-org">{entry.organization}</p>
{#if entry.location}
	<p class="card-location">{entry.location}</p>
{/if}
{#if entry.description}
	<p class="card-desc">{entry.description}</p>
{/if}

<style>
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

	.card-location {
		font-size: 0.8rem;
		color: var(--color-surface-400);
	}

	:global(html.dark) .card-location {
		color: var(--color-surface-500);
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
</style>
