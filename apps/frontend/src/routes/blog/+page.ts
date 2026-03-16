export const prerender = true;

export const load = async () => {
  // This fetches all .md files in the blog directory
  const paths = import.meta.glob('$blogs/*.md', { eager: true });
  const posts = [];

  for (const path in paths) {
    const file = paths[path] as any;
    const slug = path.split('/').at(-1)?.replace(/\.md$/, '').toLowerCase();

    if (file && typeof file === 'object' && 'metadata' in file && slug) {
      const metadata = file.metadata;
      posts.push({ ...metadata, slug });
    }
  }

  // Sort posts by date descending
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts: sortedPosts };
};