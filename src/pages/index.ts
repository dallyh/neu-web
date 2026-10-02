import type { APIRoute } from "astro";
import { getLocalizedUrl, getLocaleFromRequest } from "intlayer";
import { withTrailingSlash } from "../lib/urls";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const locale = await getLocaleFromRequest(request);
	return new Response(null, {
		status: 302,
		headers: {
			Location: withTrailingSlash(getLocalizedUrl("/", locale)),
			"Cache-Control": "private, no-store",
			Vary: "Cookie, Accept-Language",
		},
	});
};
