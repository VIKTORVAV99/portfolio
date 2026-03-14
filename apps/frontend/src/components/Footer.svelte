<script lang="ts">
	import { inview } from '$lib/actions/inview';
	const year = $derived(new Date().getFullYear());
</script>

<footer class="reveal flex flex-col w-screen justify-center items-center font-light" use:inview>
	<small>{year} &copy; Viktor Andersson </small>
	<small
		>Source code licensed under <a
			class="text-secondary-600 dark:text-secondary-300"
			href="https://github.com/VIKTORVAV99/personal-website/blob/main/LICENSE"
			rel="license">MIT license</a
		></small
	>
</footer>
