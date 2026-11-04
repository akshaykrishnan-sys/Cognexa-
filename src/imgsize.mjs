// Adds width/height to local <img> tags (read from the WebP/PNG/JPEG header) so pages don't jump while images load.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './content.mjs';
const cache = new Map();
export function dims(src) {
  if (cache.has(src)) return cache.get(src);
  const f = join(ROOT, 'public', src.split('?')[0]);
  let out = null;
  if (existsSync(f)) {
    const b = readFileSync(f);
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const c = b.toString('ascii', 12, 16);
      if (c === 'VP8 ') out = [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      else if (c === 'VP8L') { const n = b.readUInt32LE(21); out = [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
      else if (c === 'VP8X') out = [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    } else if (b.readUInt32BE(0) === 0x89504e47) out = [b.readUInt32BE(16), b.readUInt32BE(20)];
    else if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2; while (i < b.length) { if (b[i] !== 0xff) break; const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) { out = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break; } i += 2 + len; }
    }
  }
  cache.set(src, out); return out;
}
export function sizeImages(html) {
  return html.replace(/<img\b([^>]*?)>/g, (m, attrs) => {
    if (/\bwidth=/.test(attrs)) return m;
    const src = (attrs.match(/\bsrc="([^"]+)"/) || [])[1];
    if (!src || !src.startsWith('/')) return m;
    const d = dims(src); if (!d) return m;
    return `<img${attrs} width="${d[0]}" height="${d[1]}"${/\bdecoding=/.test(attrs) ? '' : ' decoding="async"'}>`;
  });
}
