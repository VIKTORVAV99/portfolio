<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  import BlogPostCard from "$components/blog/BlogPostCard.svelte";
  import BlogPagination from "$components/blog/BlogPagination.svelte";
  import { SITE_URL } from "$lib/config";
  import { createCollectionPageSchema, createItemListSchema } from "$lib/seo";
  import TitleText from "$components/TitleText.svelte";

  let { data }: { data: PageData } = $props();

  const canonicalURL = $derived(data.currentPage === 1
    ? `${SITE_URL}/blog`
    : `${SITE_URL}/blog?page=${data.currentPage}`);

  const prevURL = $derived(data.currentPage > 1
    ? (data.currentPage === 2 ? `${SITE_URL}/blog` : `${SITE_URL}/blog?page=${data.currentPage - 1}`)
    : undefined);

  const nextURL = $derived(data.currentPage < data.totalPages
    ? `${SITE_URL}/blog?page=${data.currentPage + 1}`
    : undefined);

  const structuredData = $derived(createCollectionPageSchema({
    name: "Blog",
    description: "Thoughts on software engineering, climate tech, and open source.",
    url: canonicalURL,
    mainEntity: createItemListSchema(
      data.pagedPosts.map((post) => `${SITE_URL}/blog/${post.slug}`),
    ),
  }));
</script>

<SEO
  title={`Viktor Andersson | Blog${data.currentPage > 1 ? ` — Page ${data.currentPage}` : ""}`}
  description="The blog section of Viktor Andersson's personal website..."
  canonicalURL={canonicalURL}
  prevURL={prevURL}
  nextURL={nextURL}
  structuredData={structuredData}
/>

<div class="page-container">

  <TitleText path="blog" subtitle="Thoughts on software engineering, climate tech, and open source" />

  <section class="flex flex-col w-full">
    {#if data.pagedPosts.length === 0}
      <p class="text-surface-300 font-mono">No posts found.</p>
    {:else}
      <ul class="flex flex-col gap-16">
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
