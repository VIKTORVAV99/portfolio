<script lang="ts">
  import type { BlogPostMeta } from "$lib/blog";
  import BlogPostCard from "./BlogPostCard.svelte";
  import BlogPagination from "./BlogPagination.svelte";

  interface Props {
    posts: BlogPostMeta[];
    currentPage: number;
    totalPages: number;
    baseHref?: string;
  }

  let { posts, currentPage, totalPages, baseHref = "/blog" }: Props = $props();
</script>

<section class="flex flex-col w-full">
  {#if posts.length === 0}
    <p class="text-surface-300 font-mono">No posts found.</p>
  {:else}
    <ul class="flex flex-col gap-16">
      {#each posts as post}
        <BlogPostCard
          slug={post.slug}
          title={post.title}
          description={post.description}
          date={post.date}
          readingTime={post.readingTime}
          tags={post.tags}
        />
      {/each}
    </ul>

    <div class="flex justify-center mt-8">
      <BlogPagination {currentPage} {totalPages} {baseHref} />
    </div>
  {/if}
</section>
