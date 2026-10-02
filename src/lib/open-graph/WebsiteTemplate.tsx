/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */
import { ogFonts } from "./fonts";
import { ogColors as colors, ogSize } from "./theme";

interface Props {
	name: string;
	title: string;
	description: string;
	sections: string[];
	host: string;
}

export function WebsiteTemplate({ name, title, description, sections, host }: Props) {
	return (
		<div style={{ ...ogSize, display: "flex", padding: 24, background: colors.background, color: colors.ink, fontFamily: ogFonts.body }}>
			<div style={{ display: "flex", flexDirection: "column", width: "100%", padding: 40, background: colors.primary, border: `3px solid ${colors.ink}`, boxShadow: `8px 8px 0 ${colors.ink}` }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: ogFonts.heading, fontWeight: 700, fontSize: 24 }}>
					<div>{name}</div>
					<div style={{ background: colors.secondary, border: `3px solid ${colors.ink}`, padding: "8px 16px" }}>{host}</div>
				</div>
				<div style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
					<div style={{ fontFamily: ogFonts.display, fontSize: title.length > 55 ? 88 : 104, lineHeight: 1, lineClamp: 3 }}>{title}</div>
				</div>
				<div style={{ fontSize: 28, lineHeight: 1.35, lineClamp: 2, marginBottom: 28 }}>{description}</div>
				<div style={{ display: "flex", gap: 24, fontFamily: ogFonts.heading, fontWeight: 700, fontSize: 22 }}>
					{sections.map((section) => (
						<div>{section}</div>
					))}
				</div>
			</div>
		</div>
	);
}
