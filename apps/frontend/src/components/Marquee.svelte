<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    duration = 150,
    direction = 'normal',
    pauseOnHover = true,
    gap = "0px",
    class: className = '',
    children
  }: {
    duration?: number;
    direction?: 'normal' | 'reverse';
    pauseOnHover?: boolean;
    gap?: string;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<div
  class="marquee-container {className}"
  style:--duration="{duration}s"
  style:--direction={direction}
  style:--pause={pauseOnHover ? 'paused' : 'running'}
  style:--gap={gap}
>
  <div class="marquee-content">
    {@render children()}
  </div>
  <div class="marquee-content" aria-hidden="true">
    {@render children()}
  </div>
</div>

<style>
  .marquee-container {
    display: flex;
    overflow: hidden;
    user-select: none;
    gap: var(--gap);
    width: 100%;
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  .marquee-content {
    flex-shrink: 0;
    display: flex;
    justify-content: space-around;
    gap: var(--gap);
    min-width: 100%;
    will-change: transform;
    animation: scroll var(--duration) linear infinite var(--direction);
  }

  .marquee-container:hover .marquee-content {
    animation-play-state: var(--pause);
  }

  @keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - var(--gap))); }
  }
</style>