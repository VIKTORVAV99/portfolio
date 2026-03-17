<script lang="ts">
  interface Props {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags?: string[];
  }

  let { slug, title, description, date, tags }: Props = $props();
</script>

<li class="flex flex-col gap-2 border-b border-white/5 last:border-none group">
  <a href="/blog/{slug}" class="text-2xl font-bold text-surface-100 group-hover:text-green-500 transition-colors w-fit">
    {title}
  </a>

  <p class="text-surface-300 leading-relaxed text-lg max-w-3xl">
    {description}
  </p>

  <div class="flex flex-wrap items-center gap-3 text-sm font-mono text-surface-500 mt-2">
    <time datetime={date}>
      {new Date(date).toISOString().split('T')[0]}
    </time>

    {#if tags?.length}
      <span class="opacity-40">|</span>
      <div class="flex gap-3">
        {#each tags as tag}
          <span class="text-surface-500 hover:text-surface-300 transition-colors cursor-default">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</li>
