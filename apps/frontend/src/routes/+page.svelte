<script lang="ts">
  import type { PageData } from "./$types";
  import TitleText from "$components/TitleText.svelte";
  import ProfileCard from "$components/ProfileCard.svelte";
  import SEO from "$lib/seo/components/SEO.svelte";
  import Highlight from "$components/Highlight.svelte";
  import { SITE_URL } from "$lib/config";

  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="Viktor Andersson - Software Engineer"
  description="Personal website for Viktor Andersson, Software Engineer at Electricity Maps and Digital Design and Innovation graduate"
  canonicalURL={SITE_URL}
  structuredData={data.structuredData}
/>
<div class="page-container">
  <TitleText path="" subtitle="Welcome" />
  <ProfileCard />
  <nav class="font-mono text-lg flex flex-col w-full">
    <span aria-hidden="true"><Highlight>~</Highlight>/</span>
    <a href="/about" class="underline-offset-4"><span aria-hidden="true">├── </span>about</a>
    <a href="/history" class="underline-offset-4"><span aria-hidden="true">├── </span>history</a>
    <a href="/blog" class="underline-offset-4"><span aria-hidden="true">└── </span>blog</a>
  </nav>
</div>
