import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { toJSON, fromJSON, collection, ROOT } from '../src/content.mjs';

test('content JSON converts to template tuples and back without loss', () => {
  for (const [dir, kind] of [['industries', 'industry'], ['services', 'service'], ['articles', 'article']]) {
    for (const f of readdirSync(`${ROOT}/content/${dir}`)) {
      const raw = JSON.parse(readFileSync(`${ROOT}/content/${dir}/${f}`, 'utf8'));
      assert.deepEqual(toJSON(kind, fromJSON(kind, raw)), raw, `${dir}/${f}`);
    }
  }
});

test('no page links to the removed industry pages', () => {
  let out = '';
  try { out = execFileSync('grep', ['-rl', 'href="/industries/', `${ROOT}/public`, '--include=index.html'], { encoding: 'utf8' }).trim(); } catch { /* grep exits 1 when nothing matches */ }
  assert.equal(out, '');
});

test('related articles point at real articles', () => {
  const slugs = new Set(collection('articles').map(a => a.slug));
  for (const a of collection('articles', 'article')) for (const r of a.rel) assert.ok(slugs.has(r), `${a.slug} → ${r}`);
});

test('the CMS config names every content folder', () => {
  const cfg = readFileSync(`${ROOT}/public/admin/config.yml`, 'utf8');
  for (const d of ['content/services', 'content/articles', 'content/cases', 'content/settings/site.json', 'content/settings/seo.json', 'content/settings/clients.json', 'content/pages/privacy.json']) assert.ok(cfg.includes(d), d);
});

test('the site builds and every page exists', () => {
  const out = execFileSync('node', ['src/build.mjs'], { cwd: ROOT }).toString();
  assert.match(out, /Built \d+ pages/);
  for (const p of ['index.html', 'services/ux-design/index.html', 'thinking/index.html', 'case-studies/checkout-trust-gap-closed/index.html', 'check/index.html', 'privacy/index.html']) assert.ok(existsSync(`${ROOT}/public/${p}`), p);
});
