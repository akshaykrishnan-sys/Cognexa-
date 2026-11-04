// Hesitation check results.
//   POST /api/check         public: { lever, industry, pace } — anonymous, no personal data
//   GET  /api/check/stats   admin:  totals by lever, industry, pace and day
import { store, all } from '../lib/store.mjs';
import { json, error, requireAdmin } from '../lib/http.mjs';

export const LEVERS = ['trust', 'choice', 'effort', 'loss', 'habit'];
export const PACES = ['sprint', 'audit', 'read'];
export const INDUSTRIES = ['', 'e-commerce', 'b2b-saas', 'healthcare', 'education', 'fintech'];

export default async (req, context) => {
  const u = new URL(req.url);
  if (u.pathname.endsWith('/stats')) {
    const denied = requireAdmin(req); if (denied) return denied;
    const rows = await all('checks');
    const tally = (k) => rows.reduce((m, r) => ((m[r[k] || 'not given'] = (m[r[k] || 'not given'] || 0) + 1), m), {});
    const days = {};
    const since = Date.now() - 30 * 864e5;
    for (const r of rows) if (Date.parse(r.at) >= since) { const d = r.at.slice(0, 10); days[d] = (days[d] || 0) + 1; }
    return json({ total: rows.length, byLever: tally('lever'), byIndustry: tally('industry'), byPace: tally('pace'), last30Days: days });
  }
  if (req.method !== 'POST') return error(405, 'Use POST.');
  let b; try { b = await req.json(); } catch { return error(400, 'Send a JSON body.'); }
  if (!LEVERS.includes(b.lever)) return error(400, 'Unknown lever.');
  const row = { at: new Date().toISOString(), lever: b.lever, industry: INDUSTRIES.includes(b.industry) ? b.industry : '', pace: PACES.includes(b.pace) ? b.pace : '', country: context?.geo?.country?.code || '' };
  await store('checks').set(`${row.at.replace(/[:.]/g, '-')}_${Math.random().toString(36).slice(2, 8)}`, row);
  return json({ ok: true }, 201);
};

export const config = { path: ['/api/check', '/api/check/stats'] };
