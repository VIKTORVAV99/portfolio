import { slugFromPath } from "$lib/blog";

export const getPostModule = async (
  slug: string,
): Promise<{ default: any; metadata: Record<string, any> }> => {
  const lazyModules = import.meta.glob("$blogs/*.md");
  const path = Object.keys(lazyModules).find((p) => slugFromPath(p) === slug);
  if (!path) throw new Error(`Blog post "${slug}" not found`);
  return (await lazyModules[path]()) as { default: any; metadata: Record<string, any> };
};
