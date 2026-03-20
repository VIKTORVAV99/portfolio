<script lang="ts">
  // @ts-expect-error — Vite enhanced:img query string not resolvable by svelte-check
  import portrait from "$images/Viktor_Andersson.jpeg?w=96;192&enhanced";
  import ExternalLink from "$components/ExternalLink.svelte";
</script>

<div class="flex gap-8 items-center w-full">
  <enhanced:img
    src={portrait}
    alt="Portrait of Viktor Andersson"
    class="rounded-full w-24 h-24 min-w-24 min-h-24 object-cover"
    fetchpriority="high"
  />
  <div class="flex flex-col gap-0.5">
    <h2>Viktor Andersson</h2>
    <p class="text-base text-surface-300">Software Engineer</p>
    <div class="flex flex-wrap gap-4 text-sm mt-1">
      <ExternalLink href="https://www.linkedin.com/in/viktor-va-andersson/">open linkedin</ExternalLink>
      <ExternalLink href="https://github.com/viktorvav99">open github</ExternalLink>
    </div>
  </div>
</div>
