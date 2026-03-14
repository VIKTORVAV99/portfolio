<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
	import { faSquareGithub } from '@fortawesome/free-brands-svg-icons/faSquareGithub';

	const icons = [
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/viktor-va-andersson/',
			icon: faLinkedin
		},
		{
			name: 'GitHub',
			url: 'https://github.com/viktorvav99',
			icon: faSquareGithub
		}
	];
</script>

<div class="flex justify-center gap-6 items-center">
	{#each icons as icon}
		<a
			href={icon.url}
			title={icon.name}
			class="inline-flex items-center justify-center size-12 text-5xl text-surface-900 dark:text-surface-50 hover:scale-110 hover:text-secondary-500 transition-all duration-200"
		>
			<Fa icon={icon.icon} />
		</a>
	{/each}
</div>
