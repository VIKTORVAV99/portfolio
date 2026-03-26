<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  import BlogPostList from "$components/blog/BlogPostList.svelte";
  import { SITE_URL } from "$lib/config";
  import { createBreadcrumbListSchema, createCollectionPageSchema, createItemListSchema } from "$lib/seo";
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

  const structuredData = $derived([
    createCollectionPageSchema({
      name: "Blog",
      description: "Thoughts on software engineering, climate tech, and open source.",
      url: canonicalURL,
      mainEntity: createItemListSchema(
        data.allSlugs.map((slug) => `${SITE_URL}/blog/${slug}`),
      ),
    }),
    createBreadcrumbListSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog" },
    ]),
  ]);
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

  <BlogPostList posts={data.pagedPosts} currentPage={data.currentPage} totalPages={data.totalPages} />
</div>
