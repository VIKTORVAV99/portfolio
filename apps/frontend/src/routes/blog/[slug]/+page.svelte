<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/seo/components/SEO.svelte';
  import { SITE_URL } from '$lib/config';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';

  let { data }: { data: PageData } = $props();

  const prevURL = $derived(data.prevPost ? `${SITE_URL}/blog/${data.prevPost.slug}` : undefined);
  const nextURL = $derived(data.nextPost ? `${SITE_URL}/blog/${data.nextPost.slug}` : undefined);
</script>

<SEO
  title={data.metadata.title}
  description={data.metadata.description}
  type="article"
  structuredData={data.structuredData}
  prevURL={prevURL}
  nextURL={nextURL}
/>

<article class="prose max-w-prose mx-auto my-16 flex flex-col gap-8">
  <div class="flex flex-col gap-2">
    <h1>{data.metadata.title}</h1>
    <time class="text-sm text-secondary-400" datetime={data.metadata.date}>
      {data.metadata.date
        ? new Date(data.metadata.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : ''}
    </time>
  </div>
  <data.component />
</article>

{#if data.prevPost || data.nextPost}
  <nav class="max-w-prose mx-auto w-full flex justify-between items-start gap-4 mb-16" aria-label="Post navigation">
    {#if data.prevPost}
      <a href="/blog/{data.prevPost.slug}" class="group flex items-center gap-2 text-surface-300 hover:text-green-500 transition-colors">
        <ChevronLeft size={16} />
        <div class="flex flex-col">
          <span class="text-xs font-mono uppercase tracking-wide">Newer</span>
          <span class="text-sm text-surface-300 group-hover:text-green-500 transition-colors">{data.prevPost.title}</span>
        </div>
      </a>
    {:else}
      <div></div>
    {/if}
    {#if data.nextPost}
      <a href="/blog/{data.nextPost.slug}" class="group flex items-center gap-2 text-surface-300 hover:text-green-500 transition-colors text-right ml-auto">
        <div class="flex flex-col items-end">
          <span class="text-xs font-mono uppercase tracking-wide">Older</span>
          <span class="text-sm text-surface-300 group-hover:text-green-500 transition-colors">{data.nextPost.title}</span>
        </div>
        <ChevronRight size={16} />
      </a>
    {/if}
  </nav>
{/if}
