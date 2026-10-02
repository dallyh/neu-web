import type { CollectionEntry } from "astro:content";
import { getLocalizedUrl, type LocalesValues } from "intlayer";
import { contentUrl } from "../content";

export function websiteOgUrl(locale: LocalesValues): string {
	return getLocalizedUrl("/og.png", locale);
}

export function blogOgUrl(entry: CollectionEntry<"blog">): string {
	return `${contentUrl("blog", entry)}og.png`;
}
