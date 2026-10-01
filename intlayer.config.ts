import { type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
	internationalization: {
		locales: ["en", "cs"],
		defaultLocale: "en",
	},
	routing: { mode: "prefix-all" },
};

export default config;
