<script lang="ts">
  import iconSVG from "$lib/assets/favicon.svg";
  import appleTouchIcon from "$lib/assets/apple-touch-icon.png";
  import icon48 from "$lib/assets/icon-48x48.png";
  import icon96 from "$lib/assets/icon-96x96.png";
  import "../app.css";
  import Menu from "@lucide/svelte/icons/menu";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Highlight from "$components/Highlight.svelte";
  import { onMount, type Snippet } from "svelte";

  const links = [
    { href: '/', label: 'Home', name: '' },
    { href: '/about', label: 'About', name: 'about' },
    { href: '/history', label: 'History', name: 'history' },
    { href: '/blog', label: 'Blog', name: 'blog' },
  ];

  let open = $state(false);
  const year = $derived(new Date().getFullYear());

  let { children }: { children: Snippet } = $props();

  afterNavigate(() => { open = false; });

  onMount(() => {
    navigator.serviceWorker?.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  });
</script>

{#snippet navbarLink(href: string, label: string, name: string)}
  <a {href} class="text-lg flex-1 text-center rounded-full underline-offset-4 font-medium min-w-20 outline-none" aria-label={label}>
    {#if page.url.pathname === href}
      <span class="inline-block">&nbsp;</span>>
    {:else}
      cd
    {/if}
    <Highlight>~</Highlight>/{name}
  </a>
{/snippet}

<svelte:head>
  <link rel="icon" href={iconSVG} type="image/svg+xml" sizes="any" />
  <link rel="icon" href={icon48} type="image/png" sizes="48x48" />
  <link rel="icon" href={icon96} type="image/png" sizes="96x96" />
  <link rel="apple-touch-icon" href={appleTouchIcon} />
</svelte:head>

<div class="flex flex-col min-h-dvh">
  <header class="sticky top-0 z-10 w-full">
    <div class="m-4">
      <!-- Desktop nav -->
      <nav class="hidden md:flex font-mono w-fill max-w-5xl mx-auto justify-evenly items-center gap-8 py-4 px-8 rounded-full backdrop-blur-sm bg-surface-800/80">
        {#each links as link}
          {@render navbarLink(link.href, link.label, link.name)}
        {/each}
      </nav>

      <!-- Mobile nav -->
      <div class="flex md:hidden flex-col items-start">
        <button onclick={() => open = !open} aria-label="Navigation menu" class="rounded-full backdrop-blur-sm bg-surface-800/80 p-3 cursor-pointer text-surface-50 outline-none">
          <Menu size={24} />
        </button>
        {#if open}
          <nav class="mt-2 z-50 rounded-2xl backdrop-blur-sm bg-surface-800/80 py-4 px-8 font-mono">
            {#each links as link}
              <div class="rounded-xl px-4 py-2 text-surface-50 hover:bg-surface-700/80 cursor-pointer text-lg">
                {@render navbarLink(link.href, link.label, link.name)}
              </div>
            {/each}
          </nav>
        {/if}
      </div>
    </div>
  </header>
  <main class="flex-1 flex px-4 md:px-8 lg:px-0 flex-col">
    {@render children()}
  </main>
  <footer class="flex flex-col w-screen mt-8 mb-2 justify-center items-center">
    <small>{year} &copy; Viktor Andersson </small>
    <small>Source code licensed under <a href="https://github.com/VIKTORVAV99/personal-website/blob/main/LICENSE" rel="license">MIT license</a></small>
  </footer>
</div>
