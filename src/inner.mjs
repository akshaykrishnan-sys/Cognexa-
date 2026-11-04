import { img, esc, arr, withArr, page, SERVICES, CTA, CTA_SUB, IND } from './lib.mjs';
import { VERTS } from './data-verticals.mjs';
import { SVCS } from './data-services.mjs';
import { collection, readJSON } from './content.mjs';

const pad2 = (n) => String(n).padStart(2, '0');
export const subSlug = (n) => n.toLowerCase().replace(/&/g, 'and').replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const faqLd = (items) => ({ '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const tagCls = ['tag-blue', 'tag-amber', 'tag-rust'];

function oHero({ crumb, h, pathNodes, legend = true, foot = 'SAME DECISION. DIFFERENT CONTEXT.', pw, ink, ctaHref = '/contact/', secondary = ['See how we investigate', '/approach/'] }) {
  return `<section class="ohero${ink ? ' ink' : ''}" aria-labelledby="hh">
  <div class="wrap">
    <p class="crumb mono">${crumb}</p>
    <div class="copy">
      <h1 id="hh"><span class="k rv" style="display:block">${esc(h.k)}</span><span class="t rv" style="--d:1"><span>${esc(h.t1)}</span><span class="c-amber">${esc(h.t2)}</span></span></h1>
      <p class="s rv" style="--d:2">${esc(h.s)}</p>
      <div class="ctas rv" style="--d:3"><a class="btn" href="${ctaHref}">${withArr(CTA)}</a><a class="link" href="${secondary[1]}">${esc(secondary[0])}</a></div>
    </div>
    <div class="ophoto io">
      <img class="par" data-par="0.05" src="${img(h.img)}" alt="${esc(`A person mid-decision, annotated with the questions behind it: ${h.tags.join(', ')}`)}" fetchpriority="high">
      <svg class="atn" viewBox="0 0 160 160" aria-hidden="true"><circle class="o" cx="80" cy="80" r="63" stroke-width="1.2"/><circle cx="80" cy="80" r="36" stroke-width="1.2"/><circle cx="80" cy="80" r="4" style="fill:var(--amber-2)"/><line x1="0" y1="80" x2="160" y2="80" stroke-opacity=".8"/><line x1="80" y1="0" x2="80" y2="160" stroke-opacity=".8"/></svg>
      ${h.tags.map((t, i) => `<span class="tag tg t${i + 1} ${tagCls[i]}">${esc(t)}</span>`).join('')}
    </div>
    <div class="opath io" style="--n:${pathNodes.length};--pw:${pw || (pathNodes.length > 5 ? '1204px' : '640px')}">
      <div class="track">${pathNodes.map((n, i) => `<div class="node${n.cls ? ' ' + n.cls : ''}" style="--i:${i}"><b>${esc(n.b)}</b>${n.s ? `<small>${esc(n.s)}</small>` : ''}</div>`).join('')}</div>
      <p class="foot">${foot}</p>
      ${legend ? `<div class="legend"><span><i class="d"></i>DECISION OBSERVED</span><span><i class="l"></i>SIGNAL</span><span><i class="r"></i>CONTEXT SHAPES IT</span></div>` : ''}
    </div>
  </div>
</section>`;
}

const secHead = (label, h, dark) => `<div class="sech"><p class="secl rv ${dark ? 'c-grey' : 'c-muted'}">${label}</p><h2 class="h-sec-s rv" style="--d:1">${esc(h)}</h2></div>`;

function faq(items) {
  return `<div class="faq">${items.map(([q, a], i) => `<details class="rv" style="--d:${i}"><summary>${esc(q)}<i aria-hidden="true">+</i></summary><div class="ans"><p>${esc(a)}</p></div></details>`).join('')}</div>`;
}

function closingCta(c, btn, href = '/contact/') {
  return `<section class="ccta" aria-labelledby="cc-h">
  ${c.img ? `<img class="par" data-par="0.06" src="${img(c.img)}" alt="" loading="lazy">` : ''}
  <div class="wrap"><div class="in">
    <h2 id="cc-h" class="rv">${esc(c.a)}<br><span class="c-amber">${esc(c.b)}</span></h2>
    <p class="rv" style="--d:1">${esc(c.p)}</p>
    <div class="ctas rv" style="--d:2"><a class="btn" href="${href}">${withArr(CTA)}</a></div>
    <p class="mc rv" style="--d:3">${CTA_SUB} No pitch deck.</p>
  </div></div>
</section>`;
}

const icons = {
  doubt: '<svg class="ic" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" stroke="#14161a"/><text x="28" y="38" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="38" fill="#f5a624">?</text></svg>',
  choice: '<svg class="ic" viewBox="0 0 56 56" fill="none"><rect x="4" y="24" width="8" height="8" stroke="#14161a"/><rect x="14" y="24" width="8" height="8" stroke="#14161a"/><rect x="24" y="24" width="8" height="8" fill="#f5a624"/><rect x="34" y="24" width="8" height="8" stroke="#14161a"/><rect x="44" y="24" width="8" height="8" stroke="#14161a"/></svg>',
  loss: '<svg class="ic" viewBox="0 0 56 56" fill="none"><circle cx="10" cy="14" r="4" stroke="#14161a"/><path d="M14 18 Q30 22 44 44" stroke="#14161a" stroke-dasharray="3 3"/><circle cx="46" cy="46" r="5" fill="#f5a624"/></svg>',
  habit: '<svg class="ic" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="22" stroke="#14161a" stroke-dasharray="4 4"/><circle cx="46" cy="16" r="5" fill="#f5a624"/></svg>',
};

/* ---------------- INDUSTRY PAGE ---------------- */
const SVC_LINK = { 'LANDING PAGE DESIGN': 'ux-design', 'CRO': 'digital-marketing', 'UX AUDITS': 'ux-design', 'E-COMMERCE DEV': 'web-development', 'SEARCH ADS': 'paid-media', 'RETARGETING': 'paid-media', 'CREATIVE TESTING': 'paid-media', 'EMAIL & AUTOMATION': 'digital-marketing', 'ANALYTICS': 'digital-marketing', 'PRODUCT DEMOS': 'video-creation', 'TESTIMONIAL VIDEOS': 'video-creation', 'BRAND POSITIONING': 'consulting', 'SALES ENABLEMENT': 'consulting', 'CASE FILMS': 'corporate-films', 'ONBOARDING DESIGN': 'ux-design', 'PRICING PAGE DESIGN': 'ux-design', 'TESTING': 'ux-design', 'APP STORE DESIGN': 'ux-design', 'LIFECYCLE EMAIL': 'digital-marketing', 'PUSH & EMAIL': 'digital-marketing', 'EXPLAINER FILMS': 'video-creation', 'CONTENT DESIGN': 'ux-design' };
const svcHref = (x) => { const k = Object.keys(SVC_LINK).find(k => x.toUpperCase().includes(k)) ; return `/services/${SVC_LINK[k] || (/FILM|VIDEO/.test(x.toUpperCase()) ? 'video-creation' : /ADS|MEDIA/.test(x.toUpperCase()) ? 'paid-media' : /EMAIL|SEO|SOCIAL|CONTENT|ANALYTIC/.test(x.toUpperCase()) ? 'digital-marketing' : /APP|DEV|PORTAL|BUILD/.test(x.toUpperCase()) ? 'web-development' : 'ux-design')}/`; };

export function vertical(v) {
  const nodes = v.hero.path.map(([b, s], i) => ({ b, s, cls: i === 3 ? 'warn' : i === 4 ? 'end' : '' }));
  const body = `
${oHero({ crumb: `INDUSTRIES&nbsp;&nbsp;/&nbsp;&nbsp;${v.crumb}`, h: v.hero, pathNodes: nodes, secondary: ['Check your symptoms', '#symptoms'] })}
<section class="sec-m bg-ink" id="symptoms" style="scroll-margin-top:80px"><div class="wrap">
  ${secHead(`02&nbsp;&nbsp;/&nbsp;&nbsp;${v.mapL}`, v.mapH, true)}
  <p class="sym-intro rv">Tick what you are seeing. We turn it into a brief for your fit call, so the first 15 minutes start on your real problem.</p>
  <form class="symptoms" data-symptoms action="/contact/" method="get">
  <div class="map-h" aria-hidden="true"><span>WHAT YOU SEE</span><span></span><span>WHAT WE CHANGE</span><span>SERVICES</span></div>
  ${v.map.map(([p, c, s], i) => `<label class="map-r rv" style="--d:${i}"><span class="p"><input type="checkbox" name="s" value="${esc(p)}"><i aria-hidden="true"></i>${esc(p)}</span><span class="ar" aria-hidden="true">→</span><span class="c">${esc(c)}</span><span class="sv">${s.map(x => `<a class="schip" href="${svcHref(x)}">${esc(x)}</a>`).join('')}</span></label>`).join('')}
  <div class="sym-go"><p class="sym-count" aria-live="polite">Tick at least one symptom.</p><button class="btn" type="submit" disabled>Add these to my brief ${arr}</button></div>
  </form>
</div></section>
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('03&nbsp;&nbsp;/&nbsp;&nbsp;BEHAVIOURAL INSIGHTS', v.insightsH)}
  <div class="cards4">${v.insights.map(([t, h, p], i) => `<article class="icard rv" style="--d:${i}">${icons[['doubt', 'choice', 'loss', 'habit'][i]]}<p class="tg">${t}</p><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>
</div></section>
<section class="sec-m bg-paper sec-tight"><div class="wrap">
  ${secHead('04&nbsp;&nbsp;/&nbsp;&nbsp;HOW AN ENGAGEMENT RUNS', 'Example engagements, and how we measure them')}
  <div class="grid-3">${v.cases.map(([id, k, h, n, m, lv], i) => `<article class="case rv" style="--d:${i}"><div class="im"><img src="${img(id)}" alt="${esc(h)}" loading="lazy"></div><div class="b"><p class="k">${esc(k)}</p><h3>${esc(h)}</h3><div class="mz"><span>Measured by</span><b>${esc(m)}</b></div><span class="lever lv-${lv}">LEVER: ${lv.toUpperCase()}</span></div></article>`).join('')}</div>
  <p class="note2">Every engagement agrees one behaviour and its baseline before work starts. <a href="/case-studies/checkout-trust-gap-closed/">Read a full case ${arr}</a></p>
</div></section>
<section class="sec-m bg-ink"><div class="wrap">
  ${secHead('05&nbsp;&nbsp;/&nbsp;&nbsp;WHAT WE BUILD WITH YOU', v.modsH || 'Six ways we help', true)}
  <div class="mods">${v.mods.map(([h, p], i) => `<article class="mod rv" style="--d:${i % 3}"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>
</div></section>
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('06&nbsp;&nbsp;/&nbsp;&nbsp;QUESTIONS', 'What teams ask first')}
  ${faq(v.faq)}
</div></section>
${closingCta(v.cta, v.cta.btn)}
`;
  return page({ title: `${v.name} behavioural insights`, desc: v.hero.s, path: `/industries/${v.slug}/`, active: 'industries', body, crumbs: [['Industries', '/industries/'], [v.name, `/industries/${v.slug}/`]], schema: [faqLd(v.faq)] });
}

/* ---------------- SERVICE PAGE ---------------- */
export function service(s) {
  const nodes = s.hero.path.map((b, i) => ({ b: `${pad2(i + 1)} - ${b}`, cls: i === 0 ? 'end' : '' }));
  const short = s.short || s.name;
  const stepK = ['SIGNAL', 'SYSTEM', 'FRICTION', 'INTERVENE', 'OUTCOME'];
  const ctaTxt = CTA;
  const body = `
${oHero({ crumb: `SERVICES&nbsp;&nbsp;/&nbsp;&nbsp;${esc(s.crumb)}`, h: { ...s.hero, cta: ctaTxt }, ctaHref: `/contact/?service=${encodeURIComponent(s.name)}`, pathNodes: nodes, legend: false, foot: '8 SERVICES. ONE BEHAVIOURAL BACKBONE.', pw: '1204px', ink: true, secondary: ['See how we work', '#approach'] })}
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('02&nbsp;&nbsp;/&nbsp;&nbsp;THE PROBLEM', s.problemH)}
  <div class="pains">${s.pains.map(([h, p], i) => `<article class="pain rv" style="--d:${i}"><p class="k">PROBLEM ${pad2(i + 1)}</p><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>
</div></section>
<section class="sec-m bg-black" id="approach"><div class="wrap">
  ${secHead('03&nbsp;&nbsp;/&nbsp;&nbsp;OUR APPROACH', 'Five steps, in plain language', true)}
  <div class="steps5 io">${s.steps.map((p, i) => `<div class="step5${i === 3 ? ' hot' : ''}${i === 4 ? ' last' : ''}" style="--i:${i}"><p class="n">${pad2(i + 1)}</p><p class="k">${stepK[i]}</p><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>
<section class="sec-m bg-ink"><div class="wrap">
  ${secHead('04&nbsp;&nbsp;/&nbsp;&nbsp;BEHAVIOURAL ANGLES', 'Two ways of seeing the same work', true)}
  <div class="views">
    <article class="view rv"><p class="k c-blue">DATA-DRIVEN VIEW</p><h3>What the data shows</h3><p>${esc(s.views[0])}</p></article>
    <article class="view rv" style="--d:1"><p class="k c-amber">BRAND-FOCUSED VIEW</p><h3>What the brand signals</h3><p>${esc(s.views[1])}</p></article>
  </div>
  <div class="lensbar rv"><p class="mono" style="font-size:12px">Behavioural lens</p><p>${esc(s.lens)}</p></div>
</div></section>
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('05&nbsp;&nbsp;/&nbsp;&nbsp;EIGHT SERVICES, ONE FLOW', 'What we do, why it works, what you get')}
  <div class="svcs">${s.svcs.map(([h, d, w, o], i) => `<article class="svc rv" style="--d:${i % 4}"><p class="n">${pad2(i + 1)}</p><h3>${esc(h)}</h3><p class="d">${esc(d)}</p><div class="wo"><small>WHY</small><p>${esc(w)}</p><small>OUTCOME</small><p class="o">${esc(o)}</p></div><a href="/contact/?service=${encodeURIComponent(h)}">GET A PROPOSAL ${arr}</a></article>`).join('')}</div>
</div></section>
<section class="sec-m bg-black"><div class="wrap">
  ${secHead('06&nbsp;&nbsp;/&nbsp;&nbsp;PROOF AND DELIVERABLES', 'What you get, and how it is measured', true)}
  <div class="deliv">
    <div class="dlist rv"><p class="k">WHAT YOU GET</p><ul>${s.deliv.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
    <div class="dcases">${s.cases.map(([k, h, n, m, lv], i) => `<article class="dcase rv" style="--d:${i}"><p class="k">${esc(k)}</p><h3>${esc(h)}</h3><div class="mz"><span>Measured by</span><b>${esc(m)}</b></div><span class="lever lv-${lv}">LEVER: ${lv.toUpperCase()}</span></article>`).join('')}</div>
  </div>
  <p class="note2">Example engagements. Each one agrees a single behaviour and its baseline before work starts.</p>
</div></section>
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('07&nbsp;&nbsp;/&nbsp;&nbsp;PRICING AND QUESTIONS', 'Know the range before the call')}
  <div class="prices">${['SPRINT', 'PROJECT', 'RETAINER'].map((k, i) => `<div class="price rv${i === 1 ? ' feat' : ''}" style="--d:${i}"><p class="k">${k}</p><b>${esc(s.prices[i])}</b><p>${['Audit and roadmap in 2 to 3 weeks.', 'Build and launch in 2 to 4 months.', 'Ongoing work with monthly reviews.'][i]}</p></div>`).join('')}</div>
  ${faq(s.faq)}
</div></section>
${closingCta(s.cta, ctaTxt, `/contact/?service=${encodeURIComponent(s.name)}`)}
`;
  return page({ title: s.name, desc: s.hero.s, path: `/services/${s.slug}/`, active: 'services', body, crumbs: [['Services', '/services/'], [s.name, `/services/${s.slug}/`]], schema: [faqLd(s.faq), { '@type': 'Service', name: s.name, description: s.hero.s, provider: { '@type': 'Organization', name: 'Cognexa' }, hasOfferCatalog: { '@type': 'OfferCatalog', name: s.name, itemListElement: s.svcs.map(([h, d]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: h, description: d } })) } }] });
}


/* ---------------- INDIVIDUAL SERVICE PAGE (64) ---------------- */
const RELATED = { 'digital-marketing': ['e-commerce', 'b2b-saas', 'education'], 'consulting': ['b2b-saas', 'fintech', 'healthcare'], 'web-development': ['e-commerce', 'education', 'fintech'], 'software-development': ['fintech', 'b2b-saas', 'healthcare'], 'ux-design': ['e-commerce', 'fintech', 'healthcare'], 'video-creation': ['education', 'healthcare', 'b2b-saas'], 'paid-media': ['e-commerce', 'education', 'fintech'], 'corporate-films': ['b2b-saas', 'healthcare', 'education'] };
export function serviceDetail(s, i) {
  const [name, desc, why, outcome] = s.svcs[i];
  const slug = subSlug(name);
  const url = `/services/${s.slug}/${slug}/`;
  const prev = s.svcs[(i + 7) % 8], next = s.svcs[(i + 1) % 8];
  const stepK = ['SIGNAL', 'SYSTEM', 'FRICTION', 'INTERVENE', 'OUTCOME'];
  const vmap = Object.fromEntries(VERTS.map(v => [v.slug, v]));
  const body = `
<section class="sd-hero bg-ink" aria-labelledby="hh"><div class="wrap">
  <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/services/">Services</a><span>/</span><a href="/services/${s.slug}/">${esc(s.name)}</a><span>/</span><span aria-current="page">${esc(name)}</span></nav>
  <div class="sd-grid">
    <div>
      <p class="mono c-amber rv">Service ${pad2(i + 1)} of 08&nbsp;&nbsp;/&nbsp;&nbsp;${esc(s.name)}</p>
      <h1 id="hh" class="t-display rv" style="--d:1">${esc(name)}</h1>
      <p class="sd-lede rv" style="--d:2">${esc(desc)}.</p>
      <div class="ctas rv" style="--d:3"><a class="btn" href="/contact/?service=${encodeURIComponent(name)}">Get a proposal for ${esc(name)} ${arr}</a><a class="link c-paper" href="/services/${s.slug}/">All ${esc(s.name)} services</a></div>
    </div>
    <div class="sd-photo rv-img"><img src="${img(s.hero.img)}" alt="${esc(s.name)}: ${esc(s.hero.k)}" fetchpriority="high"><svg class="atn" viewBox="0 0 160 160" aria-hidden="true"><circle class="o" cx="80" cy="80" r="63" stroke-width="1.2"/><circle cx="80" cy="80" r="36" stroke-width="1.2"/><circle cx="80" cy="80" r="4" style="fill:var(--amber-2)"/></svg><span class="tag tag-amber sd-tag">${esc(why)}</span></div>
  </div>
  <div class="sd-flow io" aria-label="${esc(s.name)} services">${s.svcs.map(([h], j) => `<a href="/services/${s.slug}/${subSlug(h)}/" class="${j === i ? 'on' : ''}" style="--i:${j}"${j === i ? ' aria-current="page"' : ''}><b>${pad2(j + 1)}</b>${esc(h)}</a>`).join('')}</div>
</div></section>

<section class="sec-m bg-paper"><div class="wrap">
  <div class="sech"><p class="secl rv c-muted">01&nbsp;&nbsp;/&nbsp;&nbsp;WHAT, WHY, OUTCOME</p><h2 class="h-sec-s rv" style="--d:1">What it is, and why it works</h2></div>
  <div class="grid-3">
    <article class="pain rv"><p class="k">WHAT</p><h3>${esc(name)}</h3><p>${esc(desc)}.</p></article>
    <article class="pain rv" style="--d:1"><p class="k">WHY</p><h3>${esc(why)}</h3><p>${esc(s.lens)}</p></article>
    <article class="pain rv" style="--d:2;border-color:var(--blue)"><p class="k">OUTCOME</p><h3 class="c-blue">${esc(outcome)}</h3><p>Measured against one agreed behaviour, with the baseline set before work starts.</p></article>
  </div>
</div></section>

<section class="sec-m bg-black"><div class="wrap">
  <div class="sech"><p class="secl rv c-grey">02&nbsp;&nbsp;/&nbsp;&nbsp;HOW WE APPROACH IT</p><h2 class="h-sec-s rv" style="--d:1">Five steps, in plain language</h2></div>
  <div class="steps5 io">${s.steps.map((p, j) => `<div class="step5${j === 3 ? ' hot' : ''}${j === 4 ? ' last' : ''}" style="--i:${j}"><p class="n">${pad2(j + 1)}</p><p class="k">${stepK[j]}</p><p>${esc(p)}</p></div>`).join('')}</div>
  <div class="lensbar rv"><p class="mono" style="font-size:12px">Behavioural lens</p><p>${esc(s.lens)}</p></div>
</div></section>

<section class="sec-m bg-ink"><div class="wrap">
  <div class="sech"><p class="secl rv c-grey">03&nbsp;&nbsp;/&nbsp;&nbsp;WHAT YOU GET</p><h2 class="h-sec-s rv" style="--d:1">Deliverables and measures</h2></div>
  <div class="deliv">
    <div class="dlist rv"><p class="k">DELIVERABLES</p><ul>${s.deliv.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
    <div class="dcases">${s.cases.map(([k, h, n, m, lv], j) => `<article class="dcase rv" style="--d:${j}"><p class="k">${esc(k)}</p><h3>${esc(h)}</h3><div class="mz"><span>Measured by</span><b>${esc(m)}</b></div><span class="lever lv-${lv}">LEVER: ${lv.toUpperCase()}</span></article>`).join('')}</div>
  </div>
  <p class="note2">Example engagements. Each one agrees a single behaviour and its baseline before work starts.</p>
</div></section>

<section class="sec-m bg-paper"><div class="wrap">
  <div class="sech"><p class="secl rv c-muted">04&nbsp;&nbsp;/&nbsp;&nbsp;WHERE IT HELPS MOST</p><h2 class="h-sec-s rv" style="--d:1">Industries we apply it in</h2></div>
  <div class="grid-3">${RELATED[s.slug].map((v, j) => `<a class="icard rv sd-ind" style="--d:${j}" href="/industries/${v}/"><p class="tg">${esc(vmap[v].name.toUpperCase())}</p><h3>${esc(vmap[v].hero.k)}</h3><p>${esc(vmap[v].hero.s)}</p><span class="link">Explore ${esc(vmap[v].name)} ${arr}</span></a>`).join('')}</div>
</div></section>

<section class="sec-m bg-paper3"><div class="wrap">
  <div class="sech"><p class="secl rv c-muted">05&nbsp;&nbsp;/&nbsp;&nbsp;PRICING AND QUESTIONS</p><h2 class="h-sec-s rv" style="--d:1">Know the range before the call</h2></div>
  <div class="prices">${['SPRINT', 'PROJECT', 'RETAINER'].map((k, j) => `<div class="price rv${j === 1 ? ' feat' : ''}" style="--d:${j}"><p class="k">${k}</p><b>${esc(s.prices[j])}</b><p>${['Audit and roadmap in 2 to 3 weeks.', 'Build and launch in 2 to 4 months.', 'Ongoing work with monthly reviews.'][j]}</p></div>`).join('')}</div>
  ${faq(s.faq)}
  <p class="note" style="color:var(--muted-2)">Indicative ranges for ${esc(s.name)}. Scope and price are confirmed in writing after the fit call.</p>
</div></section>

<nav class="sd-pn bg-ink" aria-label="More ${esc(s.name)} services"><div class="wrap">
  <a href="/services/${s.slug}/${subSlug(prev[0])}/"><small class="mono">← Previous</small><span class="serif">${esc(prev[0])}</span></a>
  <a href="/services/${s.slug}/${subSlug(next[0])}/" style="text-align:right"><small class="mono">Next →</small><span class="serif">${esc(next[0])}</span></a>
</div></nav>
${closingCta(s.cta, `Get a proposal for ${name}`, `/contact/?service=${encodeURIComponent(name)}`)}
`;
  return page({ title: `${name} - ${s.name}`, desc: `${desc}. ${why} ${outcome} Part of Cognexa's ${s.name} discipline.`, path: url, active: 'services', body,
    crumbs: [['Services', '/services/'], [s.name, `/services/${s.slug}/`], [name, url]],
    schema: [{ '@type': 'Service', name, description: desc, serviceType: s.name, provider: { '@type': 'Organization', name: 'Cognexa' } }, faqLd(s.faq)] });
}


/* ================= INDUSTRIES LANDING (Figma 362:2) ================= */
export function industriesLanding() {
  const h = { img: '362:24', k: 'Every industry decides in its own way.', t1: 'Find where', t2: 'people pause.', s: 'Behavioural insights for five industries. We study how people decide, then remove what slows them.', cta: 'Bring us the brief', tags: ['Trust? evidence', 'Effort? next step', 'Risk? regret'] };
  const nodes = [['01 - NOTICE', 'what draws them in'], ['02 - WEIGH', 'what they compare'], ['03 - CHECK', 'what they verify'], ['04 - DOUBT', 'what stops them'], ['05 - ACT', 'what finally tips it']].map(([b, sub], i) => ({ b, s: sub, cls: i === 3 ? 'warn' : i === 4 ? 'end' : '' }));
  const cards = [['362:285', 'e-commerce', 'E-COMMERCE', 'Shoppers pause on trust.', 'Reviews, returns and delivery promises settle the sale. We find the doubt that stops the order.', 'E-commerce'],
    ['362:292', 'b2b-saas', 'B2B AND SAAS', 'Buying committees choose safety.', 'Several people share one decision. We make the safe choice easy to defend.', 'B2B and SaaS'],
    ['362:299', 'healthcare', 'HEALTHCARE', 'Patients act when they feel sure.', 'Clear next steps and calm language bring people back to care.', 'Healthcare'],
    ['362:307', 'education', 'EDUCATION', 'Learners choose where they belong.', 'Belonging, effort and visible outcomes shape which programme feels right.', 'Education'],
    ['362:314', 'fintech', 'FINTECH', 'Money decisions carry regret.', 'Clarity, control and visible safeguards decide who signs up and who stays.', 'Fintech']];
  const rows = [['E-commerce', 'One shopper, often on a phone', 'Doubt at checkout', 'Trust cues, clear totals, easier returns'], ['B2B and SaaS', 'A buying committee', 'Fear of a poor choice', 'Proof a champion can reuse internally'], ['Healthcare', 'Patients and carers', 'Uncertainty about the next step', 'Plain language and safer first actions'], ['Education', 'Learners and families', 'The risk of choosing wrong', 'Visible belonging and clear outcomes'], ['Fintech', 'Individuals handling money', 'Fear of regret', 'Visible safeguards and real control']];
  const faqs = [['Which industries do you work in?', 'Five today: e-commerce, B2B and SaaS, healthcare, education and fintech. Each has its own page and plan.'], ['Can you work across more than one industry?', 'Yes. The behavioural method carries over, and we adapt the questions to each decision context.'], ['How do we know which page fits us?', 'Start with who makes the decision and what slows them. If that is unclear, bring the brief and we will map it with you.'], ['How long does a first engagement take?', 'An insight sprint runs 4 to 6 weeks. We agree the scope with you before we start.']];
  const body = `
${oHero({ crumb: 'INDUSTRIES', h, pathNodes: nodes, secondary: ['Explore the five industries', '#five'] })}
<section class="sec-m bg-paper" id="five" style="scroll-margin-top:80px"><div class="wrap">
  ${secHead('02&nbsp;&nbsp;/&nbsp;&nbsp;FIVE INDUSTRIES', 'Where do your buyers hesitate?')}
  <div class="ind-cards">${cards.map(([im, slug, k, t, p, n], i) => `<a class="ind-card rv" style="--d:${i % 3}" href="/industries/${slug}/"><div class="im"><img src="${img(im)}" alt="" loading="lazy"></div><div class="bd"><p class="k">${pad2(i + 1)}&nbsp;&nbsp;/&nbsp;&nbsp;${k}</p><h3>${esc(t)}</h3><p>${esc(p)}</p><span class="link">Explore ${esc(n)} ${arr}</span></div></a>`).join('')}</div>
</div></section>
<section class="sec-m bg-ink"><div class="wrap">
  ${secHead('03&nbsp;&nbsp;/&nbsp;&nbsp;HOW DECISIONS DIFFER', 'Same method, different pause.', true)}
  <table class="dtable rv"><thead><tr><th>INDUSTRY</th><th>WHO DECIDES</th><th>WHAT SLOWS THEM</th><th>WHAT WE CHANGE</th><th><span class="sr">Link</span></th></tr></thead>
  <tbody>${rows.map((r, i) => `<tr data-href="/industries/${cards[i][1]}/">${r.map((c, j) => `<td>${j === 0 ? `<a href="/industries/${cards[i][1]}/">${esc(c)}</a>` : esc(c)}</td>`).join('')}<td class="go" aria-hidden="true">→</td></tr>`).join('')}</tbody></table>
</div></section>
<section class="sec-m bg-paper"><div class="wrap">
  ${secHead('04&nbsp;&nbsp;/&nbsp;&nbsp;QUESTIONS', 'What teams ask first')}
  ${faq(faqs)}
</div></section>
${closingCta({ a: 'Find the pause.', b: 'Ease it.', p: 'A 15-minute fit call. We bring a first read of where your buyers hesitate.' }, 'Book your industry review')}
`;
  return page({ title: 'Industries', desc: h.s, path: '/industries/', active: 'industries', body, crumbs: [['Industries', '/industries/']],
    schema: [faqLd(faqs), { '@type': 'CollectionPage', name: 'Behavioural insights by industry' }, { '@type': 'ItemList', itemListElement: cards.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://cognexa-digital.netlify.app/industries/${c[1]}/`, name: c[5] })) }] });
}

/* ================= CASE STUDIES (Figma 371:2, 372:2) ================= */
// Case studies: /content/cases/*.json (edited in the CMS). published=true gets a full page.
const CASE_DATA = collection('cases');
export const CASES = CASE_DATA.map(c => ({ ...c, ind: c.industry, k: c.kicker, h: c.title, m: c.measure, lv: c.lever, b: c.chart?.before ?? 110, a: c.chart?.after ?? 130, full: !!c.published }))
  .sort((x, y) => Number(y.full) - Number(x.full));
const caseCard = (c, i) => {
  const inner = `<div class="dtile io"><div class="bars"><div class="bar"><i style="height:${c.b}px"></i>BEFORE</div><div class="bar after"><i style="height:${c.a}px"></i>AFTER</div></div><span class="il">ILLUSTRATIVE</span></div>
  <div class="bd"><p class="k">${esc(c.k)}</p><h3>${esc(c.h)}</h3><div class="m"><b>${c.n}</b><span>${esc(c.m)}</span></div><span class="lever lv-${c.lv}">LEVER: ${c.lv.toUpperCase()}</span>${c.full ? `<span class="link">Read the case ${arr}</span>` : `<span class="mono-s c-muted">Full case to follow</span>`}</div>`;
  return c.full ? `<a class="ccard rv" style="--d:${i % 3}" data-tags="${esc(c.ind)}" href="/case-studies/${c.slug}/">${inner}</a>` : `<article class="ccard rv" style="--d:${i % 3}" data-tags="${esc(c.ind)}">${inner}</article>`;
};
const caseCta = () => closingCta({ a: 'Bring us the brief.', b: 'See what moves.', p: 'A 15-minute fit call. We bring a first read of where your buyers hesitate.' }, 'Book your review');

export function caseStudies() {
  const pub = CASES.filter(c => c.full);
  const f = pub[0];
  const next = CASES.filter(c => !c.full);
  const body = `
<section class="bg-ink" style="padding:96px 0 80px"><div class="wrap">
  <p class="mono c-grey2 rv">Case studies</p>
  <h1 class="t-display rv" style="--d:1;font-size:clamp(64px,7.2vw,104px);margin-top:24px">Proof from real work.</h1>
  <p class="rv" style="--d:2;font-size:20px;line-height:30px;max-width:640px;margin-top:24px">Each case follows the same four steps: the brief, what we saw, what we changed and what moved.</p>
</div></section>
<section class="bg-paper" style="padding:80px 0 40px"><div class="wrap">
  <a class="cfeat rv" href="/case-studies/${f.slug}/">
    <div class="im"><img src="${img(f.image)}" alt="${esc(f.imageAlt || '')}" loading="lazy"></div>
    <div class="bd"><p class="k">${esc(f.k)}</p><h2>${esc(f.h)}</h2>
      <ol class="steps4">${(f.story || []).slice(0, 3).map(x => `<li><b>${esc(x.label[0] + x.label.slice(1).toLowerCase())}</b>${esc(x.title)}</li>`).join('')}<li><b>Measured by</b>${esc(f.measure)}</li></ol>
      <span class="btn">Read the case ${arr}</span></div>
  </a>
  ${pub.slice(1).map(c => `<a class="cfeat rv" style="margin-top:24px" href="/case-studies/${c.slug}/"><div class="im"><img src="${img(c.image)}" alt="${esc(c.imageAlt || '')}" loading="lazy"></div><div class="bd"><p class="k">${esc(c.k)}</p><h2>${esc(c.h)}</h2><p>${esc(c.summary || '')}</p><span class="btn">Read the case ${arr}</span></div></a>`).join('')}
</div></section>
${next.length ? `<section class="bg-paper" style="padding:40px 0 104px"><div class="wrap">
  <p class="mono c-muted rv">Being written up now</p>
  <h2 class="h-sec-s rv" style="--d:1;margin-top:12px">More cases on the way.</h2>
  <ul class="cnext">${next.map((c, i) => `<li class="rv" style="--d:${i}"><span class="k">${esc(c.ind)}</span><b>${esc(c.h)}</b><span class="lever lv-${c.lv}">LEVER: ${c.lv.toUpperCase()}</span></li>`).join('')}</ul>
  <p class="note2">Want the case closest to your industry? Ask on your fit call and we will walk you through it.</p>
</div></section>` : ''}
${caseCta()}`;
  return page({ title: 'Case studies', desc: 'Selected projects, the behaviour behind each one and what moved. Case studies from Cognexa across five industries.', path: '/case-studies/', active: '', body, crumbs: [['Case studies', '/case-studies/']] });
}

export function caseStudy(c = CASES.find(x => x.full)) {
  const others = CASES.filter(x => x.slug !== c.slug);
  const fig = c.figure || {};
  const pct = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
  const mx = Math.max(pct(fig.before), pct(fig.after), 1);
  const body = `
<section class="bg-ink" style="padding:88px 0"><div class="wrap">
  <p class="mono c-grey2 rv"><a href="/case-studies/" style="text-decoration:none">Case studies</a>&nbsp;&nbsp;/&nbsp;&nbsp;${esc(c.industry)}</p>
  <h1 class="t-display rv" style="--d:1;font-size:clamp(56px,6.7vw,96px);margin-top:24px">${esc(c.title)}</h1>
  <p class="rv" style="--d:2;font-size:20px;line-height:1.5;max-width:720px;margin-top:24px">${esc(c.summary || '')}</p>
  <div class="cs-meta rv" style="--d:3">${[['INDUSTRY', c.industry], ['SERVICES', c.services], ['TIMELINE', c.timeline], ['LEVER', c.lever ? c.lever[0].toUpperCase() + c.lever.slice(1) : '']].filter(([, v]) => v).map(([k, v]) => `<div><small>${k}</small><span>${esc(v)}</span></div>`).join('')}</div>
</div></section>
${c.results?.length ? `<section class="bg-paper" style="padding:88px 0"><div class="wrap">
  <p class="secl c-muted rv">02&nbsp;&nbsp;/&nbsp;&nbsp;WHAT MOVED</p>
  <div class="grid-3" style="margin-top:40px">${c.results.map(({ value: n, prefix: pre = '', suffix: suf = '', label: l }, i) => `<div class="res rv" style="--d:${i}"><b data-count="${esc(n)}" data-pre="${esc(pre)}" data-suf="${esc(suf)}">${esc(pre)}${esc(n)}${esc(suf)}</b><span>${esc(l)}</span></div>`).join('')}</div>
  ${c.note ? `<p class="note2" style="margin-top:40px">${esc(c.note)}</p>` : ''}
</div></section>` : ''}
${c.story?.length ? `<section class="bg-paper3" style="padding:88px 0"><div class="wrap">
  ${c.story.map(({ label: k, title: h, text: p }, i) => `<div class="story rv"><p class="k">${pad2(i + 1)}&nbsp;&nbsp;/&nbsp;&nbsp;${esc(k)}</p><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></div>`).join('')}
</div></section>` : ''}
${fig.before ? `<section class="bg-paper" style="padding:88px 0"><div class="wrap">
  <figure><div class="fig1 io"><span class="t">${esc(fig.title || '')}</span><div class="bars"><div class="bar"><b>${esc(fig.before)}</b><i style="height:${Math.round(267 * pct(fig.before) / mx)}px"></i>BEFORE</div><div class="bar after"><b>${esc(fig.after)}</b><i style="height:${Math.round(267 * pct(fig.after) / mx)}px"></i>AFTER</div></div></div>
  <figcaption class="mono-s c-muted" style="margin-top:16px;text-transform:none;letter-spacing:.02em">${esc(fig.caption || '')}</figcaption></figure>
</div></section>` : ''}
<section class="bg-paper" style="padding:8px 0 88px"><div class="wrap">
  <p class="secl c-muted rv">More cases</p><h2 class="serif rv" style="--d:1;font-size:48px;line-height:64px;margin:16px 0 40px">Other places people pause</h2>
  <ul class="cnext">${others.map((o, i) => `<li class="rv" style="--d:${i}"><span class="k">${esc(o.industry)}</span><b>${o.full ? `<a href="/case-studies/${o.slug}/">${esc(o.title)}</a>` : esc(o.title)}</b><span class="lever lv-${o.lever}">LEVER: ${String(o.lever).toUpperCase()}</span></li>`).join('')}</ul>
  ${others.some(o => !o.full) ? '<p class="note2">Some cases are still being written up. Ask on your fit call for the one closest to your industry.</p>' : ''}
</div></section>
${caseCta()}`;
  return page({ title: `${c.title} - Case study`, desc: c.summary || c.title, path: `/case-studies/${c.slug}/`, body, crumbs: [['Case studies', '/case-studies/'], [c.title, `/case-studies/${c.slug}/`]] });
}

/* ================= PRIVACY (Figma 366:2) ================= */
export function privacy() {
  const PV = readJSON('pages/privacy.json');
  const S = PV.sections.map(x => [x.heading, x.body]);
  const body = `
<section class="bg-ink" style="padding:96px 0"><div class="wrap">
  <p class="mono c-grey2 rv">Legal</p>
  <h1 class="t-display rv" style="--d:1;font-size:clamp(64px,7.2vw,104px);margin-top:24px">Privacy policy</h1>
  <p class="rv" style="--d:2;font-size:20px;line-height:30px;max-width:640px;margin-top:24px">${esc(PV.intro)}</p>
  <p class="mono rv" style="--d:3;font-size:12px;color:#b2b5bf;margin-top:24px">Last updated: ${esc(PV.updated)}</p>
</div></section>
<section class="bg-paper" style="padding:96px 0"><div class="wrap">
  ${PV.draftNotice ? `<p class="draft">${esc(PV.draftNotice)}</p>` : ''}
  <div class="pcols">
    <nav class="ptoc" aria-label="Contents"><p class="mono-s c-muted">Contents</p>${S.map(([h], i) => `<a href="#pp${i + 1}">${pad2(i + 1)}&nbsp;&nbsp; ${h}</a>`).join('')}</nav>
    <div>${S.map(([h, p], i) => `<section class="psec" id="pp${i + 1}"><p class="mono-s c-muted">${pad2(i + 1)}</p><h2>${h}</h2><p>${p}</p></section>`).join('')}</div>
  </div>
</div></section>
<section class="bg-ink" style="padding:96px 0"><div class="wrap"><h2 class="h-sec-s rv">Questions about your data?</h2><p class="rv" style="font-size:18px;color:var(--grey);margin-top:24px">Contact us and we will route it to the right person.</p><a class="btn rv" style="margin-top:24px" href="/contact/">Contact us ${arr}</a></div></section>`;
  return page({ title: 'Privacy policy', desc: 'How Cognexa handles information about the people who visit this site and the teams we work with.', path: '/privacy/', body, crumbs: [['Privacy policy', '/privacy/']] });
}

export { VERTS, SVCS };
