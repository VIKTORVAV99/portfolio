<script lang="ts">
  import IconSet from "$components/IconSet.svelte";
  import type { PageData } from "./$types";
  import TitleText from "$components/TitleText.svelte";
  import portrait from "$images/Viktor_Andersson.jpeg?enhanced";
  import SEO from "$lib/seo/components/SEO.svelte";

  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="Viktor Andersson - Software Engineer"
  description="Personal portfolio website for Viktor Andersson, Software Engineer at Electricity Maps and Digital Design and Innovation graduate"
  canonicalURL="https://viktor.andersson.tech"
  structuredData={data.structuredData}
/>
<div class="flex flex-col gap-8 justify-start pt-8 items-center max-w-4xl mx-auto w-full px-4">
  <TitleText path="" />
</div>

<div class="flex flex-col gap-8 justify-start pt-8 items-center">
  <section class="flex flex-col items-center gap-4 w-full">
    <enhanced:img
      src={portrait}
      alt="Portrait of Viktor Andersson"
      class="rounded-full w-64 h-64 border border-surface-100 dark:border-surface-800"
    />
    <h1>Viktor Andersson</h1>
  </section>
  <section class="flex flex-col items-center gap-4 w-full max-w-4xl">
    <h2>About me</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <section class="flex flex-col gap-4 items-center flex-1">
        <h3>Personal</h3>
        <p>
          I'm a Software Engineer at Electricity Maps, the world's most comprehensive electricity
          data platform. I hold a Bachelor of Science in Digital Design and Innovation from Halmstad
          University. On my free time I like to learn about new things, watch Sci-Fi and enjoy
          nature by walking, taking a bike ride or skiing down a mountain.
        </p>
      </section>
      <section class="flex flex-col gap-4 items-center flex-1">
        <h3>Professional</h3>
        <p>
          I have experience in both frontend and backend development, with a focus on TypeScript and
          JavaScript. I enjoy working with Svelte and SvelteKit, but I also have experience with
          React and Node.js. I'm always eager to learn new technologies and improve my skills.
        </p>
      </section>
    </div>
  </section>
</div>
