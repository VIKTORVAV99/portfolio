<script lang="ts">
  import { page } from "$app/state";
  import { FileQuestion } from "lucide-svelte";
  import StatusPage from "$components/StatusPage.svelte";
  import Highlight from "$components/Highlight.svelte";
</script>

<StatusPage
  icon={FileQuestion}
  title={`Blog Post Error ${page.status}`}
  description={page.error?.message || "Sorry, there was a problem loading this blog post."}
  onAction={() => (window.location.href = "/blog")}
>
  {#snippet buttonContent()}cd <Highlight>~</Highlight>/blog{/snippet}
</StatusPage>
