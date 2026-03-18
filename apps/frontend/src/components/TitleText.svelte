<script lang="ts">
  import Highlight from "$components/Highlight.svelte";
  let { path, subtitle }: { path: string; subtitle?: string } = $props();
</script>

<div class="w-full border-b border-surface-800 pb-6 mb-2">
  <h1 class="font-mono" aria-label={path || 'Home'}>
    <Highlight>~</Highlight>/{path}
  </h1>
  {#if subtitle}
    <p class="text-surface-300 mt-2 text-lg">{subtitle}</p>
  {/if}
</div>
