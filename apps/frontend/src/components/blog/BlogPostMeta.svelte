<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";

  interface Props {
    date: string;
    tags?: string[];
  }

  let { date, tags }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2 text-sm font-mono text-surface-300">
  <time datetime={date}>
    {formatDate(date)}
  </time>

  {#if tags?.length}
    <span class="opacity-40">|</span>
    <div class="flex gap-4">
      {#each tags as tag}
        <span class="text-surface-300 hover:text-surface-100 transition-colors cursor-default">
          {tag}
        </span>
      {/each}
    </div>
  {/if}
</div>
