import { esc, arr, page } from './lib.mjs';

import { collection } from './content.mjs';
// Thinking articles: /content/articles/*.json (edited in the CMS)
export const ARTICLES = collection('articles', 'article').sort((a, b) => String(b.date).localeCompare(String(a.date)) || (a.order ?? 99) - (b.order ?? 99));
export const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
export const artHref = (slug) => `/thinking/${slug}/`;

export function relatedCards(slugs) {
  return `<section class="bg-paper3" style="padding:80px 0"><div class="wrap">
  <p class="mono" style="font-size:12px;color:#595957">Keep reading</p>
  <div class="related">${slugs.map((sl, i) => { const a = bySlug[sl]; if (!a) return ''; return `<a class="art rv" style="--d:${i}" href="${artHref(sl)}"><div class="im"><img src="${a.image}" alt="" loading="lazy"></div><p class="k">${a.topic.toUpperCase()}</p><h3>${esc(a.title)}</h3></a>`; }).join('')}</div>
</div></section>`;
}

export function articlePage(a) {
  const ids = a.s.map((_, i) => `s${i + 1}`);
  const body = `
<article>
<header class="bg-paper" style="padding:80px 0 48px"><div class="wrap ahead">
  <p class="mono rv" style="color:#595957"><a href="/thinking/" style="text-decoration:none">Thinking</a>&nbsp;&nbsp;/&nbsp;&nbsp;${esc(a.topic)}</p>
  <h1 class="rv" style="--d:1">${esc(a.title)}</h1>
  <p class="s rv" style="--d:2">${esc(a.lede)}</p>
  <p class="mono rv" style="--d:3;font-size:12px;color:#595957;margin-top:26px">${esc(a.author || 'Cognexa team')}&nbsp;&nbsp;/&nbsp;&nbsp;${a.read} min read${a.date ? `&nbsp;&nbsp;/&nbsp;&nbsp;${new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}</p>
</div></header>
<div class="bg-paper" style="padding:0 0 64px"><div class="wrap"><div class="acover rv-img"><img src="${a.image}" alt="${esc(a.title)}" fetchpriority="high"></div></div></div>
<div class="bg-paper" style="padding:0 0 96px"><div class="wrap abody">
  <nav class="toc" aria-label="In this article"><p class="mono-s" style="color:#595957">In this article</p>${a.s.map(([h], i) => `<a href="#${ids[i]}"${i ? '' : ' class="on"'}>${String(i + 1).padStart(2, '0')}&nbsp;&nbsp; ${esc(h)}</a>`).join('')}</nav>
  <div class="prose">
    <p class="rv">${esc(a.intro)}</p>
    ${a.s.map(([h, p], i) => `<h2 id="s${i + 1}" class="rv">${esc(h)}</h2>${String(p).split(/\n\s*\n/).map(x => `<p class="rv">${esc(x)}</p>`).join('')}${i === 0 && a.quote ? `<blockquote class="rv">${esc(a.quote)}</blockquote>` : ''}${i === 1 && a.call?.length ? `<div class="callout rv"><p class="mono-s" style="color:#595957">${esc(a.callT || '')}</p><ul>${a.call.map(c => `<li>•&nbsp; ${esc(c)}</li>`).join('')}</ul></div>` : ''}`).join('\n    ')}
    <p class="mono rv" style="font-size:12px;color:#595957;border-top:1px solid var(--line);padding-top:20px;text-transform:none;letter-spacing:.02em">Written by ${esc(a.author || 'the Cognexa team')}.${a.sample ? ' Sample article text, to be replaced.' : ''}</p>
  </div>
</div></div>
</article>
${relatedCards(a.rel)}
<section class="tcta"><div class="wrap"><p class="mono rv" style="color:#9ea1ad">Fit call</p><h2 class="rv" style="--d:1">Bring us the brief. We will tell you what may sit behind it.</h2><a class="btn rv" style="--d:2" href="/contact/">Book a 15-min fit call ${arr}</a></div></section>`;
  return page({ title: a.title, desc: a.lede, path: artHref(a.slug), active: 'thinking', body, crumbs: [['Thinking', '/thinking/'], [a.title, artHref(a.slug)]],
    schema: [{ '@type': 'Article', headline: a.title, description: a.lede, author: { '@type': 'Organization', name: a.author || 'Cognexa team' }, datePublished: a.date, image: a.image }] });
}
