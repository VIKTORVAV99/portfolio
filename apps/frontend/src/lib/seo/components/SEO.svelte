<script lang="ts">
  import type { StructuredDataSchema } from "..";
  import { toJsonLd } from "..";

  let {
    title,
    description,
    canonicalURL,
    structuredData,
  }: {
    title: string;
    description: string;
    canonicalURL?: string;
    structuredData?: StructuredDataSchema;
  } = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  {#if canonicalURL}
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:url" content={canonicalURL} />
  {/if}

  {#if structuredData}
    {@html `<script type="application/ld+json">${toJsonLd(structuredData)}<` + `/script>`}
  {/if}

  <!-- Additional metadata tags for open graph, Twitter cards, etc. -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>
