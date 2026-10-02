import { UMAMI_URL } from "astro:env/client";
import { UMAMI_PASSWORD, UMAMI_USERNAME } from "astro:env/server";
import { z } from "astro/zod";

const loginSchema = z.object({ token: z.string().min(1) });
let tokenPromise: Promise<string> | undefined;

async function login(): Promise<string> {
	try {
		if (!UMAMI_USERNAME || !UMAMI_PASSWORD) throw new Error("Set UMAMI_USERNAME and UMAMI_PASSWORD to query analytics.");
		const response = await fetch(`${UMAMI_URL.replace(/\/$/, "")}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) throw new Error(`Umami login returned HTTP ${response.status}.`);
		const data = loginSchema.safeParse(await response.json());
		if (!data.success) throw new Error("Umami login returned an invalid token response.");
		return data.data.token;
	} catch (error) {
		console.error("[umami-auth]", error instanceof Error ? error.message : "Authentication failed.");
		throw error;
	}
}

// Authenticate on demand; concurrent requests share one login.
export function getToken(): Promise<string> {
	return (tokenPromise ??= login().catch((error) => {
		tokenPromise = undefined;
		throw error;
	}));
}

export function invalidateToken(): void {
	tokenPromise = undefined;
}
