<script lang="ts">
  import NavbarLink from './NavbarLink.svelte';

  const links = [
    { href: '/', label: 'Home', name: '' },
    { href: '/about', label: 'About', name: 'about' },
    { href: '/history', label: 'History', name: 'history' },
    { href: '/blog', label: 'Blog', name: 'blog' },
  ];
</script>



<div class="p-4">
  <nav class="flex font-mono w-fill max-w-5xl mx-auto justify-evenly items-center gap-8 py-4 px-8 rounded-full backdrop-blur-sm bg-surface-100/80 dark:bg-surface-800/80">
    {#each links as link}
      <NavbarLink href={link.href} label={link.label} name={link.name} />
    {/each}
  </nav>
</div>