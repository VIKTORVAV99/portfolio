<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  import BlogPostCard from "$components/blog/BlogPostCard.svelte";
  import BlogPagination from "$components/blog/BlogPagination.svelte";
  import { SITE_URL } from "$lib/config";
  import { createBreadcrumbListSchema, createCollectionPageSchema, createItemListSchema } from "$lib/seo";
  import TitleText from "$components/TitleText.svelte";

  let { data }: { data: PageData } = $props();

  const baseURL = $derived(`${SITE_URL}/blog/tag/${data.tag}`);

  const canonicalURL = $derived(data.currentPage === 1
    ? baseURL
    : `${baseURL}?page=${data.currentPage}`);

  const prevURL = $derived(data.currentPage > 1
    ? (data.currentPage === 2 ? baseURL : `${baseURL}?page=${data.currentPage - 1}`)
    : undefined);

  const nextURL = $derived(data.currentPage < data.totalPages
    ? `${baseURL}?page=${data.currentPage + 1}`
    : undefined);

  const structuredData = $derived([
    createCollectionPageSchema({
      name: `Posts tagged "${data.displayTag}"`,
      description: `Blog posts tagged with "${data.displayTag}".`,
      url: canonicalURL,
      mainEntity: createItemListSchema(
        data.pagedPosts.map((post) => `${SITE_URL}/blog/${post.slug}`),
      ),
    }),
    createBreadcrumbListSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: `#${data.displayTag}` },
    ]),
  ]);
</script>

<SEO
  title={`Viktor Andersson | #${data.displayTag}${data.currentPage > 1 ? ` — Page ${data.currentPage}` : ""}`}
  description={`Blog posts tagged with "${data.displayTag}".`}
  canonicalURL={canonicalURL}
  prevURL={prevURL}
  nextURL={nextURL}
  structuredData={structuredData}
/>

<div class="page-container">
  <TitleText path={data.displayTag} prefix="#" subtitle={`Blog posts tagged with ${data.displayTag}`} />

  <section class="flex flex-col w-full">
    {#if data.pagedPosts.length === 0}
      <p class="text-surface-300 font-mono">No posts found for this tag.</p>
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
        <BlogPagination currentPage={data.currentPage} totalPages={data.totalPages} baseHref="/blog/tag/{data.tag}" />
      </div>
    {/if}
  </section>
</div>
