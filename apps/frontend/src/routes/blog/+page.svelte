<script lang="ts">
  import type { PageData } from './$types';
  import SEO from "$lib/seo/components/SEO.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="Blog"
  description="The blog section of Viktor Andersson's personal portfolio website. Here you can find articles about software development, technology and other topics related to my work and interests."
  canonicalURL="https://viktor.andersson.tech/blog"
/>

<div class="flex flex-col gap-8 justify-start pt-8 items-center">
  <section class="flex flex-col gap-4 w-full max-w-4xl">
    <h1>Blog</h1>

    {#if data.posts.length === 0}
      <p class="text-surface-500">No posts yet.</p>
    {:else}
      <ul class="flex flex-col gap-6">
        {#each data.posts as post}
          <li class="flex flex-col gap-1 border-b border-surface-200 dark:border-surface-800 pb-6">
            <a href="/blog/{post.slug}" class="text-xl font-semibold hover:underline">
              {post.title}
            </a>
            <time class="text-sm text-surface-500" datetime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <p class="text-surface-700 dark:text-surface-300">{post.description}</p>
            {#if post.tags?.length}
              <div class="flex flex-wrap gap-2 mt-1">
                {#each post.tags as tag}
                  <span class="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
