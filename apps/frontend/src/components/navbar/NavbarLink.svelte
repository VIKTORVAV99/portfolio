<script lang="ts">
  let { href, label, name }: { href: string; label: string; name: string } = $props();
  import { page } from "$app/state";
  import Highlight from "$components/Highlight.svelte";
</script>

<a
  {href}
  class="text-lg flex-1 text-center rounded-full underline-offset-4 font-medium min-w-20 outline-none"
  aria-label={label}
>
  {#if page.url.pathname === href}
    <span class="inline-block">&nbsp;</span>>
  {:else}
    cd
  {/if}
  <Highlight>~</Highlight>/{name}
</a>
