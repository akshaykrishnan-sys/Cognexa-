// Leads API for the dashboard at /admin/leads/. Every route needs the ADMIN_TOKEN.
//   GET    /api/leads                 list (filters: ?status=new&q=text), ?format=csv for a spreadsheet
//   GET    /api/leads/:id             one lead
//   PATCH  /api/leads/:id             { status?, note?, owner? }
//   DELETE /api/leads/:id             erase a lead (data-protection requests)
import { store, all } from '../lib/store.mjs';
import { json, error, requireAdmin, clean } from '../lib/http.mjs';

export const STATUSES = ['new', 'contacted', 'call booked', 'proposal sent', 'won', 'lost', 'spam'];
const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export default async (req, context) => {
  const denied = requireAdmin(req); if (denied) return denied;
  const id = context?.params?.id;
  const s = store('leads');
  if (!id && req.method === 'GET') {
    const u = new URL(req.url);
    const st = u.searchParams.get('status'), q = (u.searchParams.get('q') || '').toLowerCase();
    let rows = (await all('leads')).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (st) rows = rows.filter(r => r.status === st);
    if (q) rows = rows.filter(r => [r.name, r.email, r.organisation, r.brief, r.service].join(' ').toLowerCase().includes(q));
    if (u.searchParams.get('format') === 'csv') {
      const cols = ['createdAt', 'status', 'owner', 'name', 'email', 'organisation', 'form', 'area', 'service', 'office', 'day', 'time', 'brief'];
      const body = [cols.join(','), ...rows.map(r => cols.map(c => csvCell(r[c])).join(','))].join('\n');
      return new Response(body, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="cognexa-leads-${new Date().toISOString().slice(0, 10)}.csv"`, 'cache-control': 'no-store' } });
    }
    const counts = Object.fromEntries(STATUSES.map(x => [x, 0]));
    for (const r of await all('leads')) counts[r.status] = (counts[r.status] || 0) + 1;
    return json({ leads: rows, counts, statuses: STATUSES });
  }
  if (!id) return error(405, 'Use GET on /api/leads.');
  const lead = await s.get(id);
  if (!lead) return error(404, 'No lead with that id.');
  if (req.method === 'GET') return json({ lead });
  if (req.method === 'DELETE') { await s.delete(id); return json({ ok: true, deleted: id }); }
  if (req.method === 'PATCH') {
    let b; try { b = await req.json(); } catch { return error(400, 'Send a JSON body.'); }
    const now = new Date().toISOString(), history = [...(lead.history || [])], next = { ...lead };
    if (b.status !== undefined) {
      if (!STATUSES.includes(b.status)) return error(400, `Status must be one of: ${STATUSES.join(', ')}.`);
      if (b.status !== lead.status) history.push({ at: now, event: `status: ${lead.status} → ${b.status}` });
      next.status = b.status;
    }
    if (b.owner !== undefined) { next.owner = clean(b.owner, 80); history.push({ at: now, event: `owner: ${next.owner || 'none'}` }); }
    if (b.note) next.notes = [...(lead.notes || []), { at: now, text: clean(b.note, 2000) }];
    next.history = history; next.updatedAt = now;
    await s.set(id, next);
    return json({ lead: next });
  }
  return error(405, 'Method not allowed.');
};

export const config = { path: ['/api/leads', '/api/leads/:id'] };
