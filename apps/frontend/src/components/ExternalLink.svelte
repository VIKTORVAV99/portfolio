<script lang="ts">
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import type { Snippet } from "svelte";

  let { href, class: className = '', children }: { href: string; class?: string; children: Snippet } = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-0.5 font-mono {className}">
  {@render children()}
  <ArrowUpRight size={14} />
</a>
