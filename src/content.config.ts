import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { locales } from "intlayer";
import { parseGitHubRepositoryUrl } from "./lib/github-url";
import { githubLanguageColorsLoader } from "./lib/github-language-colors-loader";

const localeSchema = z.string().refine((locale) => locales.includes(locale as never));
const localizedTextSchema = z.record(z.string(), z.string().min(1)).refine((values) => locales.every((locale) => Boolean(values[locale])), "A value is required for every configured locale");

const tags = defineCollection({
	loader: file("./src/content/tags.json"),
	schema: z.object({
		label: localizedTextSchema,
		description: localizedTextSchema,
	}),
});

const githubLanguages = defineCollection({
	loader: githubLanguageColorsLoader(),
	schema: z.object({
		color: z
			.string()
			.regex(/^#[0-9a-fA-F]{6}$/)
			.nullable(),
	}),
});

const blog = defineCollection({
	loader: glob({
		base: "./src/content/blog",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			locale: localeSchema,
			translationKey: z.string().min(1),
			publishedAt: z.coerce.date(),
			updatedAt: z.coerce.date().optional(),
			tags: z.array(reference("tags")),
			draft: z.boolean().default(false),
			featured: z.boolean().default(false),
			showTableOfContents: z.boolean().default(false),
			image: image().or(z.url()).optional(),
			imageAlt: z.string().optional(),
		}),
});

const portfolio = defineCollection({
	loader: glob({
		base: "./src/content/portfolio",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			locale: localeSchema,
			translationKey: z.string().min(1),
			date: z.coerce.date(),
			tags: z.array(z.string()).default([]),
			stack: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			showTableOfContents: z.boolean().default(false),
			draft: z.boolean().default(false),
			role: z.string().optional(),
			repositoryUrl: z.url().optional(),
			githubUrl: z
				.url()
				.refine((url) => parseGitHubRepositoryUrl(url) !== undefined, "Use a GitHub repository URL")
				.optional(),
			externalUrl: z.url().optional(),
			image: image().or(z.url()).optional(),
			imageAlt: z.string().optional(),
		}),
});

const resume = defineCollection({
	loader: glob({
		base: "./src/content/resume",
		pattern: "**/*.{md,mdx}",
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		locale: localeSchema,
		translationKey: z.string().min(1),
		summary: z.string().min(1),
		draft: z.boolean().default(false),
		showTableOfContents: z.boolean().default(false),
	}),
});

const privacyPolicy = defineCollection({
	loader: glob({
		base: "./src/content/privacy-policy",
		pattern: "**/*.{md,mdx}",
	}),
	schema: z.object({
		title: z.string().min(1),
		locale: localeSchema,
		effectiveDate: z.coerce.date(),
		slug: z.string().min(1),
		translationKey: z.string().min(1),
	}),
});

export const collections = {
	blog,
	portfolio,
	resume,
	privacyPolicy,
	tags,
	githubLanguages,
};
