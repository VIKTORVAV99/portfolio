<script lang="ts">
	import type { TimelineEntry } from '$interfaces/timelineEntry';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronsDownUp from '@lucide/svelte/icons/chevrons-down-up';
	import Link from '$components/Link.svelte';

	let {
		entry,
		color,
		defaultOpen = false,
		accentSide = 'left'
	}: {
		entry: TimelineEntry;
		color: string;
		defaultOpen?: boolean;
		accentSide?: 'left' | 'right';
	} = $props();

	let isOpen = $state(false);
	$effect(() => {
		isOpen = defaultOpen;
	});
	const isRight = $derived(accentSide === 'right');
</script>

{#snippet timelineCard()}
	<p class="text-sm">{entry.title}</p>
	{#if entry.location}
		<div class="flex flex-wrap text-sm text-surface-300" class:justify-end={isRight}>
			<p>{entry.location}</p>
			{#if entry.employmentType}
				<span class="mx-1">|</span>
				<p>{entry.employmentType}</p>
			{:else if entry.degree}
				<span class="mx-1">|</span>
				<p>{entry.degree}</p>
			{/if}
		</div>
	{/if}
	{#if entry.description}
		<p class="text-sm mt-2 leading-normal text-surface-300">
			{entry.description}
		</p>
	{/if}
	{#if entry.link}
		<Link href={entry.link} mono class="text-sm mt-2 {isRight ? 'ml-auto' : ''}">
			{entry.linkLabel ?? entry.link}
		</Link>
	{/if}
{/snippet}

<div
	class="w-full rounded-lg bg-surface-800 overflow-hidden"
	style="{isRight ? 'border-right' : 'border-left'}: 4px solid {color}"
>
	<button
		onclick={() => isOpen = !isOpen}
		aria-expanded={isOpen}
		class="flex w-full items-center justify-between px-3 py-2 gap-2 cursor-pointer {isRight
			? 'text-right flex-row-reverse'
			: 'text-left'}"
	>
		<span class="text-lg font-medium truncate">{entry.organization}</span>
		{#if isOpen}
			<ChevronsDownUp size={16} class="shrink-0 text-surface-400" />
		{:else}
			<ChevronsUpDown size={16} class="shrink-0 text-surface-400" />
		{/if}
	</button>
	<div class="px-3 pb-2{isRight ? ' text-right' : ''}" class:hidden={!isOpen}>
		{@render timelineCard()}
	</div>
</div>
