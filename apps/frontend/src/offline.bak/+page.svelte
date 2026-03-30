<script lang="ts">
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import StatusPage from "$components/StatusPage.svelte";
  import SEO from "$lib/seo/components/SEO.svelte";
</script>

<SEO
  title="Offline"
  description="The page you are trying to access is currently offline. Please check back later."
  noIndex={true}
/>

<StatusPage
  icon={WifiOff}
  title="Beep! You are offline."
  description="We couldn't reach the network. Please check your Wi-Fi or cellular connection and try again."
  onAction={() => window.location.reload()}
>
  {#snippet buttonContent()}retry{/snippet}
</StatusPage>
