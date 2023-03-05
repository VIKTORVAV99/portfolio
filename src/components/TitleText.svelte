<script lang="ts">
	export let text: string;
</script>

<!-- @component
TitleText component that auto scales the text size based on the screen size.
-->

<h1
	class="
    text-4xl
    lg:text-5xl
    xl:text-6xl font-inter"
>
	{text}
</h1>
