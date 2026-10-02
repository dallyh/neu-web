/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */
import { ogFonts } from "./fonts";
import { ogColors as colors, ogSize } from "./theme";

interface Props {
	name: string;
	label: string;
	title: string;
	description: string;
	date: string;
	host: string;
}

export function BlogTemplate({ name, label, title, description, date, host }: Props) {
	return (
		<div style={{ ...ogSize, display: "flex", padding: 24, background: colors.background, color: colors.ink, fontFamily: ogFonts.body }}>
			<div style={{ display: "flex", flexDirection: "column", width: "100%", padding: 40, background: colors.surface, border: `3px solid ${colors.ink}`, boxShadow: `8px 8px 0 ${colors.ink}` }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22 }}>
					<div style={{ background: colors.primary, border: `3px solid ${colors.ink}`, padding: "8px 16px", fontFamily: ogFonts.heading, fontWeight: 700 }}>{label}</div>
					<div>{date}</div>
				</div>
				<div style={{ display: "flex", flexGrow: 1, alignItems: "center", padding: "20px 0" }}>
					<div style={{ fontFamily: ogFonts.heading, fontWeight: 700, fontSize: title.length > 100 ? 46 : title.length > 65 ? 54 : 64, lineHeight: 1.12, lineClamp: 3 }}>{title}</div>
				</div>
				<div style={{ fontSize: 26, lineHeight: 1.35, lineClamp: 2, marginBottom: 28 }}>{description}</div>
				<div style={{ display: "flex", justifyContent: "space-between", borderTop: `3px solid ${colors.ink}`, paddingTop: 20, fontSize: 22 }}>
					<div>{name}</div>
					<div>{host}</div>
				</div>
			</div>
		</div>
	);
}
