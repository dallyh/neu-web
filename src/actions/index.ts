import { ActionError, defineAction } from "astro:actions";
import { PUBLIC_HCAPTCHA_SITE_KEY } from "astro:env/client";
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, HCAPTCHA_SECRET, RESEND_API_KEY } from "astro:env/server";
import { z } from "astro/zod";
import { getIntlayer, locales, setLocaleInStorageServer } from "intlayer";

const configuredEmailSchema = z.email().max(254);

async function verifyCaptcha(token: string, secret: string, siteKey: string): Promise<boolean> {
	try {
		const response = await fetch("https://api.hcaptcha.com/siteverify", {
			method: "POST",
			body: new URLSearchParams({ secret, sitekey: siteKey, response: token }),
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) return false;
		const result: unknown = await response.json();
		return typeof result === "object" && result !== null && "success" in result && result.success === true;
	} catch {
		return false;
	}
}

export const server = {
	setLocale: defineAction({
		input: z.object({ locale: z.enum(locales) }),
		handler: ({ locale }, context) => {
			setLocaleInStorageServer(locale, {
				setCookieStore: (name, value, attributes) => {
					const { expires, ...options } = attributes;
					context.cookies.set(name, value, {
						...options,
						expires: expires === undefined ? undefined : new Date(expires),
						maxAge: 60 * 60 * 24 * 365,
						httpOnly: true,
						sameSite: "lax",
						secure: context.url.protocol === "https:",
					});
				},
			});
			return { locale };
		},
	}),
	sendContact: defineAction({
		accept: "form",
		input: z.object({
			from: z.email().max(254),
			name: z.string().trim().min(1).max(120),
			message: z.string().trim().min(1).max(5000),
			locale: z.string().refine((value) => locales.includes(value as never)),
			"h-captcha-response": z.string().min(1),
		}),
		handler: async (input) => {
			// hCaptcha's published test pair verifies local submissions without a challenge.
			const captchaSiteKey = import.meta.env.DEV ? "10000000-ffff-ffff-ffff-000000000001" : PUBLIC_HCAPTCHA_SITE_KEY;
			const captchaSecret = import.meta.env.DEV ? "0x0000000000000000000000000000000000000000" : HCAPTCHA_SECRET;
			if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL || !captchaSecret || !captchaSiteKey) {
				throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: "Contact email is not configured." });
			}
			const senderAddress = /<([^<>]+)>$/.exec(CONTACT_FROM_EMAIL.trim())?.[1] ?? CONTACT_FROM_EMAIL.trim();
			if (!configuredEmailSchema.safeParse(senderAddress).success) {
				throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: "CONTACT_FROM_EMAIL must be a valid email address." });
			}
			if (!configuredEmailSchema.safeParse(CONTACT_TO_EMAIL.trim()).success) {
				throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: "CONTACT_TO_EMAIL must be a valid email address." });
			}
			if (/@example\.(?:com|net|org)$/i.test(senderAddress)) {
				throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: "CONTACT_FROM_EMAIL is a placeholder; use a verified Resend sender." });
			}

			if (!(await verifyCaptcha(input["h-captcha-response"], captchaSecret, captchaSiteKey))) {
				throw new ActionError({ code: "BAD_REQUEST", message: "captcha" });
			}

			const subject = getIntlayer("site", input.locale as (typeof locales)[number]).contactEmailSubject;
			const text = `Name: ${input.name}\nEmail: ${input.from}\nLocale: ${input.locale}\n\n${input.message}`;
			let response: Response;
			try {
				response = await fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
					body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: input.from, subject, text }),
					signal: AbortSignal.timeout(10_000),
				});
			} catch (error) {
				console.error("[contact] Resend request failed:", error instanceof Error ? error.message : "unknown error");
				throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
			}
			if (!response.ok) {
				const details: unknown = await response.json().catch(() => null);
				const providerCode = typeof details === "object" && details !== null && "name" in details && typeof details.name === "string" ? details.name : "unknown";
				console.error("[contact] Resend rejected message:", { status: response.status, code: providerCode });
				throw new ActionError({ code: response.status === 401 || response.status === 403 ? "SERVICE_UNAVAILABLE" : "INTERNAL_SERVER_ERROR" });
			}

			return { sent: true };
		},
	}),
};
