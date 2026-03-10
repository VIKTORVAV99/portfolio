<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<div class="life-chip">
	<span class="font-bold">{title}</span>
</div>

<style>
	.life-chip {
		display: inline-flex;
		padding: 0.375rem 1.25rem;
		border-radius: 9999px;
		border: 1px solid var(--color-surface-200);
		background: var(--color-surface-100);
		font-size: 0.875rem;
	}

	:global(html.dark) .life-chip {
		border-color: var(--color-surface-700);
		background: var(--color-surface-800);
	}
</style>
