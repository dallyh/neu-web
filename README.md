# Personal website

## Disclaimer

This site was made with help from Codex for the initial scaffold, design, and migration from my [old](https://github.com/dallyh/daliborhon.dev) website. I then edited the design, fixed bugs, and reviewed the implementation. I don't really have free time to do it all by myself without help from the AI.

## Commands

| Command                          | Purpose                                             |
| -------------------------------- | --------------------------------------------------- |
| `nvm use`                        | Select the Node version in `.nvmrc`                 |
| `pnpm install --frozen-lockfile` | Install locked dependencies                         |
| `pnpm dev`                       | Start the development server                        |
| `pnpm check`                     | Check Astro and TypeScript                          |
| `pnpm build`                     | Build static pages and the Node server              |
| `pnpm start`                     | Run `dist/server/entry.mjs`                         |
| `pnpm preview`                   | Preview the build locally (not a production server) |
| `pnpm format`                    | Format project files                                |

## Environment

Copy `.env.example` to `.env` for local development. Public settings are baked into pages; changing them requires a new build.

| Variable                           | Available at | Purpose                                                                  |
| ---------------------------------- | ------------ | ------------------------------------------------------------------------ |
| `PUBLIC_SITE_URL`                  | Build        | Public origin for canonical URLs, RSS, and OG images                     |
| `PUBLIC_HCAPTCHA_SITE_KEY`         | Build        | Contact widget site key; use hCaptcha's test site key locally            |
| `GITHUB_TOKEN`                     | Build        | GitHub project metadata; required as a secret for Docker builds          |
| `UMAMI_URL`                        | Build        | Analytics origin; defaults to `https://analytics.daliborhon.dev`         |
| `UMAMI_SITE_ID`                    | Build        | Analytics website ID; defaults to `7e04370d-ecba-4fd8-8d71-2d50880d0d59` |
| `PREVIEW`                          | Build        | `true` disables tracking; default `false`; development never tracks      |
| `HCAPTCHA_SECRET`                  | Runtime      | Production hCaptcha verification secret                                  |
| `RESEND_API_KEY`                   | Runtime      | Send contact emails                                                      |
| `CONTACT_FROM_EMAIL`               | Runtime      | Resend-authorized sender address; supports `Name <email>`                |
| `CONTACT_TO_EMAIL`                 | Runtime      | Contact email recipient                                                  |
| `UMAMI_USERNAME`, `UMAMI_PASSWORD` | Runtime      | Server-side page-view queries; not needed for tracking                   |
| `HOST`, `PORT`                     | Runtime      | Bind address/port; Docker defaults to `0.0.0.0:4321`                     |

## Docker / Coolify

Export `GITHUB_TOKEN` in your shell, then build with BuildKit:

```bash
docker build \
  --secret id=GITHUB_TOKEN,env=GITHUB_TOKEN \
  --build-arg PUBLIC_SITE_URL=https://neu.daliborhon.dev \
  --build-arg PUBLIC_HCAPTCHA_SITE_KEY=your-site-key \
  -t neu-web .

docker run --rm -p 4321:4321 --env-file .env neu-web
```

In Coolify, use `Dockerfile` at the repository root, expose port `4321`, and enable **Use Docker Build Secrets**. Mark build settings as build variables; make `GITHUB_TOKEN` build-only. Add contact secrets and Umami credentials as runtime variables. The image runs as the non-root `node` user and includes a health check.
