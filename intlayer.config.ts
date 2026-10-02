import { type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
	internationalization: {
		locales: ["en", "cs"],
		defaultLocale: "en",
	},
	// The root GET endpoint owns preference-based redirects in development and production.
	routing: { mode: "prefix-all", enableProxy: false },
};

export default config;
