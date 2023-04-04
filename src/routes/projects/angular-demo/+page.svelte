<script lang="ts">
</script>

<svelte:head>
	<title>Viktor Andersson | Angular Demo</title>
	<meta
		name="description"
		content="Project to demonstrate the use of Angular and Firebase for a single page (SPA) progressive web app (PWA) with offline support."
	/>
	<meta name="keywords" content="SPA, PWA, Angular, Firebase, TypeScript" />
</svelte:head>

<div class="flex justify-center">
	<section class="card p-4 my-16 variant-glass-tertiary max-w-[1000px] flex flex-col">
		<h1 class="py-4">Angular Demo</h1>
		<p>Project to showcase the use of Angular and Firebase to build a progressive single page app.</p>
		<hr class="my-4" />
		<p>
			The project was built with the use of Angular, Angular CLI, Angular Material, Angular Fire and Firebase.
			It is hosted and deployed on Firebase Hosting using a automated CI/CD pipeline with GitHub Actions to
			automatically publish the latest changes.
		</p>
		<section class="pt-16">
			<h2>Technologies</h2>
			<ul class="list">
				<li>
					<section>
						<h3>Angular</h3>
						<p>Underlying framework and the core of the project.</p>
					</section>
				</li>
				<li>
					<section>
						<h3>Angular CLI</h3>
						<p>
							CLI utility for creating components, modules and services. It also has features that enabling
							rapid prototyping with a built in dev server as well as creating full production builds.
						</p>
					</section>
				</li>
				<li>
					<section>
						<h3>Angular Material</h3>
						<p>Angular specific implementation of the Material Design Framework.</p>
					</section>
				</li>
				<li>
					<section>
						<h3>Angular Fire</h3>
						<p>
							Angular Specific API implementation for Firebase to alow for easy integration with Angular
							features.
						</p>
					</section>
				</li>
				<li>
					<section>
						<h3>Firebase</h3>
						<p>
							Full stack app development platform used to host the project and provide the backend services.
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
			</ul>
		</section>
	</section>
</div>

<style>
	p {
		white-space: normal;
	}
</style>
