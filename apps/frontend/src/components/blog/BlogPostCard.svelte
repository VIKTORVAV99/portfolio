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

<li class="flex flex-col gap-2 border-b border-surface-700 last:border-none">
  <a href="/blog/{slug}" class="text-2xl font-bold text-surface-100 hover:text-green-500 transition-colors w-fit">
    {title}
  </a>

  <p class="text-surface-300 leading-relaxed text-lg max-w-3xl">
    {description}
  </p>

  <div class="flex flex-wrap items-center gap-2 text-sm font-mono text-surface-300">
    <time datetime={date}>
      {new Date(date).toISOString().split('T')[0]}
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
</li>
