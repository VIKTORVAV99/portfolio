<script lang="ts">
  import Timeline from "$components/Timeline.svelte";
  import TitleText from "$components/TitleText.svelte";
  import { timelineEntries } from "$data/metadata";
  import { inview } from "$lib/actions/inview";
  import SEO from "$lib/seo/components/SEO.svelte";
</script>

<SEO
  title="Viktor Andersson | History"
  description="A timeline of my professional and educational history."
  canonicalURL="https://viktor.andersson.tech/history"
  type="profile"
/>

<div class="flex flex-col gap-8 justify-start pt-8 items-center max-w-4xl mx-auto w-full px-4">
  <TitleText path="history" />
  <section class="flex flex-col gap-4 items-center w-full" use:inview>
    <Timeline entries={timelineEntries} />
  </section>
</div>
