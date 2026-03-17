<script lang="ts">
  import { Button } from "bits-ui";
  import type { Snippet, Component } from "svelte";

  let {
    icon: Icon,
    title,
    description,
    buttonContent,
    onAction,
  }: {
    icon: Component<{ size: number }>;
    title: string;
    description: string;
    buttonContent: Snippet;
    onAction: () => void;
  } = $props();
</script>

<div class="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
  <div
    class="flex h-24 w-24 items-center justify-center rounded-full bg-error-100 text-error-600 dark:bg-error-900/20 dark:text-error-500"
  >
    <Icon size={48} />
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
      {title}
    </h1>
    <p class="text-surface-500 dark:text-surface-400">
      {description}
    </p>
  </div>

  <Button.Root
    onclick={onAction}
    class="cursor-pointer rounded-full font-mono backdrop-blur-sm bg-surface-100/80 dark:bg-surface-800/80 px-6 py-3 text-sm font-medium text-surface-900 dark:text-surface-50 transition-colors hover:bg-surface-200/80 dark:hover:bg-surface-700/80"
  >
    {@render buttonContent()}
  </Button.Root>
</div>
