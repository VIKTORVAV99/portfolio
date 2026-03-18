<script lang="ts">
  import type { TimelineEntry } from "$interfaces/timelineEntry";

  let { entry }: { entry: TimelineEntry } = $props();
</script>

<h3>{entry.organization}</h3>

<p class="p">{entry.title}</p>

{#if entry.location}
  <div class="flex text-surface-300">
    <p class=" ">{entry.location}</p>
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
