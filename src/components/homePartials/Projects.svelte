<script lang="ts">
	import ProjectContainer from '$components/homePartials/ProjectContainer.svelte';
</script>

<!-- Personal projects -->
<section class="w-screen max-w-[1150px] flex flex-col">
	<h2 class="self-center mt-5 font-bold" id="personal-projects">Personal Projects</h2>
	<ProjectContainer linkToProjectDetails="projects/portfolio">
		<svelte:fragment slot="title"
			>Portfolio <span class="text-tertiary-800">(this website)</span></svelte:fragment
		>
		<svelte:fragment slot="description">
			Online portfolio to showcase the projects I've worked on and the frameworks and tools I used on these
			projects. The portfolio is built with Svelte, SvelteKit, TailwindCSS, Skeleton and TypeScript.
		</svelte:fragment>
		<svelte:fragment slot="technologiesList">
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://svelte.dev/">Svelte</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://kit.svelte.dev/">SvelteKit</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://tailwindcss.com/">TailwindCSS</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://www.skeleton.dev/">Skeleton</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://www.typescriptlang.org/">TypeScript</a>
			</li>
		</svelte:fragment>
		<svelte:fragment slot="linkList">
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://github.com/viktorvav99/portfolio">GitHub Repository</a>
			</li>
		</svelte:fragment>
	</ProjectContainer>
	<ProjectContainer linkToProjectDetails="projects/angular-demo">
		<svelte:fragment slot="title">Angular Demo</svelte:fragment>
		<svelte:fragment slot="description">
			Small project built with Angular to demonstrate the use of advanced web technologies such as SPA, PWA
			and IndexedDB for full offline support. Built with Angular, TypeScript and Firebase.
		</svelte:fragment>
		<svelte:fragment slot="technologiesList">
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://angular.io/">Angular</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://www.typescriptlang.org/">TypeScript</a>
			</li>
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://firebase.google.com/">Firebase</a>
			</li>
		</svelte:fragment>
		<svelte:fragment slot="linkList">
			<li class="inline-flex">
				<a class="text-sm mr-4" href="https://github.com/VIKTORVAV99/MyWebsite-Angular">GitHub Repository</a>
			</li>
			<li class="inline-flexale">
				<a class="text-sm mr-4" href="https://mywebsite-angular.web.app">Live Demo</a>
			</li>
		</svelte:fragment>
	</ProjectContainer>
</section>

<style>
	a {
		color: var(--color-tertiary) !important;
		text-decoration: none !important;
	}
</style>
