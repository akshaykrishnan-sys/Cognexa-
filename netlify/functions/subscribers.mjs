// Newsletter subscribers (admin): GET /api/subscribers → JSON, ?format=csv → spreadsheet. DELETE /api/subscribers/:email unsubscribes.
import { store, all } from '../lib/store.mjs';
import { json, error, requireAdmin } from '../lib/http.mjs';

export default async (req, context) => {
  const denied = requireAdmin(req); if (denied) return denied;
  const email = context?.params?.email;
  if (email && req.method === 'DELETE') { await store('subscribers').delete(decodeURIComponent(email).toLowerCase()); return json({ ok: true }); }
  if (req.method !== 'GET') return error(405, 'Method not allowed.');
  const rows = (await all('subscribers')).sort((a, b) => String(b.at).localeCompare(String(a.at)));
  if (new URL(req.url).searchParams.get('format') === 'csv') return new Response(['email,subscribed_at,source', ...rows.map(r => [r.email, r.at, `"${String(r.source || '').replace(/"/g, '""')}"`].join(','))].join('\n'), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="cognexa-subscribers.csv"', 'cache-control': 'no-store' } });
  return json({ subscribers: rows, total: rows.length });
};
export const config = { path: ['/api/subscribers', '/api/subscribers/:email'] };
