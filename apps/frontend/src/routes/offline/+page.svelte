<script lang="ts">
  import { Fa } from "svelte-fa";
  import { faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
  import { Button } from "bits-ui";
  import SEO from "$lib/seo/components/SEO.svelte";
</script>

<SEO
  title="Offline"
  description="The page you are trying to access is currently offline. Please check back later."
  noIndex={true}
/>

<div class="flex w-full flex-1 flex-col items-center justify-center text-center gap-6">
  <div
    class="flex h-24 w-24 items-center justify-center rounded-full bg-error-100 text-error-600 dark:bg-error-900/20 dark:text-error-500"
  >
    <Fa icon={faPlugCircleXmark} size="3x" />
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="text-surface-900 dark:text-primary-100">Beep! You are offline.</h1>
    <p class="text-secondary-500 dark:text-secondary-400">
      We couldn't reach the network. Please check your Wi-Fi or cellular connection and try again.
    </p>
  </div>

  <Button.Root
    onclick={() => window.location.reload()}
    class="rounded-lg bg-surface-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-surface-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-900 dark:bg-surface-100 dark:text-surface-900 dark:hover:bg-surface-300 transition-colors cursor-pointer"
  >
    Try reloading
  </Button.Root>
</div>
