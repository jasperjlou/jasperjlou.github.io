import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

// All content changes happen in a disposable checkout, never in Tina Cloud.
const { chromium } = await import(pathToFileURL(`${process.env.RUNNER_TEMP}/tina-browser/node_modules/playwright/index.mjs`).href);
const contentPath = 'src/content/home/home.json';
const originalBytes = fs.readFileSync(contentPath);
const original = JSON.parse(originalBytes);
const results = [], errors = [];
let child, page, phase = 'starting';
const browser = await chromium.launch({ headless: true });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function begin(name) { phase = name; console.log(`ACCEPTANCE: ${name}`); }
async function waitUntil(check, message, attempts = 60) {
  for (let i = 0; i < attempts; i++) { if (await check()) return; await wait(500); }
  throw new Error(message);
}
async function start(args, log, env = {}) {
  const fd = fs.openSync(log, 'w');
  child = spawn('npm', args, { detached: true, env: { ...process.env, ...env }, stdio: ['ignore', fd, fd] });
  await waitUntil(async () => { try { return (await fetch('http://localhost:4321/')).ok; } catch { return false; } }, 'Server unavailable', 180);
}
async function stop() {
  if (child) { try { process.kill(-child.pid, 'SIGTERM'); } catch {} child = undefined; await wait(1500); }
}
try {
  begin('built site');
  await start(['run', 'preview'], 'evidence/preview.log', { HOST: '0.0.0.0', PORT: '4321' });
  for (const width of [1440, 390]) {
    const publicPage = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    publicPage.setDefaultTimeout(20000);
    publicPage.setDefaultNavigationTimeout(30000);
    publicPage.on('pageerror', error => errors.push(error.message));
    const response = await publicPage.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    assert.ok(response.ok());
    assert.equal(await publicPage.locator('link[rel="canonical"]').getAttribute('href'), 'https://jasperjlou.me/');
    assert.ok(await publicPage.locator('h1').count());
    assert.ok(await publicPage.locator('a[href*="projects/holistic-assistant"]').count());
    const height = await publicPage.locator('body').evaluate(element => element.scrollHeight);
    for (let y = 0; y < height; y += 650) { await publicPage.evaluate(y => scrollTo(0, y), y); await wait(150); }
    await publicPage.evaluate(() => scrollTo(0, 0));
    await wait(500);
    await publicPage.screenshot({ path: `evidence/home-${width}.png`, fullPage: true });
    results.push({ test: `built homepage, full scroll and canonical at ${width}px`, status: 'passed' });
    await publicPage.close();
  }
  await stop();
  begin('editor entry');
  await start(['run', 'dev'], 'evidence/dev.log');
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(30000);
  page.on('dialog', dialog => dialog.accept());
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:4321/admin/index.html', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Enter Edit Mode', exact: true }).click();
  const title = page.locator('input[name="seoTitle"]');
  await title.waitFor({ state: 'visible' });
  assert.equal(await title.inputValue(), original.seoTitle);
  results.push({ test: 'local edit-mode entry and populated home form', status: 'passed' });

  begin('save round-trip');
  const marker = `${original.seoTitle} [CI round-trip]`;
  await title.fill(marker);
  await title.blur();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitUntil(() => JSON.parse(fs.readFileSync(contentPath)).seoTitle === marker, 'Save did not reach the local filesystem');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await title.waitFor({ state: 'visible' });
  assert.equal(await title.inputValue(), marker);
  await title.fill(original.seoTitle);
  await title.blur();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await waitUntil(() => JSON.parse(fs.readFileSync(contentPath)).seoTitle === original.seoTitle, 'Restoring the original value failed');
  results.push({ test: 'edit, save, reload and restore local content', status: 'passed' });
  await page.screenshot({ path: 'evidence/editor-saved.png', fullPage: true });

  begin('live preview');
  await page.getByRole('button', { name: '首页开场', exact: true }).click();
  const heading = page.locator('input[name$=".titleFirst"]').first();
  await heading.waitFor({ state: 'visible' });
  const oldHeading = await heading.inputValue();
  await heading.fill('CI live preview check');
  await page.frameLocator('iframe').first().locator('h1').filter({ hasText: 'CI live preview check' }).waitFor({ state: 'visible', timeout: 30000 });
  results.push({ test: 'unsaved hero edit appears in the live preview iframe', status: 'passed' });
  await page.screenshot({ path: 'evidence/live-preview.png', fullPage: true });
  await heading.fill(oldHeading);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('input[name="seoTitle"]').waitFor({ state: 'visible' });

  begin('media library');
  // The first role=button is a disabled form action, not the menu. The inspected
  // 1440px desktop layout places the visible navigation icon at (32,36).
  // Assert the resulting navigation state rather than assuming a hash route.
  await page.mouse.click(32, 36);
  await wait(700);
  fs.writeFileSync('evidence/navigation.txt', await page.locator('body').innerText());
  fs.writeFileSync('evidence/navigation-controls.json', JSON.stringify(await page.locator('button,a,[role="button"]').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent, label: node.getAttribute('aria-label'), href: node.getAttribute('href') }))), null, 2));
  await page.screenshot({ path: 'evidence/navigation.png', fullPage: true });
  const media = page.getByText(/^(Media|媒体|媒体库)$/, { exact: true }).first();
  await media.waitFor({ state: 'visible', timeout: 10000 });
  await media.click();
  await wait(2000);
  const mediaText = await page.locator('body').innerText();
  fs.writeFileSync('evidence/media.txt', mediaText);
  await page.screenshot({ path: 'evidence/media.png', fullPage: true });
  assert.ok(/media|媒体/i.test(mediaText) && /upload|files|folder|assets|上传/i.test(mediaText), 'Media library did not render');
  results.push({ test: 'local media library navigation and listing (no upload)', status: 'passed' });
  assert.deepEqual(errors, [], 'Unexpected page errors');
} catch (error) {
  if (page) {
    fs.writeFileSync('evidence/failure-dom.json', JSON.stringify({ phase, url: page.url(), text: await page.locator('body').innerText(), fields: await page.locator('input,textarea').evaluateAll(nodes => nodes.map(node => ({ name: node.name, type: node.type, value: node.value }))), errors }, null, 2));
    await page.screenshot({ path: 'evidence/failure.png', fullPage: true });
  }
  throw error;
} finally {
  await browser.close();
  await stop();
  fs.writeFileSync(contentPath, originalBytes);
  fs.writeFileSync('evidence/browser-results.json', JSON.stringify({ results, errors, cloudAuthenticationTested: false, productionWrites: false }, null, 2));
}
