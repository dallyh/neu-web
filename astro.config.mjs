// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import icon from "astro-iconset";
import expressiveCode from "astro-expressive-code";
import { intlayer } from "astro-intlayer";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";
import { loadEnv } from "vite";

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
	site: PUBLIC_SITE_URL,
	adapter: node({ mode: "standalone" }),
	security: {
		allowedDomains: [
			{
				hostname: "**.daliborhon.dev",
				protocol: "https",
			},
			{
				hostname: "daliborhon.dev",
				protocol: "https",
			},
		],
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			// https://fontsource.org/fonts/bebas-neue
			name: "Bebas Neue",
			cssVariable: "--font-bebas-neue",
			weights: ["400"],
			styles: ["normal"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["Impact", "sans-serif"],
		},
		{
			provider: fontProviders.fontsource(),
			// https://fontsource.org/fonts/plus-jakarta-sans
			name: "Plus Jakarta Sans",
			cssVariable: "--font-plus-jakarta-sans",
			weights: ["200 800"],
			styles: ["normal"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["Arial", "sans-serif"],
		},
		{
			provider: fontProviders.fontsource(),
			// https://fontsource.org/fonts/dm-sans
			name: "DM Sans",
			cssVariable: "--font-dm-sans",
			weights: ["100 1000"],
			styles: ["normal", "italic"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["Arial", "sans-serif"],
		},
		{
			provider: fontProviders.fontsource(),
			// https://fontsource.org/fonts/jetbrains-mono
			name: "JetBrains Mono",
			cssVariable: "--font-jetbrains-mono",
			weights: ["100 800"],
			styles: ["normal"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["monospace"],
		},
	],
	env: {
		schema: {
			UMAMI_URL: envField.string({ context: "client", access: "public", url: true, default: "https://analytics.daliborhon.dev" }),
			UMAMI_SITE_ID: envField.string({ context: "client", access: "public", default: "7e04370d-ecba-4fd8-8d71-2d50880d0d59" }),
			PREVIEW: envField.boolean({ context: "server", access: "public", default: false }),
			UMAMI_USERNAME: envField.string({ context: "server", access: "secret", optional: true }),
			UMAMI_PASSWORD: envField.string({ context: "server", access: "secret", optional: true }),
			PUBLIC_HCAPTCHA_SITE_KEY: envField.string({ context: "client", access: "public", optional: true }),
			HCAPTCHA_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
			RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
			CONTACT_FROM_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
			CONTACT_TO_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
			GITHUB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
		},
	},
	integrations: [
		expressiveCode(),
		mdx(),
		icon({ include: { devicon: ["html5", "css3", "javascript", "typescript", "react", "nodejs-wordmark", "csharp", "dot-net", "dotnetcore", "microsoftsqlserver", "git", "azure", "azuredevops"] } }),
		intlayer(),
	],
	vite: { plugins: [tailwindcss()] },
});
