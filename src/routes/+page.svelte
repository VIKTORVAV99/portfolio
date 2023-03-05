<script lang="typescript">
	import UnderConstruction from '../components/UnderConstruction.svelte';
	import TitleText from '../components/TitleText.svelte';
	import IconSet from '../components/IconSet.svelte';
</script>

<svelte:head>
	<title>Viktor Andersson</title>
</svelte:head>

<div class="flex flex-col w-screen h-screen">
	<UnderConstruction />
	<main class="flex flex-col grow items-center justify-center ">
		<TitleText text="Viktor Andersson" />
		<IconSet />
	</main>
	<footer class="flex grow justify-center items-end">
		<div>
			<p>Footer</p>
		</div>
	</footer>
</div>

<style lang="postcss">
</style>
