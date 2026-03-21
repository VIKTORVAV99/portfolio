<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";
  import { slugifyTag } from "$lib/blog";

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
        <a href="/blog/tag/{slugifyTag(tag)}" class="text-surface-300 hover:text-green-500 transition-colors">
          {tag}
        </a>
      {/each}
    </div>
  {/if}
</div>
