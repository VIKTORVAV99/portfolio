<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import { formatDate } from './types';

	let { entry }: { entry: TimelineEntry } = $props();
</script>

{#if entry.showDates}
	<span
		class="block text-xs font-semibold uppercase tracking-[0.05em] text-surface-400 dark:text-surface-500 mb-1"
		>{formatDate(entry)}</span
	>
{/if}
{#if entry.degree}
	<p class="text-xs text-surface-400 dark:text-surface-500 mb-0.5">{entry.degree}</p>
{/if}
<h3 class="text-base font-bold leading-[1.4]">{entry.title}</h3>
<p class="text-sm text-surface-500 dark:text-surface-400">{entry.organization}</p>
{#if entry.employmentType}
	<p class="text-xs text-surface-400 dark:text-surface-500">{entry.employmentType}</p>
{/if}
{#if entry.location}
	<p class="text-[0.8rem] text-surface-400 dark:text-surface-500">{entry.location}</p>
{/if}
{#if entry.description}
	<p class="text-sm mt-2 leading-normal text-surface-400 dark:text-surface-500">{entry.description}</p>
{/if}
