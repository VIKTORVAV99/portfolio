<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
	import { faSquareGithub } from '@fortawesome/free-brands-svg-icons/faSquareGithub';
</script>

<!--
  @component
  IconSet that contains the social media icons and links them.
  This component uses flex and flex row to align the icons horizontally.
  -->
<div class="flex flex-row justify-center items-center mt-2">
	<a href="https://www.linkedin.com/in/viktor-va-andersson/" class="m-3">
		<Icon data={faLinkedin} scale={3} class="text-dark-gray hover:text-linkedin-blue" />
	</a>
	<a href="http://github.com/VIKTORVAV99" class="m-3">
		<Icon data={faSquareGithub} scale={3} class="text-dark-gray hover:text-white" />
	</a>
</div>
