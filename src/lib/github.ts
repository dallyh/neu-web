import { GITHUB_TOKEN } from "astro:env/server";
import { Octokit } from "octokit";
import { parseGitHubRepositoryUrl } from "./github-url";

export interface GitHubProjectData {
	createdAt?: Date;
	languages: Record<string, number>;
}

const octokit = new Octokit({ auth: GITHUB_TOKEN || undefined });
const repositoryCache = new Map<string, Promise<GitHubProjectData | undefined>>();

export function getGitHubProjectData(githubUrl?: string): Promise<GitHubProjectData | undefined> {
	if (!githubUrl) return Promise.resolve(undefined);
	const repository = parseGitHubRepositoryUrl(githubUrl);
	if (!repository) return Promise.resolve(undefined);
	const { owner, repo } = repository;
	const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
	let request = repositoryCache.get(key);
	if (!request) {
		request = fetchGitHubProjectData(owner, repo);
		repositoryCache.set(key, request);
	}
	return request;
}

async function fetchGitHubProjectData(owner: string, repo: string): Promise<GitHubProjectData | undefined> {
	const [repository, languages] = await Promise.allSettled([octokit.rest.repos.get({ owner, repo }), octokit.rest.repos.listLanguages({ owner, repo })]);
	if (repository.status === "rejected" || languages.status === "rejected") {
		console.warn(`[github] Metadata for ${owner}/${repo} is unavailable; using available project data.`);
	}
	if (repository.status === "rejected" && languages.status === "rejected") return undefined;
	const rawDate = repository.status === "fulfilled" ? repository.value.data.created_at : undefined;
	const parsedDate = rawDate ? new Date(rawDate) : undefined;
	const createdAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined;
	return {
		createdAt,
		languages: languages.status === "fulfilled" ? languages.value.data : {},
	};
}
