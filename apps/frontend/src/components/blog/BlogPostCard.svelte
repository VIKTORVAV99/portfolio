<script lang="ts">
  import PostDate from "./PostDate.svelte";
  import PostTags from "./PostTags.svelte";

  interface Props {
    slug: string;
    title: string;
    description: string;
    date: string;
    readingTime?: number;
    tags?: string[];
    last: boolean;
  }

  let { slug, title, description, date, readingTime, tags, last }: Props = $props();
</script>

<li>
  <article class="flex flex-col gap-2">
    <a href="/blog/{slug}" class="text-2xl font-bold text-surface-100 hover:text-green-500 transition-colors w-fit">
      {title}
    </a>

    <PostDate {date} {readingTime} />

    <p class="text-surface-300 leading-relaxed text-base md:text-lg max-w-3xl">
      {description}
    </p>

    <PostTags {tags} />
  </article>
  {#if !last}
    <hr class="border-surface-700 mt-4" />
  {/if}
</li>
