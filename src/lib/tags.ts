import { getCollection, getEntries as getReferencedEntries, type CollectionEntry } from "astro:content";
import { getLocalizedUrl, type LocalesValues } from "intlayer";
import { getEntries } from "./content";
import { withTrailingSlash } from "./urls";

export type TagEntry = CollectionEntry<"tags">;
export type BlogEntry = CollectionEntry<"blog">;

export async function getTags(): Promise<TagEntry[]> {
	return getCollection("tags");
}

export async function getBlogTags(entry: BlogEntry): Promise<TagEntry[]> {
	const tags = await getReferencedEntries(entry.data.tags);
	return tags.map((tag, index) => {
		if (!tag) throw new Error(`Missing tag ${entry.data.tags[index].id} for blog entry ${entry.id}`);
		return tag;
	});
}

export function tagLabel(tag: TagEntry, locale: string): string {
	const label = tag.data.label[locale];
	if (!label) throw new Error(`Missing ${locale} label for tag ${tag.id}`);
	return label;
}

export function tagDescription(tag: TagEntry, locale: string): string {
	const description = tag.data.description[locale];
	if (!description) throw new Error(`Missing ${locale} description for tag ${tag.id}`);
	return description;
}

export function tagUrl(tag: TagEntry | string, locale: LocalesValues): string {
	const id = typeof tag === "string" ? tag : tag.id;
	return withTrailingSlash(getLocalizedUrl(`/tags/${id}/`, locale));
}

export async function getPostsByTag(tagId: string, locale: string): Promise<BlogEntry[]> {
	return (await getEntries("blog", locale)).filter((entry) => entry.data.tags.some((tag) => tag.id === tagId));
}
