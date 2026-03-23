<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/seo/components/SEO.svelte';
  import { SITE_URL } from '$lib/config';
  import PostNavLink from '$components/blog/PostNavLink.svelte';
  import PostDate from '$components/blog/PostDate.svelte';
  import PostTags from '$components/blog/PostTags.svelte';
  import AuthorBanner from '$components/blog/AuthorBanner.svelte';

  let { data }: { data: PageData } = $props();

  const prevURL = $derived(data.nextPost ? `${SITE_URL}/blog/${data.nextPost.slug}` : undefined);
  const nextURL = $derived(data.prevPost ? `${SITE_URL}/blog/${data.prevPost.slug}` : undefined);
</script>

<SEO
  title={data.metadata.title}
  description={data.metadata.description}
  type="article"
  canonicalURL={data.postUrl}
  structuredData={data.structuredData}
  prevURL={prevURL}
  nextURL={nextURL}
/>

<article class="prose w-full max-w-prose mx-auto mt-16 flex flex-1 flex-col gap-8">
  <header class="flex flex-col gap-3">
    <h1>{data.metadata.title}</h1>
    <PostDate date={data.metadata.date} lastUpdated={data.metadata.last_updated} readingTime={data.readingTime} />
    <PostTags tags={data.metadata.tags} />
    <AuthorBanner />
  </header>
  <data.component />
  {#if data.prevPost || data.nextPost}
    <footer class="mt-auto w-full flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4 md:gap-8" aria-label="Post navigation">
      <div class="flex flex-col md:contents gap-4 max-w-2/3">
        {#if data.prevPost}
          <PostNavLink href="/blog/{data.prevPost.slug}" title={data.prevPost.title} direction="prev" />
        {/if}
        {#if data.nextPost}
          <PostNavLink href="/blog/{data.nextPost.slug}" title={data.nextPost.title} direction="next" />
        {/if}
      </div>
    </footer>
  {/if}
</article>
