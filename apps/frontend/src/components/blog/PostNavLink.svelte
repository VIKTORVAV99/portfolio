<script lang="ts">
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  interface Props {
    href: string;
    title: string;
    direction: "prev" | "next";
  }

  let { href, title, direction }: Props = $props();
  const isPrev = $derived(direction === "prev");
</script>

<a
  {href}
  class="group flex items-center gap-2 text-surface-300 hover:text-green-500 transition-colors"
  class:text-right={!isPrev}
  class:ml-auto={!isPrev}
>
  {#if isPrev}
    <ChevronLeft size={16} />
  {/if}
  <div class="flex flex-col" class:items-end={!isPrev}>
    <span class="text-xs font-mono uppercase tracking-wide">{isPrev ? "Newer" : "Older"}</span>
    <span class="text-sm text-surface-300 group-hover:text-green-500 transition-colors">{title}</span>
  </div>
  {#if !isPrev}
    <ChevronRight size={16} />
  {/if}
</a>
