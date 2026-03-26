<script lang="ts">
  import type { TimelineEntry } from "$interfaces/timelineEntry";
  import Link from "$components/Link.svelte";

  let { entry, accentSide = 'left' }: { entry: TimelineEntry; accentSide?: 'left' | 'right' } = $props();
  const isRight = $derived(accentSide === 'right');
</script>

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
