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
  class="group relative flex items-center md:max-w-1/2 text-surface-300 hover:text-green-500 transition-colors"
  class:text-right={!isPrev}
  class:md:ml-auto={!isPrev}
>
  {#if isPrev}
    <span class="absolute -left-6 top-1/2 -translate-y-1/2">
      <ChevronLeft size={16} />
    </span>
  {/if}
  <div class="flex flex-col" class:items-end={!isPrev}>
    <span class="text-xs font-mono uppercase tracking-wide">{isPrev ? "Newer" : "Older"}</span>
    <span class="text-sm text-surface-300 group-hover:text-green-500 transition-colors">{title}</span>
  </div>
  {#if !isPrev}
    <span class="absolute -right-6 top-1/2 -translate-y-1/2">
      <ChevronRight size={16} />
    </span>
  {/if}
</a>
