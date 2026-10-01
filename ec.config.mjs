import { defineEcConfig } from "astro-expressive-code";

export default defineEcConfig({
	themes: ["github-dark-default", "github-light-default"],
	themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
	styleOverrides: {
		codeFontFamily: "var(--nb-font-mono)",
		uiFontFamily: "var(--nb-font-heading)",
		borderColor: "var(--nb-ink)",
		borderWidth: "var(--nb-border-md)",
		borderRadius: "var(--nb-radius)",
		focusBorder: "var(--nb-focus)",
		frames: {
			editorActiveTabIndicatorTopColor: "var(--nb-primary)",
			frameBoxShadowCssValue: "var(--nb-shadow-md)",
		},
	},
});
