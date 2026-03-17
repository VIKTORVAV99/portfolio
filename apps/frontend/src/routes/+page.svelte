<script lang="ts">
  import type { PageData } from "./$types";
  import TitleText from "$components/TitleText.svelte";
  import ProfileCard from "$components/ProfileCard.svelte";
  import SEO from "$lib/seo/components/SEO.svelte";
  import Highlight from "$components/Highlight.svelte";

  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="Viktor Andersson - Software Engineer"
  description="Personal website for Viktor Andersson, Software Engineer at Electricity Maps and Digital Design and Innovation graduate"
  canonicalURL="https://viktor.andersson.tech"
  structuredData={data.structuredData}
/>
<div class="flex flex-col gap-8 justify-start pt-8 items-center max-w-4xl mx-auto w-full">
  <TitleText path="" subtitle="Welcome" />
  <ProfileCard />
  <nav class="font-mono text-lg flex flex-col w-full">
    <span><Highlight>~</Highlight>/</span>
    <a href="/about" class="underline decoration-green-500/50 underline-offset-4">├── about</a>
    <a href="/history" class="underline decoration-green-500/50 underline-offset-4">├── history</a>
    <a href="/blog" class="underline decoration-green-500/50 underline-offset-4">└── blog</a>
  </nav>
</div>
