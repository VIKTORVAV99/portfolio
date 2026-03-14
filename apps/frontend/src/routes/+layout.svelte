<script lang="ts">
  import "../app.css";
  import Footer from "$components/Footer.svelte";
  import Header from "$components/Header.svelte";
  import { onNavigate } from "$app/navigation";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="flex flex-col min-h-screen">
  <Header />
  <main class="flex-1 flex flex-col">
    {@render children()}
  </main>
  <Footer />
</div>
