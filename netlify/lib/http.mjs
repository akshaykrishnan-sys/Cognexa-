import { timingSafeEqual, createHash } from 'node:crypto';

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

export const error = (status, message) => json({ error: message }, status);

const digest = (s) => createHash('sha256').update(String(s)).digest();

/** Admin routes need `Authorization: Bearer <ADMIN_TOKEN>`. Returns a Response when the request must stop. */
export function requireAdmin(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || token.length < 16) return error(503, 'The leads dashboard is not set up yet. Add an ADMIN_TOKEN environment variable of at least 16 characters in Netlify.');
  const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!got || !timingSafeEqual(digest(got), digest(token))) return error(401, 'Wrong or missing access token.');
  return null;
}

export const clean = (v, max = 4000) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || ''));
