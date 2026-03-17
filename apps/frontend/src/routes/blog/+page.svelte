<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  import BlogPostCard from "$components/blog/BlogPostCard.svelte";
  import BlogPagination from "$components/blog/BlogPagination.svelte";
  import { SITE_URL } from "$lib/config";
  import TitleText from "$components/TitleText.svelte";

  let { data }: { data: PageData } = $props();

  const canonicalURL = $derived(data.currentPage === 1
    ? `${SITE_URL}/blog`
    : `${SITE_URL}/blog?page=${data.currentPage}`);

  const prevURL = $derived(data.currentPage > 1
    ? (data.currentPage === 2 ? `${SITE_URL}/blog` : `${SITE_URL}/blog?page=${data.currentPage - 1}`)
    : null);

  const nextURL = $derived(data.currentPage < data.totalPages
    ? `${SITE_URL}/blog?page=${data.currentPage + 1}`
    : null);
</script>

<SEO
  title={data.currentPage === 1 ? "Viktor Andersson | Blog" : `Viktor Andersson | Blog — Page ${data.currentPage}`}
  description="The blog section of Viktor Andersson's personal website..."
  canonicalURL={canonicalURL}
  prevURL={prevURL}
  nextURL={nextURL}
/>

<div class="flex flex-col gap-8 justify-start pt-8 items-center max-w-4xl mx-auto w-full px-4">

  <TitleText path="blog" subtitle="Thoughts on software engineering, climate tech, and open source." />

  <section class="flex flex-col w-full">
    {#if data.pagedPosts.length === 0}
      <p class="text-surface-500 font-mono">No posts found.</p>
    {:else}
      <ul class="flex flex-col">
        {#each data.pagedPosts as post}
          <BlogPostCard
            slug={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            tags={post.tags}
          />
        {/each}
      </ul>

      <div class="flex justify-center mt-8">
        <BlogPagination currentPage={data.currentPage} totalPages={data.totalPages} />
      </div>
    {/if}
  </section>
</div>
