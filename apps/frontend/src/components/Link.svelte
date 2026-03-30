<script lang="ts">
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  let {
    href,
    mono = false,
    children,
    class: className = "",
    ...restProps
  }: HTMLAnchorAttributes & { mono?: boolean; children: Snippet } = $props();

  const isExternal = $derived(
    href?.startsWith("http://") || href?.startsWith("https://"),
  );
</script>

<a
  {href}
  target={isExternal ? "_blank" : undefined}
  rel={isExternal ? "noopener noreferrer" : undefined}
  class="inline-flex items-center gap-0.5 {mono ? 'font-mono' : ''} {className}"
  {...restProps}
>
  {@render children()}
  {#if isExternal}
    <ArrowUpRight size={14} />
  {/if}
</a>
