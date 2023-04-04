<script lang="ts">
	export let linkToProjectDetails: string;
	export let imageAspectRatio: string | undefined = undefined;
</script>

<section class="flex flex-col card m-[1vw] variant-glass-tertiary">
	<h3 class="card-header font-semibold mb-8 mx-4"><slot name="title">MISSING TITLE!</slot></h3>
	<main class="flex px-4 mx-4">
		<p class="max-w-[80ch]">
			<slot name="description">MISSING DESCRIPTION</slot>
		</p>
		{#if $$slots.picture && imageAspectRatio}
			<slot name="picture" class="aspect-[{imageAspectRatio}] max-h-[400px] ml-4" />
		{/if}
	</main>
	<footer class="card-footer flex flex-col mx-4">
		<ul class="flex w-full flex-wrap my-4 text-tertiary-600 hover:[&>li]:text-tertiary-300">
			<slot name="technologiesList" />
		</ul>
		<ul class="flex w-full flex-wrap my-4 text-tertiary-600 hover:[&>li]:text-tertiary-300">
			<slot name="linkList" />
		</ul>
		<a class="btn variant-filled-primary w-fit self-center" href={linkToProjectDetails}>Details</a>
	</footer>
</section>
