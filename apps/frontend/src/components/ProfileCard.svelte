<script lang="ts">
  import portrait from "$images/Viktor_Andersson.jpeg?w=96;192&enhanced";
</script>

<div class="flex gap-8 items-center w-full">
  <enhanced:img
    src={portrait}
    alt="Portrait of Viktor Andersson"
    class="rounded-full w-24 h-24 object-cover"
  />
  <div class="flex flex-col gap-0.5">
    <h2 class="text-2xl text-surface-100">Viktor Andersson</h2>
    <p class="text-base text-surface-500">Software Engineer</p>
    <div class="flex flex-wrap gap-4 font-mono text-sm mt-1">
      <a href="https://www.linkedin.com/in/viktor-va-andersson/" target="_blank" rel="noopener noreferrer" class="link-accent">open linkedin</a>
      <a href="https://github.com/viktorvav99" target="_blank" rel="noopener noreferrer" class="link-accent">open github</a>
    </div>
  </div>
</div>
