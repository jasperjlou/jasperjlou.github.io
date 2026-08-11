# Agent Instructions

## Environment

- Work from WSL Ubuntu at `/mnt/a/my-tech-blog`.
- Load nvm from `/home/lrjerry/.nvm/nvm.sh` and use the default LTS Node.
- Do not use the Windows Node/npm installation for dependency or build work.

## Project

- This is an Astro static site deployed to GitHub Pages.
- Articles remain plain Markdown under `source/_posts/`.
- Project records live under `src/content/projects/`.
- `src/content.config.ts` validates required frontmatter and connects articles to projects.
- The default/source branch is `source`; production deployment is handled by GitHub Actions.

## Authoring

- Every article needs `title`, `date`, `slug`, and `description`.
- Add `project`, `stage`, and `order` to connect a post to a project timeline.
- Keep historical article prose intact when updating current project facts; put current metrics on the project page with a verification date.
- New project pages should be data-driven and should not place large inline CSS blocks in Markdown.

## Safety

- Never commit secrets, tokens, cookies, private credentials, `.env`, `node_modules/`, `dist/`, or `.astro/`.
- Preserve existing public post URLs and `public/CNAME`.
- Keep the previous `main` deployment branch available until the GitHub Actions cutover is accepted and verified.
- Do not rewrite Git history or delete a deployment branch without explicit approval.

## Verification

- Run `npm run check`.
- Run `npm run build`.
- Test the generated site at desktop and mobile sizes before publication.
- Confirm post URLs, project grouping, canonical metadata, `robots.txt`, `sitemap-index.xml`, `rss.xml`, and the custom domain artifact.
