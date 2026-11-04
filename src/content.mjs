// Content layer: every editable piece of copy lives as JSON under /content and is edited in the CMS (/admin).
// Templates were written against compact tuple arrays, so this module converts the named-field JSON
// the CMS writes back into those tuples. TUPLES lists the field names for each tuple-shaped list.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'content');

export const TUPLES = {
  industry: {
    'hero.path': ['label', 'sub'],
    insights: ['tag', 'title', 'text'],
    map: ['symptom', 'change', 'services'],
    cases: ['image', 'kicker', 'title', 'number', 'measure', 'lever'],
    mods: ['title', 'text'],
    faq: ['question', 'answer'],
  },
  service: {
    pains: ['title', 'text'],
    svcs: ['name', 'description', 'insight', 'outcome'],
    cases: ['kicker', 'title', 'number', 'measure', 'lever'],
    faq: ['question', 'answer'],
  },
  article: { s: ['heading', 'text'] },
};
// plain string lists are stored as [{ text }] so the CMS can edit them as lists
export const STRINGS = {
  industry: ['hero.tags'],
  service: ['hero.tags', 'hero.path', 'steps', 'views', 'deliv', 'prices'],
  article: ['call', 'rel'],
};

const get = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const set = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); const t = ks.reduce((x, k) => (x[k] ??= {}), o); t[last] = v; };
const imgPath = (v) => (typeof v === 'string' && /^\d+:\d+$/.test(v) ? `/assets/img/n${v.replace(':', '-')}.webp` : v);

/** tuple form -> named JSON (used once to seed /content, and by tests) */
export function toJSON(kind, obj) {
  const o = structuredClone(obj);
  for (const [p, names] of Object.entries(TUPLES[kind] || {})) {
    const v = get(o, p); if (!Array.isArray(v)) continue;
    set(o, p, v.map(t => Object.fromEntries(names.map((n, i) => [n, n === 'services' ? (t[i] || []).map(x => ({ text: x })) : (n === 'image' ? imgPath(t[i]) : t[i])]).filter(([, x]) => x !== undefined))));
  }
  for (const p of STRINGS[kind] || []) { const v = get(o, p); if (Array.isArray(v)) set(o, p, v.map(text => ({ text }))); }
  const walk = (x) => { if (x && typeof x === 'object') for (const k in x) { if (k === 'img') x[k] = imgPath(x[k]); else walk(x[k]); } };
  walk(o);
  return o;
}

/** named JSON -> tuple form used by the templates */
export function fromJSON(kind, obj) {
  const o = structuredClone(obj);
  for (const p of STRINGS[kind] || []) { const v = get(o, p); if (Array.isArray(v)) set(o, p, v.map(x => (typeof x === 'string' ? x : x.text))); }
  for (const [p, names] of Object.entries(TUPLES[kind] || {})) {
    const v = get(o, p); if (!Array.isArray(v)) continue;
    set(o, p, v.map(r => names.map(n => (n === 'services' ? (r[n] || []).map(x => (typeof x === 'string' ? x : x.text)) : r[n] ?? ''))));
  }
  return o;
}

export function readJSON(rel) { return JSON.parse(readFileSync(join(DIR, rel), 'utf8')); }
export function collection(name, kind) {
  const d = join(DIR, name);
  if (!existsSync(d)) return [];
  return readdirSync(d).filter(f => f.endsWith('.json')).map(f => readJSON(`${name}/${f}`))
    .filter(x => !x.draft)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || String(a.slug).localeCompare(String(b.slug)))
    .map(x => (kind ? fromJSON(kind, x) : x));
}
