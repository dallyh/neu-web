import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

const sourceUrl = "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json";
const languageSchema = z.object({
	color: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.nullable(),
});

export function githubLanguageColorsLoader(): Loader {
	return {
		name: "github-language-colors-loader",
		load: async ({ store, logger, parseData, generateDigest }) => {
			let source: unknown;
			try {
				const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(10_000) });
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				source = await response.json();
			} catch {
				logger.warn("GitHub language colors could not be loaded; keeping cached colors or using fallback colors.");
				return;
			}
			if (!source || typeof source !== "object" || Array.isArray(source)) {
				logger.warn("GitHub language colors response was invalid; using fallback colors.");
				return;
			}

			store.clear();
			let count = 0;
			for (const [id, value] of Object.entries(source)) {
				const result = languageSchema.safeParse(value);
				if (!result.success) continue;
				const data = await parseData({ id, data: result.data });
				store.set({ id, data, digest: generateDigest(data) });
				count++;
			}
			logger.info(`Loaded colors for ${count} GitHub languages.`);
		},
	};
}
