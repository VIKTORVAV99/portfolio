<script lang="ts">
	import { Collapsible } from 'bits-ui';
	import type { BranchGroup } from './types';
	import { entryStartAbsMonth, entryEndAbsMonth } from './types';
	import TimelineCard from './TimelineCard.svelte';
	import TimelineEventCard from './TimelineEventCard.svelte';

	let {
		group,
		open,
		onOpenChange
	}: {
		group: BranchGroup;
		open: boolean;
		onOpenChange: (v: boolean) => void;
	} = $props();

	function fmtYearMonth(year: number | undefined, month: number | null | undefined): string {
		if (year == null) return '';
		if (month != null) return `${year}/${String(month).padStart(2, '0')}`;
		return `${year}`;
	}

	const org = $derived(group.nodes[0].entry.organization);
	const hasOngoing = $derived(group.nodes.some((n) => n.entry.endYear === null));
	const earliestNode = $derived(
		group.nodes.reduce((a, b) =>
			entryStartAbsMonth(a.entry) <= entryStartAbsMonth(b.entry) ? a : b
		)
	);
	const latestNode = $derived(
		group.nodes.reduce((a, b) =>
			entryEndAbsMonth(a.entry) >= entryEndAbsMonth(b.entry) ? a : b
		)
	);
	const startStr = $derived(
		fmtYearMonth(earliestNode.entry.startYear, earliestNode.entry.startMonth)
	);
	const endStr = $derived(
		hasOngoing
			? 'Present'
			: fmtYearMonth(
					latestNode.entry.endYear ?? latestNode.entry.startYear,
					latestNode.entry.endYear != null ? latestNode.entry.endMonth : latestNode.entry.startMonth
				)
	);
	const dateStr = $derived(startStr === endStr ? startStr : `${startStr} — ${endStr}`);
</script>

<Collapsible.Root class="group w-full" {open} {onOpenChange}>
	<TimelineEventCard color={group.color}>
		<span
			class="block text-xs font-semibold uppercase tracking-[0.05em] text-surface-400 dark:text-surface-500 mb-1"
			>{dateStr}</span
		>
		<h3 class="text-base font-bold leading-[1.4]">{group.nodes.length} positions</h3>
		<p class="text-sm text-surface-500 dark:text-surface-400">{org}</p>
		<Collapsible.Trigger
			class="flex items-center gap-1 mt-2 py-1 text-xs font-semibold text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-transparent border-none cursor-pointer"
		>
			Show details
			<span
				class="inline-block transition-transform duration-200 text-sm group-data-[state=open]:rotate-90"
				aria-hidden="true">›</span
			>
		</Collapsible.Trigger>
		<Collapsible.Content>
			{#each group.nodes as node}
				<div class="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
					<TimelineCard entry={node.entry} />
				</div>
			{/each}
		</Collapsible.Content>
	</TimelineEventCard>
</Collapsible.Root>
