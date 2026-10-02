import tokens from "../../styles/tokens.css?raw";

// Social previews have a fixed light palette, independent of the viewer's theme.
// Read the original tokens rather than maintaining a second color palette.
function color(token: string): string {
	const value = tokens.match(new RegExp(`--nb-${token}:\\s*(#[\\da-fA-F]+);`))?.[1];
	if (!value) throw new Error(`Missing Open Graph color token: --nb-${token}`);
	return value;
}

export const ogColors = {
	background: color("bg"),
	surface: color("surface"),
	ink: color("ink"),
	primary: color("primary"),
	secondary: color("secondary"),
};

export const ogSize = { width: 1200, height: 630 };
