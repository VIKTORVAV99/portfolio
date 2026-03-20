<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
  <Header />
  <main class="flex-1 flex px-4 sm:px-0 flex-col">
    {@render children()}
  </main>
  <Footer />
</div>
