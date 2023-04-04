<script lang="ts">
</script>

<svelte:head>
	<title>Viktor Andersson | Portfolio</title>
	<meta
		name="description"
		content="The project page for my online portfolio built with Svelte, SvelteKit, TailwindCSS, Skeleton, TypeScript and hosted and deployed on GitHub Pages using a automated CI/CD pipeline."
	/>
	<meta name="keywords" content="portfolio, svelte, sveltekit, tailwindcss, skeleton, typescript" />
</svelte:head>

<div class="flex justify-center">
	<section class="card p-4 my-16 variant-glass-tertiary max-w-[1000px] flex flex-col">
		<h1 class="py-4">Portfolio</h1>
		<p>
			My online portfolio to showcase some of the projects I've worked on and the frameworks and tools I used
			to build them.
		</p>
		<hr class="my-4" />
		<p>
			The portfolio was built with Svelte, SvelteKit, TailwindCSS, Skeleton and TypeScript. And is deployed
			and hosted on GitHub Pages using an automated CI/CD pipeline with GitHub Actions to automatically
			publish the latest changes.
		</p>
		<section class="pt-16">
			<h2>Technologies</h2>
			<ul class="list">
				<li>
					<section>
						<h3>Svelte</h3>
						<p>Underlying framework and the core of the project.</p>
					</section>
				</li>
				<li>
					<section>
						<h3>SvelteKit</h3>
						<p>Meta framework for Svelte with built in static site generator and routing.</p>
					</section>
				</li>
				<li>
					<section>
						<h3>TailwindCSS</h3>
						<p>Utility-first CSS framework used to style the project.</p>
					</section>
				</li>
				<li>
					<section>
						<h3>Skeleton</h3>
						<p>
							UI toolkit based on TailwindCSS and SvelteKit that provides built in components and a theming
							system.
						</p>
					</section>
				</li>
				<li>
					<section>
						<h3>TypeScript</h3>
						<p>
							Superset of JavaScript with strong typing support used to ensure the type safety of the project.
						</p>
					</section>
				</li>
				<li>
					<section>
						<h3>GitHub Actions</h3>
						<p>
							CI/CD pipeline used to automatically test and build the project on GitHub Pages when changes are
							pushed. It employs caching and parallelization to speed up the test and build process.
						</p>
					</section>
				</li>
				<li>
					<section>
						<h3>GitHub Pages</h3>
						<p>
							Static site hosting service used to host the project. The project is deployed on GitHub Pages
							using the CI/CD pipeline when there are changes to the main branch.
						</p>
					</section>
				</li>
			</ul>
		</section>
	</section>
</div>

<style>
	p {
		white-space: normal;
	}
</style>
