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
  import { type Snippet } from "svelte";

  const links = [
    { href: "/", label: "Home", name: "" },
    { href: "/about", label: "About", name: "about" },
    { href: "/history", label: "History", name: "history" },
    { href: "/blog", label: "Blog", name: "blog" },
  ] as const;

  let open = $state(false);
  const year = $derived(new Date().getFullYear());

  let { children }: { children: Snippet } = $props();

  afterNavigate(() => {
    open = false;
  });
</script>

{#snippet navbarLinks()}
  {#each links as link}
    <a
      href={link.href}
      class="text-lg md:flex-1 md:text-center max-md:py-2 max-md:px-4 rounded-full underline-offset-4 font-medium min-w-20 outline-none"
      aria-label={link.label}
    >
      {#if page.url.pathname === link.href}
        <span class="inline-block">&nbsp;</span>>
      {:else}
        cd
      {/if}
      <Highlight>~</Highlight>/{link.name}
    </a>
  {/each}
{/snippet}

<svelte:head>
  <link rel="icon" href={iconSVG} type="image/svg+xml" sizes="any" />
  <link rel="icon" href={icon48} type="image/png" sizes="48x48" />
  <link rel="icon" href={icon96} type="image/png" sizes="96x96" />
  <link rel="apple-touch-icon" href={appleTouchIcon} />
</svelte:head>

<!-- #region Header -->
  <header class="sticky top-0 z-10 w-full">
    <div class="m-4">
      <!-- Desktop nav -->
      <nav
        class="hidden md:flex font-mono w-fill max-w-5xl mx-auto justify-evenly items-center gap-8 py-4 px-8 rounded-full backdrop-blur-sm bg-surface-800/80"
      >
        {@render navbarLinks()}
      </nav>

      <!-- Mobile nav -->
      <div class="relative flex md:hidden flex-col items-start">
        <button
          onclick={() => (open = !open)}
          aria-label="Navigation menu"
          class="rounded-full backdrop-blur-sm bg-surface-800/80 p-3 cursor-pointer text-surface-50 outline-none"
        >
          <Menu size={24} />
        </button>
        {#if open}
          <nav
            class="absolute flex flex-col gap-1 justify-start top-full mt-2 z-50 rounded-2xl backdrop-blur-sm bg-surface-800/80 py-4 px-4 font-mono"
          >
            {@render navbarLinks()}
          </nav>
        {/if}
      </div>
    </div>
  </header>
  <!-- #endregion -->
  <!-- #region Main -->
  <main class="flex-1 flex px-4 md:px-8 lg:px-0 flex-col">
    {@render children()}
  </main>
  <!-- #endregion -->
  <!-- #region Footer -->
  <footer class="flex flex-col w-screen mt-8 mb-2 justify-center items-center">
    <small>{year} &copy; Viktor Andersson </small>
    <small
      >Source code licensed under <a
        href="https://github.com/VIKTORVAV99/personal-website/blob/main/LICENSE"
        rel="license">MIT license</a
      ></small
    >
  </footer>
  <!-- #endregion -->
