import { UMAMI_SITE_ID, UMAMI_URL } from "astro:env/client";
import { z } from "astro/zod";
import { getToken, invalidateToken } from "./auth";

const statsSchema = z.object({ pageviews: z.number().int().nonnegative() });

/** All-time page views for an exact pathname, including its trailing slash. */
export async function getPageViews(path: string): Promise<number> {
	try {
		if (!path.startsWith("/")) throw new Error("Pass a pathname such as /en/blog/example/ to getPageViews().");
		const endpoint = new URL(`${UMAMI_URL.replace(/\/$/, "")}/api/websites/${encodeURIComponent(UMAMI_SITE_ID)}/stats`);
		endpoint.search = new URLSearchParams({ path, startAt: "0", endAt: Date.now().toString() }).toString();

		const requestStats = async () =>
			fetch(endpoint, {
				headers: { Accept: "application/json", Authorization: `Bearer ${await getToken()}` },
				signal: AbortSignal.timeout(10_000),
			});
		let response = await requestStats();
		if (response.status === 401) {
			invalidateToken();
			response = await requestStats();
		}
		if (!response.ok) throw new Error(`Umami stats returned HTTP ${response.status}.`);
		const data = statsSchema.safeParse(await response.json());
		if (!data.success) throw new Error("Umami stats returned an invalid pageviews response.");
		return data.data.pageviews;
	} catch (error) {
		console.error("[umami-client]", error instanceof Error ? error.message : "Failed to fetch page views.");
		throw error;
	}
}
