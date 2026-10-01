export interface GitHubRepository {
	owner: string;
	repo: string;
}

export function parseGitHubRepositoryUrl(value: string): GitHubRepository | undefined {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return undefined;
	}
	if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com") return undefined;
	const parts = url.pathname.split("/").filter(Boolean);
	if (parts.length !== 2) return undefined;
	const [owner, name] = parts;
	const repo = name.replace(/\.git$/i, "");
	if (!owner || !repo) return undefined;
	return { owner, repo };
}
