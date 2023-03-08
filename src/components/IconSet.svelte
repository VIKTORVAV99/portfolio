<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
	import { faSquareGithub } from '@fortawesome/free-brands-svg-icons/faSquareGithub';
	export let scale = 3;
</script>

<!--
  @component
  IconSet that contains the social media icons and links them.
  This component uses flex and flex row to align the icons horizontally.
  -->
<div class="flex flex-row justify-center items-center">
	<a title="LinkedIn" href="https://www.linkedin.com/in/viktor-va-andersson/" class="m-3">
		<Icon data={faLinkedin} {scale} class="text-dark-gray [&>path]:hover:fill-linkedin-blue" />
	</a>
	<a title="GitHub" href="http://github.com/VIKTORVAV99" class="m-3">
		<Icon data={faSquareGithub} {scale} class="text-dark-gray [&>path]:hover:fill-white" />
	</a>
</div>
