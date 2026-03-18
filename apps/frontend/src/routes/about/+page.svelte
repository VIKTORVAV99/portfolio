<script lang="ts">
  import TitleText from "$components/TitleText.svelte";
  import ProfileCard from "$components/ProfileCard.svelte";
  import SEO from "$lib/seo/components/SEO.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="Viktor Andersson | About"
  description="About Viktor Andersson, Software Engineer at Electricity Maps."
  canonicalURL="https://viktor.andersson.tech/about"
  structuredData={data.structuredData}
/>

<div class="flex flex-col gap-8 justify-start pt-8 items-center max-w-4xl mx-auto w-full">
  <TitleText path="about" subtitle="Get to know me" />

  <ProfileCard />

  <section class="flex flex-col gap-8 w-full">
    <section class="flex flex-col gap-4">
      <h2 class="text-xl text-surface-900 dark:text-surface-100">Personal</h2>
      <p class="text-surface-600 dark:text-surface-400">
        I'm a Software Engineer at Electricity Maps, the world's most comprehensive electricity
        data platform. I hold a Bachelor of Science in Digital Design and Innovation from Halmstad
        University. On my free time I like to learn about new things, watch Sci-Fi and enjoy
        nature by walking, taking a bike ride or skiing down a mountain.
      </p>
    </section>
    <section class="flex flex-col gap-4">
      <h2 class="text-xl text-surface-900 dark:text-surface-100">Professional</h2>
      <p class="text-surface-600 dark:text-surface-400">
        I have experience in both frontend and backend development, with a focus on TypeScript and
        JavaScript. I enjoy working with Svelte and SvelteKit, but I also have experience with
        React and Node.js. I'm always eager to learn new technologies and improve my skills.
      </p>
    </section>
  </section>
</div>
