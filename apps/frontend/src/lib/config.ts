// @ts-expect-error — Vite enhanced:img query string not resolvable by TypeScript
import FallbackHeroImage from "$lib/assets/hero_banner.svg?w=1200&h=675&format=webp&url";

export const FALLBACK_HERO_IMAGE = FallbackHeroImage;

export const SITE_URL = "https://viktor.andersson.tech";
