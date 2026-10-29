import type { APIRoute, GetStaticPaths } from "astro";
import { getIntlayer, isDeclaredLocale, locales } from "intlayer";
import sanitize from "sanitize-html";
import { WebsiteTemplate } from "../../lib/open-graph/WebsiteTemplate";
import { renderOpenGraph } from "../../lib/open-graph/render";

export const prerender = true;
export const getStaticPaths: GetStaticPaths = () => locales.map((locale) => ({ params: { locale } }));

export const GET: APIRoute = async ({ params, site }) => {
	if (!isDeclaredLocale(params.locale)) return new Response(null, { status: 404 });
	if (!site) throw new Error("Set PUBLIC_SITE_URL before generating Open Graph images.");
	const ui = getIntlayer("site", params.locale);
	return renderOpenGraph(
		WebsiteTemplate({
			name: ui.name,
			title: sanitize(ui.heroTitle, { allowedTags: [], allowedAttributes: {} }),
			description: ui.heroText,
			sections: [ui.portfolio, ui.blog, ui.cv],
			host: site.host,
		}),
	);
};
