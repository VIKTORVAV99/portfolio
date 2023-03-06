<script lang="ts">
	import { page } from '$app/stores';
	import UnderConstruction from '$components/UnderConstruction.svelte';
	import Main from '$components/Main.svelte';
	import TitleText from '$components/TitleText.svelte';
	import Footer from '$components/Footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<UnderConstruction />
	<Main>
		<TitleText text={$page.status} />
		<p>{$page.error?.message}</p>
	</Main>
	<Footer />
</div>
