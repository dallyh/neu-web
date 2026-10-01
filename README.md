# Personal website

## Running the site

This repository contains the first working Astro site slice. Use the Node version in `.nvmrc`, then run `pnpm install`, `pnpm dev`, `pnpm check`, and `pnpm build`. Set `PUBLIC_SITE_URL` to the deployed site origin when building for production so canonical and alternate URLs use the public domain.

The localized homepage, blog, portfolio, About, and CV are available under `/en/` and `/cs/`. The first article and project describe this site's foundation. UI strings live in `src/i18n/site.content.ts`; editorial content lives in the MDX collections.

## Contact form and Node deployment

The site prerenders its content pages and handles contact submissions with a typed Astro Action on the standalone Node adapter. Build with `pnpm build`, then run `pnpm start` in the container. Set `HOST=0.0.0.0` and the desired `PORT` for container access.

For Coolify, select the repository's `Dockerfile` build pack with `/` as the base directory and `Dockerfile` as the Dockerfile location. Set **Ports Exposes** to `4321`. Pass `PUBLIC_SITE_URL` (the site's public origin) and `PUBLIC_HCAPTCHA_SITE_KEY` as **build variables**. Add `GITHUB_TOKEN` as a **build variable** with **Runtime Variable** disabled, and enable **Use Docker Build Secrets** in Coolify's advanced settings. The Dockerfile requires this secret for `pnpm build`, where it authenticates the GitHub API requests that populate project metadata. Set `HCAPTCHA_SECRET`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` as **runtime environment variables**. The image includes a health check against `/` and runs as the non-root `node` user.

Copy `.env.example` to a local `.env` and fill in your own values. Set `PUBLIC_HCAPTCHA_SITE_KEY` and `PUBLIC_SITE_URL` **at build time** so they appear in the static pages. A local `pnpm build` can use `GITHUB_TOKEN` from `.env`; for a local Docker build, export `GITHUB_TOKEN` in your shell and pass it as a BuildKit secret with `docker build --secret id=GITHUB_TOKEN,env=GITHUB_TOKEN .`. Set `HCAPTCHA_SECRET`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` **at runtime** for the action. The contact variables are declared in Astro's `env.schema` and imported from `astro:env/client` or `astro:env/server`; `PUBLIC_SITE_URL` remains a configuration input because Astro's config runs before the `astro:env` module is available. Use an hCaptcha site key/secret pair for the same site. `CONTACT_FROM_EMAIL` must be a sender address authorized in Resend; visitors' addresses are sent as `reply_to`. The form stays disabled until its public site key is available. Never commit the private values.

Replace `CONTACT_FROM_EMAIL` with an address on a domain verified for sending in Resend. An `@example.com` placeholder is rejected by the action before it attempts delivery. The Resend testing sender `onboarding@resend.dev` is an option while setting up the integration, subject to Resend's testing-domain recipient restrictions. The server logs the HTTP status and provider error code for rejected sends without logging the API key or message body.
Both `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` must be valid email addresses. `CONTACT_FROM_EMAIL` may also use Resend's `Name <address@domain.com>` format. A bare domain or a display name alone is not a sender address; the action reports these configuration errors before calling Resend.

For local testing, `pnpm dev` submits hCaptcha's published test response token and verifies it with the matching test site key and secret. No widget or checkbox appears in development, so the form works on `localhost`. Production builds use only the configured real key pair and render the widget. Set the Resend variables to test actual email delivery. Do not deploy the development server because the test pair provides no bot protection.

The About and CV text in `src/content/resume/` is explicitly draft placeholder copy. Replace both language versions before treating it as personal biography or career history.

Public About-page profile URLs and the optional public email address live in `src/lib/contact-links.ts`. Until supplied, the profile cards are labeled as drafts and the email card links to the contact form. The private Resend sender and recipient addresses are never displayed there.

Styling uses Tailwind CSS v4 with the existing neubrutalist tokens in `src/styles/tokens.css`. Shared theme, MDX prose, and print rules live in `src/styles/tailwind.css`.

`AGENTS.md`, `DESIGN.md`, and the files in `docs/` describe the implementation rules. `src/content.config.ts` is the active schema; `src/content.config.ts.example` is the original reference template.
