// Local development server: serves /public, runs the Netlify Functions under /api/*,
// and imitates Netlify Forms (a form POST becomes a "submission-created" event).
// Usage: ADMIN_TOKEN=dev-token-1234567890 node tools/dev-server.mjs   →  http://localhost:8888
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.CX_LOCAL_STORE ??= '1';
const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'public');
const PORT = Number(process.env.PORT || 8888);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.yml': 'text/yaml', '.txt': 'text/plain', '.xml': 'application/xml', '.wasm': 'application/wasm' };

const leads = (await import('../netlify/functions/leads.mjs')).default;
const check = (await import('../netlify/functions/check.mjs')).default;
const subs = (await import('../netlify/functions/subscribers.mjs')).default;
const { handler: submission } = await import('../netlify/functions/submission-created.mjs');

async function body(req) { const c = []; for await (const x of req) c.push(x); return Buffer.concat(c); }
async function send(res, r) { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); }

createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`);
    const raw = ['GET', 'HEAD'].includes(req.method) ? undefined : await body(req);
    const request = () => new Request(u, { method: req.method, headers: req.headers, body: raw });
    let m;
    if ((m = u.pathname.match(/^\/api\/leads(?:\/([^/]+))?\/?$/))) return send(res, await leads(request(), { params: m[1] ? { id: decodeURIComponent(m[1]) } : {} }));
    if ((m = u.pathname.match(/^\/api\/subscribers(?:\/([^/]+))?\/?$/))) return send(res, await subs(request(), { params: m[1] ? { email: m[1] } : {} }));
    if (u.pathname.startsWith('/api/check')) return send(res, await check(request(), {}));
    if (req.method === 'POST' && String(req.headers['content-type']).includes('application/x-www-form-urlencoded')) {
      const data = Object.fromEntries(new URLSearchParams(raw.toString()));
      const r = await submission({ body: JSON.stringify({ payload: { form_name: data['form-name'], data, created_at: new Date().toISOString(), id: Math.random().toString(36).slice(2, 10) } }) });
      console.log('form', data['form-name'], '→', r.body);
      res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok');
    }
    let p = normalize(decodeURIComponent(u.pathname)).replace(/^(\.\.[/\\])+/, '');
    let f = join(ROOT, p);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if ((await stat(f).catch(() => null))?.isDirectory()) f = join(f, 'index.html');
    const buf = await readFile(f).catch(() => null);
    if (!buf) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(await readFile(join(ROOT, '404.html')).catch(() => 'Not found')); }
    res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(buf);
  } catch (e) { console.error(e); res.writeHead(500); res.end(String(e)); }
}).listen(PORT, () => console.log(`Cognexa dev server on http://localhost:${PORT}  (admin token: ${process.env.ADMIN_TOKEN ? 'set' : 'NOT SET, dashboard will refuse'})`));
