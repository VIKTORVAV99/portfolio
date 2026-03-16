<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/seo/components/SEO.svelte';

  let { data }: { data: PageData } = $props();
</script>

<SEO
  title={data.metadata.title}
  description={data.metadata.description}
  type="article"
  structuredData={data.structuredData}
/>

<article class="prose max-w-prose mx-auto my-16 flex flex-col gap-8">
  <div class="flex flex-col gap-2">
    <h1>{data.metadata.title}</h1>
    <time class="text-sm text-secondary-400" datetime={data.metadata.date}>
      {data.metadata.date
        ? new Date(data.metadata.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : ''}
    </time>
  </div>
  <data.component />
</article>
