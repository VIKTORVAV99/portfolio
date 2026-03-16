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
    class="flex h-24 w-24 items-center justify-center rounded-full bg-error-100 text-error-600 dark:bg-error-900/20 dark:text-error-500"
  >
    <Fa icon={faTriangleExclamation} size="3x" />
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight text-surface-900 dark:text-primary-100">
      Error {page.status}
    </h1>
    <p class="text-secondary-500 dark:text-secondary-400">
      {#if page.error?.message}
        {page.error.message}
      {:else}
        Something went wrong. Please try again later.
      {/if}
    </p>
  </div>

  <Button.Root
    onclick={() => (window.location.href = "/")}
    class="cursor-pointer rounded-lg bg-surface-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-surface-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-900 dark:bg-surface-100 dark:text-surface-900 dark:hover:bg-surface-300"
  >
    Go to homepage
  </Button.Root>
</div>
