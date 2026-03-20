import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit()],
  preview: {
    port: 8888,
  },
  build: {
    assetsInlineLimit: (filePath) => {
      // Don't inline the favicon as this prevents Google Image Bot from indexing it.
      // Which in turn prevents the favicon from showing up in search results
      // and when sharing links on social media.
      if (filePath.endsWith("favicon.svg")) {
        return false;
      }
      // For other files use the default limit of 4kb
      return undefined;
    },
  },
});
