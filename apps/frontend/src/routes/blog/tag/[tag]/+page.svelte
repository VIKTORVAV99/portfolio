<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  import BlogPostList from "$components/blog/BlogPostList.svelte";
  import { SITE_URL } from "$lib/config";
  import { createBreadcrumbListSchema, createCollectionPageRefSchema, createCollectionPageSchema, createDefinedTermSchema, createItemListSchema } from "$lib/seo";
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

  const totalPosts = $derived(data.allSlugs.length);

  const description = $derived(`Browse ${totalPosts} blog ${totalPosts === 1 ? "post" : "posts"} tagged with "${data.displayTag}".`);

  const structuredData = $derived([
    createCollectionPageSchema({
      name: `Posts tagged "${data.displayTag}"`,
      description,
      url: canonicalURL,
      mainEntity: createItemListSchema(
        data.allSlugs.map((slug) => `${SITE_URL}/blog/${slug}`),
      ),
      isPartOf: createCollectionPageRefSchema(`${SITE_URL}/blog`),
      about: createDefinedTermSchema(data.displayTag),
    }),
    createBreadcrumbListSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: `#${data.displayTag}` },
    ]),
  ]);
</script>

<SEO
  noIndex={totalPosts < 4}
  title={`Viktor Andersson | #${data.displayTag}${data.currentPage > 1 ? ` — Page ${data.currentPage}` : ""}`}
  description={description}
  canonicalURL={canonicalURL}
  prevURL={prevURL}
  nextURL={nextURL}
  structuredData={structuredData}
/>

<div class="page-container">
  <TitleText path={data.displayTag} prefix="#" subtitle={`Blog posts tagged with ${data.displayTag}`} />

  <BlogPostList posts={data.pagedPosts} currentPage={data.currentPage} totalPages={data.totalPages} baseHref="/blog/tag/{data.tag}" />
</div>
