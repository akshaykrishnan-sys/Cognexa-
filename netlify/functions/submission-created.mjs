// Runs automatically for every verified Netlify Forms submission (the function name is the trigger).
// Saves the lead to the "leads" store and sends the notifications configured in netlify/lib/notify.mjs.
import { connectLambda } from '@netlify/blobs';
import { store } from '../lib/store.mjs';
import { clean, isEmail } from '../lib/http.mjs';
import { notifyTeam } from '../lib/notify.mjs';

export function toLead(payload, now = new Date()) {
  const d = payload.data || {};
  const created = payload.created_at ? new Date(payload.created_at) : now;
  const id = `${created.toISOString().replace(/[:.]/g, '-')}_${clean(payload.id || Math.random().toString(36).slice(2, 10), 40)}`;
  return {
    id,
    createdAt: created.toISOString(),
    form: clean(payload.form_name || d['form-name'] || 'unknown', 60),
    name: clean(d.name, 200),
    email: clean(d.email, 200).toLowerCase(),
    organisation: clean(d.organisation, 200),
    brief: clean(d.brief || d.problem, 6000),
    area: clean(d.area, 60),
    service: clean(d.service, 120),
    office: clean(d.office, 60),
    day: clean(d.day, 60),
    time: clean(d.time, 20),
    source: clean(d.referrer || payload.site_url || '', 300),
    status: 'new',
    notes: [],
    history: [{ at: created.toISOString(), event: 'received' }],
  };
}

export const handler = async (event) => {
  try { connectLambda(event); } catch { /* local runs use the file store */ }
  const body = JSON.parse(event.body || '{}');
  const payload = body.payload || {};
  if (payload.data?.['bot-field']) return { statusCode: 200, body: 'ignored' };
  const lead = toLead(payload);
  if (!isEmail(lead.email)) return { statusCode: 200, body: 'ignored: no valid email' };
  await store('leads').set(lead.id, lead);
  const sent = await notifyTeam(lead, process.env.URL).catch(e => ({ error: e.message }));
  await store('leads').set(lead.id, { ...lead, history: [...lead.history, { at: new Date().toISOString(), event: 'notified', detail: sent }] });
  return { statusCode: 200, body: JSON.stringify({ ok: true, id: lead.id }) };
};
