import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import type { Font } from "satori";

const require = createRequire(import.meta.url);
let fonts: Promise<Font[]> | undefined;

export const ogFonts = {
	display: "Bebas Neue, Bebas Neue Extended",
	heading: "Plus Jakarta Sans, Plus Jakarta Sans Extended",
	body: "DM Sans, DM Sans Extended",
};

export function loadFonts(): Promise<Font[]> {
	return (fonts ??= Promise.all(
		[
			{ family: "Bebas Neue", package: "bebas-neue", weight: 400 },
			{ family: "Plus Jakarta Sans", package: "plus-jakarta-sans", weight: 700 },
			{ family: "DM Sans", package: "dm-sans", weight: 400 },
		].flatMap((font) =>
			["latin", "latin-ext"].map(async (subset): Promise<Font> => ({
				// Separate names let Satori fall back to extended glyphs for Czech.
				name: `${font.family}${subset === "latin-ext" ? " Extended" : ""}`,
				data: await readFile(require.resolve(`@fontsource/${font.package}/files/${font.package}-${subset}-${font.weight}-normal.woff`)),
				weight: font.weight as 400 | 700,
				style: "normal",
			})),
		),
	));
}
