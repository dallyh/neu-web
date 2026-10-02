import type { APIRoute, GetStaticPaths } from "astro";
import { render } from "astro:content";
import { loadRenderers } from "astro:container";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import rss from "@astrojs/rss";
import { getIntlayer, isDeclaredLocale, locales } from "intlayer";
import sanitize from "sanitize-html";
import MdxContent from "../../components/mdx/MdxContent.astro";
import { contentUrl, getEntries } from "../../lib/content";
import { getBlogTags, tagLabel } from "../../lib/tags";
import { sectionUrl } from "../../lib/urls";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () => locales.map((locale) => ({ params: { locale } }));

function sanitizeFeedHtml(html: string, postUrl: URL): string {
	return sanitize(html, {
		allowedTags: [...sanitize.defaults.allowedTags, "img", "details", "summary"],
		allowedAttributes: {
			...sanitize.defaults.allowedAttributes,
			img: ["src", "alt", "title", "width", "height"],
		},
		nonTextTags: ["script", "style", "textarea", "option", "button", "svg"],
		transformTags: {
			a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...(attribs.href && { href: new URL(attribs.href, postUrl).href }) } }),
			img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...(attribs.src && { src: new URL(attribs.src, postUrl).href }) } }),
		},
	});
}

export const GET: APIRoute = async ({ site, params, locals }) => {
	const locale = params.locale;
	if (!isDeclaredLocale(locale)) return new Response(null, { status: 404 });
	if (!site) throw new Error("Set PUBLIC_SITE_URL before generating RSS feeds.");

	const ui = getIntlayer("site", locale);
	const posts = await getEntries("blog", locale, { includeDrafts: false });
	const renderers = await loadRenderers([getContainerRenderer()]);
	const container = await AstroContainer.create({ renderers });
	const items = await Promise.all(
		posts.map(async (post) => {
			const postUrl = new URL(contentUrl("blog", post), site);
			const { Content, headings } = await render(post);
			const html = await container.renderToString(MdxContent, {
				props: { Content, headings, showTableOfContents: false },
				request: new Request(postUrl),
				locals,
			});
			return {
				title: post.data.title,
				pubDate: post.data.publishedAt,
				description: post.data.description,
				link: postUrl.href,
				categories: (await getBlogTags(post)).map((tag) => tagLabel(tag, locale)),
				content: sanitizeFeedHtml(html, postUrl),
			};
		}),
	);

	return rss({
		title: ui.rssTitle,
		description: ui.rssDescription,
		site: new URL(sectionUrl("blog", locale), site),
		customData: `<language>${locale}</language>`,
		items,
	});
};
