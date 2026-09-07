# StudySpot landing page

Marketing site for the frozen original implementation. The live studyspot.us
is a separate rewrite; see the [repository status](../../README.md).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies with `pnpm install` from the repository root. The committed
`dev` script runs Wrangler, not Next.js/Turbopack, and requires an OpenNext build.
From the repository root:

```bash
cd apps/landing-page
pnpm build:cloudflare
pnpm dev:wrangler
```

`dev:wrangler` selects port 3001; open [http://localhost:3001](http://localhost:3001).
`pnpm dev` (also root `pnpm dev:landing`) uses Wrangler's default port, which can
conflict with the assistant on 8787. Both serve generated `.open-next` output;
rebuild after source edits.

Edit `src/app/page.tsx` and the components under `src/features/landing/`.
The plain `pnpm build` script runs `next build`; it does not generate the
`.open-next/worker.js` and `.open-next/assets` paths used by `wrangler.toml`.

Inspect scripts and local configuration before running builds or servers.
These instructions describe source configuration, not a runtime-verified setup.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Cloudflare deployment

The committed deployment target is Cloudflare Workers, not Pages or Vercel.
After an OpenNext build, `pnpm deploy` inside this package deploys the existing
output through OpenNext. Root `pnpm deploy` also includes this landing worker,
but root `pnpm build` excludes it. Deployment requires separately authorized
Cloudflare access; these commands do not describe the live studyspot.us rewrite.

See `package.json`, `wrangler.toml`, `open-next.config.ts` and the
[OpenNext Cloudflare guide](https://opennext.js.org/cloudflare/get-started).

## Upstream template deployment reference

The following Vercel links are retained from the create-next-app template as
alternative-platform reference material, not this repository's deployment process.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
