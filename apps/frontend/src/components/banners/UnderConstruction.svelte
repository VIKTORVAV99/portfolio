<script lang="ts">
	import Marquee from '../Marquee.svelte';
	let { class: className = '' }: { class?: string } = $props();
</script>

<Marquee class="bg-warning-400 shadow text-black {className}">
	<ul>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
		<li class="relative inline-block">&nbsp/// Under Construction</li>
	</ul>
</Marquee>
