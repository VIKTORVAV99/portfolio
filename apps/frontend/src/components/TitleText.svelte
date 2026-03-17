<script lang="ts">
  import Highlight from "$components/Highlight.svelte";
  let { path, subtitle }: { path: string; subtitle?: string } = $props();
</script>

<div class="w-full border-b border-surface-200 dark:border-surface-800 pb-6 mb-2">
  <h1 class="text-3xl font-bold font-mono text-surface-900 dark:text-surface-100" aria-label={path || 'Home'}>
    <Highlight>~</Highlight>/{path}
  </h1>
  {#if subtitle}
    <p class="text-surface-500 mt-2 text-lg">{subtitle}</p>
  {/if}
</div>
