<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";
  import { slugifyTag } from "$lib/blog";

  interface Props {
    date: string;
    lastUpdated?: string;
    readingTime?: number;
    tags?: string[];
  }

  let { date, lastUpdated, readingTime, tags }: Props = $props();
  const showUpdated = $derived(lastUpdated && formatDate(lastUpdated) !== formatDate(date));
</script>

<div class="flex flex-wrap items-center gap-2 text-sm font-mono text-surface-300">
  <time datetime={date}>
    {formatDate(date)}
  </time>

  {#if showUpdated}
    <span class="opacity-40">|</span>
    <span>Updated: <time datetime={lastUpdated}>{formatDate(lastUpdated!)}</time></span>
  {/if}

  {#if readingTime}
    <span class="opacity-40">|</span>
    <span>{readingTime} min read</span>
  {/if}

  {#if tags?.length}
    <span class="opacity-40">|</span>
    <div class="flex gap-4">
      {#each tags as tag}
        <a href="/blog/tag/{slugifyTag(tag)}" class="text-surface-300 hover:text-green-500 transition-colors">
          #{tag}
        </a>
      {/each}
    </div>
  {/if}
</div>
