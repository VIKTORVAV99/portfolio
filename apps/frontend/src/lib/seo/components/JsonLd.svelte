<script lang="ts">
  import { toJsonLd } from '$lib/seo';
  import type { PersonSchema } from '$lib/seo';

  let { data }: { data: { structuredData: PersonSchema } } = $props();
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${toJsonLd(data.structuredData)}<` + `/script>`}
</svelte:head>