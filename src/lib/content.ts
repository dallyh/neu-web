import { getCollection, type CollectionEntry } from "astro:content";
import { getLocalizedUrl, type LocalesValues } from "intlayer";
import { withTrailingSlash } from "./urls";

type CollectionName = "blog" | "portfolio";
type Entry<C extends CollectionName> = CollectionEntry<C>;

export function contentUrl<C extends CollectionName>(collection: C, entry: Entry<C>): string {
	return withTrailingSlash(getLocalizedUrl(`/${collection}/${entry.data.slug}/`, entry.data.locale as LocalesValues));
}

export async function getEntries<C extends CollectionName>(collection: C, locale?: string): Promise<Entry<C>[]> {
	const entries = await getCollection(collection);
	return entries
		.filter((entry) => (import.meta.env.DEV || !entry.data.draft) && (!locale || entry.data.locale === locale))
		.sort((a, b) => {
			const aDate = collection === "blog" ? (a as Entry<"blog">).data.publishedAt : (a as Entry<"portfolio">).data.date;
			const bDate = collection === "blog" ? (b as Entry<"blog">).data.publishedAt : (b as Entry<"portfolio">).data.date;
			return bDate.getTime() - aDate.getTime();
		});
}

export async function getEntryBySlug<C extends CollectionName>(collection: C, locale: string, slug: string): Promise<Entry<C> | undefined> {
	return (await getEntries(collection, locale)).find((entry) => entry.data.slug === slug);
}

export async function getTranslations<C extends CollectionName>(collection: C, translationKey: string): Promise<Entry<C>[]> {
	return (await getEntries(collection)).filter((entry) => entry.data.translationKey === translationKey);
}

export async function getTranslatedSibling<C extends CollectionName>(collection: C, entry: Entry<C>, locale: string): Promise<Entry<C> | undefined> {
	return (await getTranslations(collection, entry.data.translationKey)).find((candidate) => candidate.data.locale === locale);
}
