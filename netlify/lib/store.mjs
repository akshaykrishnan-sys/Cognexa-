// Storage for leads and hesitation-check results.
// On Netlify this uses Netlify Blobs (no database to run). Locally, and in tests, it falls back to JSON files in .data/.
import { getStore } from '@netlify/blobs';
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const LOCAL_DIR = process.env.CX_DATA_DIR || join(process.cwd(), '.data');

function localStore(name) {
  const dir = join(LOCAL_DIR, name);
  mkdirSync(dir, { recursive: true });
  const file = (k) => join(dir, encodeURIComponent(k) + '.json');
  return {
    async get(key) { return existsSync(file(key)) ? JSON.parse(readFileSync(file(key), 'utf8')) : null; },
    async set(key, value) { writeFileSync(file(key), JSON.stringify(value, null, 2)); },
    async delete(key) { if (existsSync(file(key))) rmSync(file(key)); },
    async keys(prefix = '') { return readdirSync(dir).map(f => decodeURIComponent(f.replace(/\.json$/, ''))).filter(k => k.startsWith(prefix)); },
  };
}

function blobStore(name) {
  const s = getStore({ name, consistency: 'strong' });
  return {
    async get(key) { return s.get(key, { type: 'json' }); },
    async set(key, value) { await s.setJSON(key, value); },
    async delete(key) { await s.delete(key); },
    async keys(prefix = '') { const out = []; for await (const page of s.list({ prefix, paginate: true })) out.push(...page.blobs.map(b => b.key)); return out; },
  };
}

export function store(name) {
  if (process.env.CX_LOCAL_STORE === '1') return localStore(name);
  try { return blobStore(name); } catch (e) {
    if (process.env.NETLIFY && process.env.CONTEXT) throw e; // on Netlify, a missing Blobs context is a real error
    return localStore(name);
  }
}

export async function all(name, prefix = '') {
  const s = store(name);
  const keys = await s.keys(prefix);
  const rows = await Promise.all(keys.map(k => s.get(k)));
  return rows.filter(Boolean);
}
