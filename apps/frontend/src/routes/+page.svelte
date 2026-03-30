<script lang="ts">
  import type { PageData } from "./$types";
  import TitleText from "$components/TitleText.svelte";
  import ProfileCard from "$components/ProfileCard.svelte";
  import SEO from "$lib/seo/components/SEO.svelte";
  import Highlight from "$components/Highlight.svelte";
  import { SITE_URL } from "$lib/config";

  let { data }: { data: PageData } = $props();

  const blogSlugs = $derived(data.blogSlugs);
</script>

{#snippet treeLink(href: string, label: string, isLast: boolean, indent: boolean = false)}<a {href} class="underline-offset-4{indent ? ' pl-8' : ''}"><span class="inline-block text-surface-500" aria-hidden="true">{isLast ? '└──' : '├──'}</span>{label}</a>{/snippet}

<SEO
  title="Viktor Andersson - Software Engineer"
  description="Personal website for Viktor Andersson, Software Engineer at Electricity Maps and Digital Design and Innovation graduate"
  canonicalURL={SITE_URL}
  structuredData={data.structuredData}
/>
<div class="page-container">
  <TitleText path="" subtitle="Welcome" />
  <ProfileCard />
  <nav class="font-mono text-lg flex flex-col w-full leading-tight">
    <span><Highlight>~</Highlight>/</span>
    {@render treeLink("/about", "about", false)}
    {@render treeLink("/history", "history", false)}
    {@render treeLink("/blog", "blog/", true)}
    {#each blogSlugs as slug}
      {@render treeLink(`/blog/${slug}`, slug, false, true)}
    {/each}
    {@render treeLink("/blog", "...", true, true)}
  </nav>
</div>
