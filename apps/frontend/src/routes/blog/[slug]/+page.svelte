<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/seo/components/SEO.svelte';
  import { SITE_URL } from '$lib/config';
  import PostNavLink from '$components/blog/PostNavLink.svelte';
  import BlogPostMeta from '$components/blog/BlogPostMeta.svelte';
  import AuthorBanner from '$components/blog/AuthorBanner.svelte';

  let { data }: { data: PageData } = $props();

  const prevURL = $derived(data.prevPost ? `${SITE_URL}/blog/${data.prevPost.slug}` : undefined);
  const nextURL = $derived(data.nextPost ? `${SITE_URL}/blog/${data.nextPost.slug}` : undefined);
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

<article class="prose max-w-prose mx-auto my-16 flex flex-col gap-8">
  <header class="flex flex-col gap-3">
    <h1>{data.metadata.title}</h1>
    <BlogPostMeta date={data.metadata.date} lastUpdated={data.metadata.last_updated} readingTime={data.readingTime} tags={data.metadata.tags} />
    <AuthorBanner />
  </header>
  <data.component />
  {#if data.prevPost || data.nextPost}
    <footer class="w-full flex justify-between items-start gap-4" aria-label="Post navigation">
      {#if data.prevPost}
        <PostNavLink href="/blog/{data.prevPost.slug}" title={data.prevPost.title} direction="prev" />
      {:else}
        <div></div>
      {/if}
      {#if data.nextPost}
        <PostNavLink href="/blog/{data.nextPost.slug}" title={data.nextPost.title} direction="next" />
      {/if}
    </footer>
  {/if}
</article>
