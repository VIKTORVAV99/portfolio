import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    tailwindcss(),
    imagetools({
      include: /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|svg|tiff|webp)(\?.*)?$/,
      exclude: /[?&]enhanced/,
    }),
    enhancedImages(),
    sveltekit(),
  ],
  preview: {
    port: 8888,
  },
  build: {
    rolldownOptions: {
      output: {
        comments: false,
      },
    },
    assetsInlineLimit: (filePath) => {
      // Don't inline favicons as this prevents Google Image Bot from indexing them.
      // Which in turn prevents the favicon from showing up in search results
      // and when sharing links on social media.
      if (
        filePath.endsWith("favicon.svg") ||
        filePath.endsWith("apple-touch-icon.png") ||
        filePath.endsWith("icon-48x48.png") ||
        filePath.endsWith("icon-96x96.png")
      ) {
        return false;
      }
      // For other files use the default limit of 4kb
      return undefined;
    },
  },
});
