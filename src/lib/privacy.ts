import { getCollection, type CollectionEntry } from "astro:content";
import { getLocalizedUrl, locales, type LocalesValues } from "intlayer";
import { withTrailingSlash } from "./urls";

export type PrivacyPolicyEntry = CollectionEntry<"privacyPolicy">;

export function privacyPolicyLocale(entry: PrivacyPolicyEntry): LocalesValues {
	return entry.data.locale as LocalesValues;
}

export function privacyPolicyUrl(entry: PrivacyPolicyEntry): string {
	return withTrailingSlash(getLocalizedUrl(`/${entry.data.slug}/`, privacyPolicyLocale(entry)));
}

export async function getPrivacyPolicies(): Promise<PrivacyPolicyEntry[]> {
	return (await getCollection("privacyPolicy")).filter((entry) => locales.some((locale) => locale === entry.data.locale));
}
