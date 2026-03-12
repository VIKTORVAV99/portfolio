<script lang="ts">
	const year = $derived(new Date().getFullYear());
</script>

<footer class="flex flex-col w-screen justify-center items-center preset-tonal-primary font-light">
	<small>{year} &copy; Viktor Andersson </small>
	<small
		>Source code licensed under <a
			class="text-secondary-600 dark:text-secondary-300"
			href="https://github.com/VIKTORVAV99/personal-website/blob/main/LICENSE"
			rel="license">MIT license</a
		></small
	>
</footer>
