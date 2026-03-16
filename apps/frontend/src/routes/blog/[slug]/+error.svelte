<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="prose mx-auto my-16 text-center">
	<h1 class="text-3xl font-bold text-error-600">Blog Post Error</h1>
	<p class="mt-4 text-lg">{page.status}: {page.error?.message}</p>
	<p class="mt-2 text-secondary-500">Sorry, there was a problem loading this blog post.</p>
</section>
