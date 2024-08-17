<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
	import { faSquareGithub } from '@fortawesome/free-brands-svg-icons/faSquareGithub';
	export let scale = 3;

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

<!--
  @component
  IconSet that contains the social media icons and links them.
  This component uses flex to align the icons horizontally.
  -->

<div class="flex justify-center items-center">
	{#each icons as icon}
		<a href={icon.url} class="m-3" title={icon.name}>
			<Icon
				data={icon.icon}
				{scale}
				class="text-surface-900-50-token hover:dark:brightness-[1.15] hover:brightness-75"
			/>
		</a>
	{/each}
</div>
