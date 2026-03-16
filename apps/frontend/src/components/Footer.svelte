<script lang="ts">
	const year = $derived(new Date().getFullYear());
</script>

<footer class="flex flex-col w-screen justify-center items-center font-light">
	<small>{year} &copy; Viktor Andersson </small>
	<small
		>Source code licensed under <a
			href="https://github.com/VIKTORVAV99/personal-website/blob/main/LICENSE"
			rel="license">MIT license</a
		></small
	>
</footer>
