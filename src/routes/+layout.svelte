<script lang="ts">
	// theme:
	//import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../theme.postcss';
	// styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	// components:
	import { AppShell } from '@skeletonlabs/skeleton';
	import Footer from '$components/Footer.svelte';
	import UnderConstruction from '$components/banners/UnderConstruction.svelte';
	import BackgroundText from '$components/BackgroundText.svelte';
</script>

<AppShell class="min-h-screen">
	<svelte:fragment slot="header">
		<UnderConstruction />
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
<BackgroundText />
