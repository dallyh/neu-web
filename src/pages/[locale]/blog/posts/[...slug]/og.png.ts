import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getIntlayer } from "intlayer";
import { getEntries, getSlugWithoutLocale } from "../../../../../lib/content";
import { BlogTemplate } from "../../../../../lib/open-graph/BlogTemplate";
import { renderOpenGraph } from "../../../../../lib/open-graph/render";

export const prerender = true;
export const getStaticPaths: GetStaticPaths = async () =>
	(await getEntries("blog")).map((entry) => ({
		params: { locale: entry.data.locale, slug: getSlugWithoutLocale(entry.id) },
		props: { entry },
	}));

interface Props {
	entry: CollectionEntry<"blog">;
}

export const GET: APIRoute<Props> = async ({ props: { entry }, site }) => {
	if (!site) throw new Error("Set PUBLIC_SITE_URL before generating Open Graph images.");
	const ui = getIntlayer("site", entry.data.locale);
	return renderOpenGraph(
		BlogTemplate({
			name: ui.name,
			label: ui.blog,
			title: entry.data.title,
			description: entry.data.description,
			date: new Intl.DateTimeFormat(entry.data.locale, { dateStyle: "long" }).format(entry.data.publishedAt),
			host: site.host,
		}),
	);
};
