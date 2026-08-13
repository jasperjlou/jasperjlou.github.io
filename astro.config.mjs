import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

export default defineConfig({
  site: 'https://jasperjlou.me',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  publicDir: './static',
  // Tina's live island endpoint posts to a URL without a trailing slash.
  // Existing public links still use trailing slashes; Astro now accepts both.
  trailingSlash: 'ignore',
  integrations: [sitemap(), tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ['@tinacms/astro', '@tinacms/bridge'] },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
