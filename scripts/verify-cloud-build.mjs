import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function requireCloudConfig(env) {
  const names = ['PUBLIC_TINA_CLIENT_ID', 'TINA_TOKEN', 'GITHUB_BRANCH'];
  const missing = names.filter(name => !env[name]?.trim());
  if (missing.length) throw new Error(`Missing Tina Cloud configuration: ${missing.join(', ')}`);
  if (env.GITHUB_BRANCH !== 'source') throw new Error('Production Tina branch must be source');
  if (!/^[a-zA-Z0-9_-]+$/.test(env.PUBLIC_TINA_CLIENT_ID)) throw new Error('Invalid Tina client ID format');
  return `/content/${env.PUBLIC_TINA_CLIENT_ID}/github/source`;
}

function* files(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isSymbolicLink()) throw new Error('Unexpected symlink in public artifact');
    if (item.isDirectory()) yield* files(file);
    else yield file;
  }
}

export function verifyCloudArtifact(root, env) {
  const expected = requireCloudConfig(env);
  const client = fs.readFileSync(path.join(root, 'tina/__generated__/client.ts'), 'utf8');
  // Inspect the selected API URL, not unused localhost strings bundled by dependencies.
  const urls = [...client.matchAll(/(?:apiUrl|url)\s*:\s*(?:process\.env\.TINA_LOCAL_URL\s*\|\|\s*)?["'`]([^"'`]+)["'`]/g)].map(match => match[1]);
  const selected = urls.length === 1 ? new URL(urls[0]) : null;
  if (!selected || selected.origin !== 'https://content.tinajs.io' ||
      selected.pathname.replace(/^\/\d+(?:\.\d+)*\//, '/') !== expected ||
      selected.search || selected.hash || selected.username || selected.password) {
    throw new Error('Generated Tina client does not select the expected Cloud API');
  }
  const publicRoot = path.join(root, 'dist/client');
  const admin = path.join(publicRoot, 'admin');
  if (!fs.existsSync(path.join(admin, 'index.html'))) throw new Error('Missing public admin entry');
  let cloudInAdmin = false;
  for (const file of files(publicRoot)) {
    const bytes = fs.readFileSync(file);
    if (bytes.includes(Buffer.from(env.TINA_TOKEN))) throw new Error('Private Tina token found in public artifact');
    if (file.startsWith(admin + path.sep) && bytes.includes(Buffer.from(selected.href))) cloudInAdmin = true;
  }
  if (!cloudInAdmin) throw new Error('Public admin bundle is missing the expected Cloud API');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv[2] === 'config') requireCloudConfig(process.env);
    else if (process.argv[2] === 'artifact') verifyCloudArtifact(process.cwd(), process.env);
    else throw new Error('Expected config or artifact mode');
    console.log('Tina Cloud production guard passed');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
