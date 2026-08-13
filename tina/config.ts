import { defineConfig } from 'tinacms';
import { homeCollection } from './collections/home';
import { postCollection } from './collections/post';
import { projectCollection } from './collections/project';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.GITHUB_REF_NAME ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'source';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'static',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'static',
    },
  },
  schema: {
    collections: [homeCollection, projectCollection, postCollection],
  },
});
