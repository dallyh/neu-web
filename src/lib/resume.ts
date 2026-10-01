import { getCollection, type CollectionEntry } from "astro:content";

export type ResumeEntry = CollectionEntry<"resume">;

export async function getResumes(): Promise<ResumeEntry[]> {
	return (await getCollection("resume")).filter((entry) => !entry.data.draft);
}
