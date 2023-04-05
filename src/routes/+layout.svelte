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
	import BackgroundText from '$components/BackgroundText.svelte';
	import Navbar from '$components/Navbar.svelte';
</script>

<AppShell class="min-h-screen">
	<svelte:fragment slot="header">
		<Navbar />
	</svelte:fragment>
	<main class="mt-16">
		<slot />
	</main>
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
<BackgroundText />
