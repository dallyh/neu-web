import { getLocalizedUrl, type LocalesValues } from "intlayer";

export function withTrailingSlash(path: string): string {
	return path.endsWith("/") ? path : `${path}/`;
}

export function sectionUrl(section: "blog" | "portfolio" | "tags" | "about" | "about/cv" | "", locale: LocalesValues): string {
	return withTrailingSlash(getLocalizedUrl(section ? `/${section}/` : "/", locale));
}

export function listingPageUrl(section: "blog" | "portfolio", locale: LocalesValues, page: number): string {
	return page === 1 ? sectionUrl(section, locale) : withTrailingSlash(getLocalizedUrl(`/${section}/${page}/`, locale));
}
