import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md"],
    }),
  ],
  kit: {
    adapter: adapter(),
    inlineStyleThreshold: Infinity,
    alias: {
      $blogs: "./src/blog_posts",
      $components: "./src/components",
      $data: "./src/data",
      $images: "./src/images",
      $lib: "./src/lib",
      $interfaces: "./src/interfaces",
    },
  },
};

export default config;
