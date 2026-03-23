<script lang="ts">
  import { FALLBACK_HERO_IMAGE } from "$lib/config";
  import type { StructuredDataSchema } from "..";
  import { toJsonLd } from "..";

  let {
    title,
    description,
    canonicalURL,
    prevURL,
    nextURL,
    structuredData,
    noIndex = false,
    image = FALLBACK_HERO_IMAGE,
    type = "website",
  }: {
    title: string;
    description: string;
    canonicalURL?: string;
    prevURL?: string;
    nextURL?: string;
    structuredData?: StructuredDataSchema | StructuredDataSchema[];
    noIndex?: boolean;
    image?: string;
    type?: "website" | "article" | "profile" | string;
  } = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  {#if canonicalURL}
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:url" content={canonicalURL} />
  {/if}
  {#if prevURL}<link rel="prev" href={prevURL} />{/if}
  {#if nextURL}<link rel="next" href={nextURL} />{/if}

  {#if structuredData}
    {@html `<script type="application/ld+json">${toJsonLd(structuredData)}<` + `/script>`}
  {/if}

  <meta property="og:site_name" content="Viktor Andersson" />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />

  {#if image}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={image} />
    <meta property="og:image" content={image} />
  {:else}
    <meta name="twitter:card" content="summary" />
  {/if}

  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  {#if noIndex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}
</svelte:head>
