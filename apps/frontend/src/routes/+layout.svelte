<script lang="ts">
	import '../app.css';
	import Footer from '$components/Footer.svelte';
	import BackgroundText from '$components/BackgroundText.svelte';
	import Navbar from '$components/Navbar.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="mt-16 flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
<BackgroundText />
