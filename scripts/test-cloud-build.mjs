import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { requireCloudConfig, verifyCloudArtifact } from './verify-cloud-build.mjs';

const env = { PUBLIC_TINA_CLIENT_ID: 'test-client', TINA_TOKEN: 'synthetic-private-test-token', GITHUB_BRANCH: 'source' };
const api = 'https://content.tinajs.io/2.4/content/test-client/github/source';
test('missing configuration and wrong branches fail without printing values', () => {
  for (const key of Object.keys(env)) assert.throws(() => requireCloudConfig({ ...env, [key]: '' }), new RegExp(key));
  assert.throws(() => requireCloudConfig({ ...env, GITHUB_BRANCH: 'preview' }), /branch/);
  assert.equal(requireCloudConfig(env), '/content/test-client/github/source');
});
test('reject local/wrong client and token leaks; allow unused library localhost text', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tina-cloud-guard-'));
  try {
    fs.mkdirSync(path.join(root, 'tina/__generated__'), { recursive: true });
    fs.mkdirSync(path.join(root, 'dist/client/admin'), { recursive: true });
    const client = path.join(root, 'tina/__generated__/client.ts');
    const bundle = path.join(root, 'dist/client/admin/index.html');
    fs.writeFileSync(client, `createClient({url: process.env.TINA_LOCAL_URL || "${api}"})`);
    fs.writeFileSync(bundle, `${api} unused library http://localhost:4001/graphql`);
    assert.doesNotThrow(() => verifyCloudArtifact(root, env));
    for (const url of ['http://localhost:4001/graphql', api.replace('test-client', 'wrong-client')]) {
      fs.writeFileSync(client, `createClient({url: "${url}"})`);
      assert.throws(() => verifyCloudArtifact(root, env), /Cloud API/);
    }
    fs.writeFileSync(client, `createClient({url: process.env.TINA_LOCAL_URL || "${api}"})`);
    fs.writeFileSync(bundle, 'local only');
    assert.throws(() => verifyCloudArtifact(root, env), /Cloud API/);
    fs.writeFileSync(bundle, `${api} ${env.TINA_TOKEN}`);
    assert.throws(() => verifyCloudArtifact(root, env), /Private Tina token/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
