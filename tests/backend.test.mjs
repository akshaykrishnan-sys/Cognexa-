import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.CX_LOCAL_STORE = '1';
process.env.CX_DATA_DIR = mkdtempSync(join(tmpdir(), 'cx-'));
process.env.ADMIN_TOKEN = 'test-token-1234567890';
const AUTH = { authorization: 'Bearer test-token-1234567890' };

const { handler, toLead } = await import('../netlify/functions/submission-created.mjs');
const leads = (await import('../netlify/functions/leads.mjs')).default;
const check = (await import('../netlify/functions/check.mjs')).default;
const req = (path, opts = {}) => new Request('http://x' + path, opts);
const event = (data, form = 'fit-call') => ({ body: JSON.stringify({ payload: { form_name: form, data, created_at: '2026-11-04T10:00:00.000Z', id: Math.random().toString(36).slice(2) } }) });

test('a form submission becomes a lead', async () => {
  const r = await handler(event({ name: 'Asha', email: 'ASHA@example.com', organisation: 'Acme', brief: 'Checkout is flat', service: 'Consulting', day: 'Fri', time: '11:30' }));
  assert.equal(r.statusCode, 200);
  const list = await (await leads(req('/api/leads', { headers: AUTH }), {})).json();
  assert.equal(list.leads.length, 1);
  assert.equal(list.leads[0].email, 'asha@example.com');
  assert.equal(list.leads[0].status, 'new');
  assert.equal(list.counts.new, 1);
});

test('spam and submissions without an email are ignored', async () => {
  assert.match((await handler(event({ email: 'a@b.co', 'bot-field': 'x' }))).body, /ignored/);
  assert.match((await handler(event({ name: 'No email' }))).body, /ignored/);
});

test('the leads API refuses a missing or wrong token', async () => {
  assert.equal((await leads(req('/api/leads'), {})).status, 401);
  assert.equal((await leads(req('/api/leads', { headers: { authorization: 'Bearer nope' } }), {})).status, 401);
});

test('status, owner and notes update, with history', async () => {
  const { leads: [l] } = await (await leads(req('/api/leads', { headers: AUTH }), {})).json();
  const r = await leads(req('/api/leads/' + l.id, { method: 'PATCH', headers: { ...AUTH, 'content-type': 'application/json' }, body: JSON.stringify({ status: 'call booked', owner: 'Hari', note: 'Thursday 10:00' }) }), { params: { id: l.id } });
  const { lead } = await r.json();
  assert.equal(lead.status, 'call booked'); assert.equal(lead.owner, 'Hari'); assert.equal(lead.notes[0].text, 'Thursday 10:00');
  assert.ok(lead.history.some(h => h.event.includes('new → call booked')));
  const bad = await leads(req('/api/leads/' + l.id, { method: 'PATCH', headers: AUTH, body: JSON.stringify({ status: 'nope' }) }), { params: { id: l.id } });
  assert.equal(bad.status, 400);
});

test('CSV export and delete', async () => {
  const csv = await (await leads(req('/api/leads?format=csv', { headers: AUTH }), {})).text();
  assert.match(csv.split('\n')[0], /^createdAt,status,owner,name,email/);
  assert.match(csv, /asha@example.com/);
  const { leads: [l] } = await (await leads(req('/api/leads', { headers: AUTH }), {})).json();
  assert.equal((await leads(req('/api/leads/' + l.id, { method: 'DELETE', headers: AUTH }), { params: { id: l.id } })).status, 200);
  assert.equal((await (await leads(req('/api/leads', { headers: AUTH }), {})).json()).leads.length, 0);
});

test('hesitation check results are validated and counted', async () => {
  const post = (b) => check(req('/api/check', { method: 'POST', body: JSON.stringify(b) }), {});
  assert.equal((await post({ lever: 'trust', industry: 'fintech', pace: 'sprint' })).status, 201);
  assert.equal((await post({ lever: 'choice', industry: 'nonsense' })).status, 201);
  assert.equal((await post({ lever: 'hack' })).status, 400);
  assert.equal((await check(req('/api/check/stats'), {})).status, 401);
  const s = await (await check(req('/api/check/stats', { headers: AUTH }), {})).json();
  assert.equal(s.total, 2); assert.equal(s.byLever.trust, 1); assert.equal(s.byIndustry.fintech, 1); assert.equal(s.byIndustry['not given'], 1);
});

test('lead fields are trimmed and length-limited', () => {
  const l = toLead({ form_name: 'fit-call', data: { name: '  A  ', email: 'x@y.co', brief: 'b'.repeat(9000) } });
  assert.equal(l.name, 'A'); assert.equal(l.brief.length, 6000);
});

test('newsletter sign-ups go to subscribers, not leads, and are de-duplicated', async () => {
  const subs = (await import('../netlify/functions/subscribers.mjs')).default;
  await handler(event({ email: 'Reader@Example.com' }, 'newsletter'));
  await handler(event({ email: 'reader@example.com' }, 'newsletter'));
  const s = await (await subs(req('/api/subscribers', { headers: AUTH }), {})).json();
  assert.equal(s.total, 1); assert.equal(s.subscribers[0].email, 'reader@example.com');
  assert.ok(!(await (await leads(req('/api/leads', { headers: AUTH }), {})).json()).leads.some(l => l.form === 'newsletter'));
  assert.equal((await subs(req('/api/subscribers'), {})).status, 401);
});
