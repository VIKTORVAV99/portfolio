<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<div
	class="inline-flex py-1.5 px-5 rounded-full border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 text-sm"
>
	<span class="font-bold">{title}</span>
</div>
