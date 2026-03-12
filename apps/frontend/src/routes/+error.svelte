<script lang="ts">
  import { page } from "$app/state";
  import { Fa } from "svelte-fa";
  import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
  import { Button } from "bits-ui";
  import SEO from "$lib/seo/components/SEO.svelte";
</script>

<SEO
  title={`Error ${page.status}`}
  description={page.error?.message || "An unexpected error occurred."}
  noIndex={true}
/>

<div class="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
  <div
    class="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-500"
  >
    <Fa icon={faTriangleExclamation} size="3x" />
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      Error {page.status}
    </h1>
    <p class="text-gray-500 dark:text-gray-400">
      {#if page.error?.message}
        {page.error.message}
      {:else}
        Something went wrong. Please try again later.
      {/if}
    </p>
  </div>

  <Button.Root
    onclick={() => (window.location.href = "/")}
    class="cursor-pointer rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
  >
    Go to homepage
  </Button.Root>
</div>
