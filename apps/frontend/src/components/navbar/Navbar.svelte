<script lang="ts">
  import NavbarLink from './NavbarLink.svelte';
  import { DropdownMenu } from "bits-ui";
  import Menu from "@lucide/svelte/icons/menu";

  const links = [
    { href: '/', label: 'Home', name: '' },
    { href: '/about', label: 'About', name: 'about' },
    { href: '/history', label: 'History', name: 'history' },
    { href: '/blog', label: 'Blog', name: 'blog' },
  ];
</script>

<div class="m-4">
  <!-- Desktop nav -->
  <nav class="hidden md:flex font-mono w-fill max-w-5xl mx-auto justify-evenly items-center gap-8 py-4 px-8 rounded-full backdrop-blur-sm bg-surface-800/80">
    {#each links as link}
      <NavbarLink href={link.href} label={link.label} name={link.name} />
    {/each}
  </nav>

  <!-- Mobile nav -->
  <div class="flex md:hidden justify-start">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="Navigation menu" class="rounded-full backdrop-blur-sm bg-surface-800/80 p-3 cursor-pointer text-surface-50 outline-none">
        <Menu size={24} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={8} collisionPadding={16} align="start" class="z-50 rounded-2xl backdrop-blur-sm bg-surface-800/80 py-4 px-8 font-mono">
        {#each links as link}
          <DropdownMenu.Item class="rounded-xl px-4 py-2 text-surface-50 hover:bg-surface-700/80 cursor-pointer text-lg">
            <NavbarLink href={link.href} label={link.label} name={link.name} />
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>
