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
  This component uses flex and flex row to align the icons horizontally.
  -->

<div class="flex flex-row justify-center items-center">
	{#each icons as icon}
		<a href={icon.url} class="m-3" title={icon.name}>
			<Icon data={icon.icon} {scale} class="text-tertiary-500" />
		</a>
	{/each}
</div>
