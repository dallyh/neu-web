import satori from "satori";
import type { JSXNode } from "satori/jsx";
import sharp from "sharp";
import { loadFonts } from "./fonts";
import { ogSize } from "./theme";

export async function renderOpenGraph(template: JSXNode): Promise<Response> {
	const svg = await satori(template, { ...ogSize, fonts: await loadFonts() });
	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
