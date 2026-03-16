<script lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
  }

  let { currentPage, totalPages }: Props = $props();

  function pageHref(page: number): string {
    return page === 1 ? "/blog" : `/blog?page=${page}`;
  }
</script>

{#if totalPages > 1}
  <nav class="flex items-center gap-2 font-mono text-sm" aria-label="Pagination">
    {#if currentPage > 1}
      <a
        href={pageHref(currentPage - 1)}
        class="px-3 py-1 text-surface-500 hover:text-green-500 transition-colors"
        aria-label="Previous page"
      >&larr;</a>
    {:else}
      <span
        class="px-3 py-1 text-surface-500 opacity-30 cursor-not-allowed"
        aria-disabled="true"
      >&larr;</span>
    {/if}

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      {#if page === currentPage}
        <span
          class="px-3 py-1 text-green-500"
          aria-current="page"
        >{page}</span>
      {:else}
        <a
          href={pageHref(page)}
          class="px-3 py-1 text-surface-500 hover:text-surface-300 transition-colors"
        >{page}</a>
      {/if}
    {/each}

    {#if currentPage < totalPages}
      <a
        href={pageHref(currentPage + 1)}
        class="px-3 py-1 text-surface-500 hover:text-green-500 transition-colors"
        aria-label="Next page"
      >&rarr;</a>
    {:else}
      <span
        class="px-3 py-1 text-surface-500 opacity-30 cursor-not-allowed"
        aria-disabled="true"
      >&rarr;</span>
    {/if}
  </nav>
{/if}
