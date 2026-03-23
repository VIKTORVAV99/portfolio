<script lang="ts">
  import type { LucideIcon } from "@lucide/svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  interface Props {
    currentPage: number;
    totalPages: number;
    baseHref?: string;
  }

  let { currentPage, totalPages, baseHref = "/blog" }: Props = $props();

  const box = "inline-flex items-center justify-center size-8";

  const pageHref = (page: number): string =>
    page === 1 ? baseHref : `${baseHref}?page=${page}`;
</script>

{#snippet chevron(href: string | undefined, label: string, Icon: LucideIcon)}
  {#if href}
    <a {href} class="{box} text-surface-300 hover:text-green-500 transition-colors" aria-label={label}>
      <Icon size={16} />
    </a>
  {:else}
    <span class="{box} text-surface-300 opacity-30 cursor-not-allowed" aria-disabled="true">
      <Icon size={16} />
    </span>
  {/if}
{/snippet}

{#if totalPages > 1}
  <nav class="flex items-center gap-2 font-mono text-sm" aria-label="Pagination">
    {@render chevron(currentPage > 1 ? pageHref(currentPage - 1) : undefined, "Previous page", ChevronLeft)}

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      {#if page === currentPage}
        <span class="{box} text-green-500" aria-current="page">{page}</span>
      {:else}
        <a href={pageHref(page)} class="{box} text-surface-300 hover:text-green-500 transition-colors">{page}</a>
      {/if}
    {/each}

    {@render chevron(currentPage < totalPages ? pageHref(currentPage + 1) : undefined, "Next page", ChevronRight)}
  </nav>
{/if}
