<script lang="ts">
	let { href, label, name }: { href: string; label: string; name: string } = $props();
  import { page } from '$app/state';
</script>

<a href={href} class="text-lg flex-1 text-center rounded-full underline-offset-4 font-medium min-w-20" aria-label={label}>
  {#if page.url.pathname === href}
    &nbsp;> <span class="text-green-500">~</span>/{name}
  {:else}
    cd <span class="text-green-500">~</span>/{name}
  {/if}
</a>