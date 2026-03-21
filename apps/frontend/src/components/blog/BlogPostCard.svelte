<script lang="ts">
  import BlogPostMeta from "./BlogPostMeta.svelte";

  interface Props {
    slug: string;
    title: string;
    description: string;
    date: string;
    readingTime?: number;
    tags?: string[];
  }

  let { slug, title, description, date, readingTime, tags }: Props = $props();
</script>

<li class="flex flex-col gap-2 border-b border-surface-700 last:border-none">
  <a href="/blog/{slug}" class="text-2xl font-bold text-surface-100 hover:text-green-500 transition-colors w-fit">
    {title}
  </a>

  <p class="text-surface-300 leading-relaxed text-lg max-w-3xl">
    {description}
  </p>

  <BlogPostMeta {date} {readingTime} {tags} />
</li>
