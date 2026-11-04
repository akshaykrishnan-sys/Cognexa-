import { img, esc, arr, withArr, page, SITE , CTA, CTA_SUB, IND } from './lib.mjs';
import { ARTICLES, relatedCards } from './articles.mjs';

const pad2 = (n) => String(n).padStart(2, '0');
const tagCls = ['tag-amber', 'tag-blue', 'tag-blue', 'tag-rust', 'tag-amber'];

/* ======================= SERVICES HUB ======================= */
const DISC = [
  { sys: 'growth', n: '01', title: 'Turn attention into commercial movement.', label: 'SYSTEM 01  /  GROWTH', bg: 'bg-paper', alt: false, items: [
    ['digital-marketing', '139:44', 'Digital Marketing', 'Every channel, sequenced to build trust before the ask.', 'Where is confidence being lost?', ['SEO', 'GEO & AEO', 'Content Marketing']],
    ['paid-media', '139:74', 'Ads (Paid Media)', 'Paid reach that matches the message to the moment.', 'Is this the right audience, or just more of it?', ['Search Ads', 'Social Ads', 'Retargeting']],
    ['video-creation', '139:104', 'Video Creation', 'Story-led film built for attention.', 'What should someone feel before they act?', ['Brand Films', 'Explainer Videos', 'Social Video']]] },
  { sys: 'experience', n: '02', title: 'Design around how people decide.', label: 'SYSTEM 02  /  EXPERIENCE', bg: 'bg-paper2', alt: true, items: [
    ['ux-design', '139:143', 'Web Design & UX', 'Interfaces shaped around attention, memory and choice.', 'Which decision should become easier?', ['UX Audits', 'Landing Pages', 'Design Systems']],
    ['web-development', '139:173', 'Web Development', 'Fast, reliable builds that remove friction between intent and action.', 'What is slowing the decision down?', ['Custom Websites', 'E-commerce', 'Performance']],
    ['corporate-films', '139:203', 'Corporate Films', 'Long-form narrative that earns authority and trust.', 'What must someone believe to say yes?', ['Documentaries', 'Interviews', 'Investor Reports']]] },
  { sys: 'transformation', n: '03', title: 'Apply technology where it creates advantage.', label: 'SYSTEM 03  /  TRANSFORMATION', bg: 'bg-paper', alt: false, items: [
    ['consulting', '139:242', 'Consulting', 'Insight turned into a prioritised plan.', 'What is actually driving the outcome?', ['Growth Strategy', 'Journey Mapping', 'Pricing']],
    ['software-development', '139:272', 'Software Development', 'Products and tools built around real decisions.', 'What behaviour will the new system create?', ['Custom SaaS', 'Mobile Apps', 'AI / ML']]] },
];

export function hub() {
  let disc = 0;
  const hero = `<section class="ohero hub-hero" aria-labelledby="hh">
  <div class="wrap">
    <p class="crumb mono">SERVICES</p>
    <p class="mono c-grey" style="position:absolute;top:48px;right:var(--pad)">HOW A DECISION GETS MADE</p>
    <div class="copy">
      <h1 id="hh"><span class="k rv" style="display:block">The service comes second.</span><span class="t rv" style="--d:1"><span>We start with the</span><span class="c-amber">behaviour.</span></span></h1>
      <p class="s rv" style="--d:2">Strategy, design, technology and film, each shaped by how people actually decide.</p>
      <div class="ctas rv" style="--d:3"><a class="btn" href="/contact/">${CTA} ${arr}</a><a class="link" href="#questions">How we investigate</a></div>
    </div>
    <div class="ophoto io">
      <img class="par" data-par="0.05" src="${img('177:44')}" alt="A shopper with a trolley studying a supermarket shelf" fetchpriority="high">
      <svg class="atn" viewBox="0 0 160 160" aria-hidden="true" style="left:48%;top:38%"><circle class="o" cx="80" cy="80" r="70" stroke-width="1.2"/><circle cx="80" cy="80" r="40" stroke-width="1.2"/><circle cx="80" cy="80" r="4" style="fill:var(--amber-2)"/><line x1="0" y1="80" x2="160" y2="80" stroke-opacity=".8"/><line x1="80" y1="0" x2="80" y2="160" stroke-opacity=".8"/></svg>
      ${['Price? shelf-edge label', 'Social proof? bright packs', 'Habit? the usual pack', 'Risk? unfamiliar brand', 'Effort? wall of options'].map((t, i) => `<span class="tag tg h${i + 1} ${tagCls[i]}">${t}</span>`).join('')}
    </div>
    <div class="opath io" style="--n:5;--pw:640px">
      <div class="track">${[['01  /  TRIGGER', 'what prompts the moment'], ['02  /  CONTEXT', 'where & who with'], ['03  /  BIAS', 'what tips the weight'], ['04  /  FRICTION', 'what slows it'], ['05  /  CHOICE', 'what they do']].map(([b, s], i) => `<div class="node${i === 4 ? ' end' : ''}" style="--i:${i}"><b>${b}</b><small>${s}</small></div>`).join('')}</div>
      <p class="foot">SAME DECISION. DIFFERENT CONTEXT.</p>
      <div class="legend"><span><i class="d"></i>DECISION OBSERVED</span><span><i class="l"></i>SIGNAL</span><span><i class="r"></i>CONTEXT SHAPES IT</span></div>
    </div>
  </div>
</section>`;

  const framing = `<section class="sec bg-ink"><div class="wrap" style="display:grid;grid-template-columns:minmax(0,656px) minmax(0,560px);justify-content:space-between;gap:56px 96px" data-grid="framing">
  <div><p class="rv" style="font-size:clamp(34px,3.6vw,52px);line-height:1.1;color:var(--grey)">Behaviour is the diagnosis.</p><h2 class="rv t-display" style="--d:1;font-size:clamp(60px,7.5vw,108px);margin-top:10px">The services are <span class="c-bluel">the intervention.</span></h2></div>
  <div class="io">
    <div class="hub-stats">${[[3, 'SYSTEMS'], [8, 'DISCIPLINES'], [64, 'SERVICES']].map(([n, l]) => `<div><b data-count="${n}">${n}</b><span>${l}</span></div>`).join('')}</div>
    <div class="probsel"><p class="mono-s c-grey">Start from your problem</p>${[['People arrive but do not buy or sign up', 'ux-design', 'Web Design and UX'], ['Ad spend rises, results do not', 'paid-media', 'Ads (Paid Media)'], ['Nobody is sure what to fix first', 'consulting', 'Consulting'], ['A new tool or system is not being adopted', 'software-development', 'Software Development'], ['People do not understand or remember us', 'video-creation', 'Video Creation']].map(([t, sl, n]) => `<a href="/services/${sl}/"><span>${t}</span><b>${n} ${arr}</b></a>`).join('')}<a href="/check/" class="alt"><span>Not sure? Take the 2-minute hesitation check</span><b>${arr}</b></a></div>
  </div>
</div></section>`;

  const systems = DISC.map(S => `<section class="sec-m ${S.bg}" id="${S.sys}" style="scroll-margin-top:80px"><div class="wrap">
  <div class="sys-h"><div><p class="lbl rv"><i></i>${S.label}</p><h2 class="rv" style="--d:1">${esc(S.title)}</h2></div><span class="ghost" aria-hidden="true">${S.n}</span></div>
  <div class="discs">${S.items.map(([slug, im, n, d, q, tags], i) => { disc++; return `<article class="disc${S.alt ? ' alt' : ''} rv" style="--d:${i}">
    <div class="ph"><img src="${img(im)}" alt="" loading="lazy"><span class="cnt">08 SERVICES</span></div>
    <div class="bd"><p class="k">DISCIPLINE ${pad2(disc)}</p><h3>${esc(n)}</h3><p>${esc(d)}</p><hr><div><span class="chip">We also ask:</span><p class="aq">${esc(q)}</p></div>
    <div class="tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}<span class="more">+5</span></div>
    <a class="link" href="/services/${slug}/">Explore ${esc(n)} ${arr}</a></div></article>`; }).join('')}
    ${S.sys === 'transformation' ? `<aside class="lnote rv" style="--d:2"><div><i></i><p class="k">ONE LAYER, EVERY SERVICE</p><p>Behavioural science runs across all three as an additional way of seeing the problem.</p></div></aside>` : ''}
  </div>
</div></section>`).join('\n');

  const fq = [['140:46', 'SIGNAL', 'What changed, or isn’t changing?'], ['140:58', 'SYSTEM', 'Where is it happening?'], ['140:70', 'BEHAVIOUR', 'What are people actually doing?', 1], ['140:83', 'CONTEXT', 'What is shaping that behaviour?'], ['140:102', 'EVIDENCE', 'What supports the hypothesis?']];
  const questions = `<section class="sec bg-black" id="questions"><div class="wrap">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap"><h2><span class="rv" style="display:block;font-size:clamp(36px,3.9vw,56px);line-height:1.1">Different services.</span><span class="rv t-display c-bluel" style="--d:1;display:block;font-size:clamp(56px,7.2vw,104px);line-height:1">The same first questions.</span></h2></div>
  <div class="fq" style="margin-top:80px">${fq.map(([im, k, h, on], i) => `<div class="rv" style="--d:${i}"><div class="tl"><i${on ? ' class="on"' : ''}></i><s></s></div><div class="crop rv-img"><img src="${img(im)}" alt="" loading="lazy"></div><span class="lb${on ? ' on' : ''}">${pad2(i + 1)}  /  ${k}</span><h3>${esc(h)}</h3></div>`).join('')}</div>
</div></section>`;

  const rows = [['ONE', [4]], ['THREE', [1, 2, 6]]];
  const scale = `<section class="sec bg-ink"><div class="wrap" style="display:grid;grid-template-columns:minmax(0,676px) minmax(0,540px);justify-content:space-between;gap:56px 96px;align-items:center" data-grid="scale">
  <h2 class="t-display rv" style="font-size:clamp(52px,6.4vw,92px)">Some briefs need<br>one service.<br>Some need three.<br><span class="c-amberl">We’ll tell you which.</span></h2>
  <div class="scope-sel io" aria-label="Scope: one discipline, three disciplines, or decided after the diagnosis">
    ${rows.map(([l, on]) => `<div class="srow"><span class="rl">${l}</span>${Array.from({ length: 8 }, (_, i) => `<b class="${on.includes(i + 1) ? 'on' : ''}" style="--i:${i}">${pad2(i + 1)}</b>`).join('')}</div>`).join('')}
    <div class="srow"><span class="rl">AFTER THE DIAGNOSIS</span>${Array.from({ length: 8 }, (_, i) => `<b class="q">?</b>`).join('')}</div>
  </div>
</div></section>`;

  const angles = `<section class="sec-m bg-paper"><div class="wrap">
  <p class="mono c-muted rv">Behavioural angles</p><h2 class="h-sec rv" style="--d:1;margin-top:16px;font-size:clamp(44px,5.3vw,76px)">Two ways to read<br><span style="color:var(--muted-2)">the same problem.</span></h2>
  <div class="angles" style="margin-top:56px">
    ${[['273:40', 'The data view', 'What the numbers show.', ['Where people hesitate, drop off or come back.', 'Which step carries the most friction.', 'What the behaviour says.']], ['273:54', 'The brand view', 'What the brand signals.', ['How it looks, sounds and feels at the moment of choice.', 'Whether trust is built or lost on the page.', 'What the message promises against what the page delivers.']]].map(([im, h, s, li], i) => `<article class="angle rv" style="--d:${i}"><div class="im"><img src="${img(im)}" alt="" loading="lazy"></div><h3>${h}</h3><p class="sub">${s}</p><ul>${li.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}
  </div>
  <p class="serif rv" style="font-size:40px;line-height:46px;margin-top:56px">We read both before we recommend anything.</p>
</div></section>`;

  const chips = ['All', 'Digital Marketing', 'Consulting', 'Web Development', 'Software', 'Web Design & UX', 'Video', 'Ads', 'Corporate Films'];
  const pcases = [['273:122', 'D2C RETAIL  /  DIGITAL MARKETING', 'Intent-led search rebuilt', '+41%', 'organic leads', 'Digital Marketing|Ads'], ['273:130', 'SAAS  /  WEB DESIGN AND UX', 'Sign-up flow redesigned', '+21%', 'sign-up completion', 'Web Design & UX|Web Development'], ['273:138', 'FINTECH  /  SOFTWARE DEVELOPMENT', 'Onboarding steps halved', '+26%', 'completion rate', 'Software|Consulting']];
  const cases = `<section class="sec-m bg-ink" id="cases"><div class="wrap">
  <p class="mono c-grey2 rv">Deliverables and case studies</p><h2 class="h-sec rv" style="--d:1;margin-top:16px;font-size:clamp(44px,5.3vw,76px)">What you receive.<br><span class="c-grey2">How it is measured.</span></h2>
  <div class="fchips rv" style="margin-top:56px" data-group data-filter=".pcase" role="group" aria-label="Filter proof by service">${chips.map((c, i) => `<button class="fchip" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}</div>
  <div class="dv">
    <div class="rv"><p class="k">WHAT YOU RECEIVE</p><ul class="rlist">${['Behavioural audit', 'Journey and friction map', 'Prioritised roadmap', 'Messaging and page structure', 'Design system and prototypes', 'Build and quality assurance', 'Campaign and media plan', 'Measurement dashboard'].map((t, i) => `<li><small>${pad2(i + 1)}</small>${t}</li>`).join('')}</ul></div>
    <div class="rv" style="--d:1"><p class="k">PROOF, FILTERED BY SERVICE</p>${pcases.map(([im, k, h, n, m, tags]) => `<article class="pcase" data-tags="${esc(tags)}"><img src="${img(im)}" alt="" loading="lazy"><div><p class="k" style="color:var(--grey-2)">${esc(k)}</p><h3>${esc(h)}</h3><div class="mz"><span>Measured by</span><b>${m}</b></div></div></article>`).join('')}</div>
  </div>
  <p class="note2 on-dark">Example engagements. Each one agrees a single behaviour and its baseline before work starts.</p>
</div></section>`;

  const pricing = `<section class="sec-m bg-paper3"><div class="wrap">
  <p class="mono c-muted rv">Pricing and questions</p><h2 class="h-sec rv" style="--d:1;margin-top:16px;font-size:clamp(44px,5.3vw,76px)">Know the range<br><span style="color:var(--muted-2)">before the call.</span></h2>
  <div class="prices" style="margin-top:56px">${[['SPRINT', '$8k to $20k', 'Audit and roadmap in 2 to 3 weeks.'], ['PROJECT', '$25k to $120k', 'Build and launch in 2 to 4 months.'], ['RETAINER', '$6k to $20k a month', 'Ongoing work with monthly reviews.']].map(([k, b, p], i) => `<div class="price rv${i === 1 ? ' feat' : ''}" style="--d:${i}"><p class="k">${k}</p><b>${b}</b><p>${p}</p></div>`).join('')}</div>
  <div class="faq">${[['How soon will we see movement?', 'Early signals show in 4 to 8 weeks. Compounding gains follow.'], ['Can you work with our team and tools?', 'Yes. We fit into your stack and reporting rhythm.'], ['What does scope look like?', 'One clear behaviour per phase, with outcomes agreed before we start.'], ['How do you handle security and privacy?', 'We sign an NDA before any data is shared and work within your security and privacy policies.']].map(([q, a], i) => `<details class="rv" style="--d:${i}"><summary>${q}<i aria-hidden="true">+</i></summary><div class="ans"><p>${a}</p></div></details>`).join('')}</div>
  <p class="note" style="color:var(--muted-2)">Indicative ranges. Scope and price are confirmed in writing after the fit call.</p>
</div></section>`;

  const cta = `<section class="empty-cta"><img class="par" data-par="0.06" src="${img('140:172')}" alt="" loading="lazy"><span class="heat"></span><span class="anno">Where do we start?</span>
  <div class="wrap in"><p class="mono c-grey rv">Begin here</p><h2 class="rv" style="--d:1">Not sure what<br><span class="c-bluel">you need?</span></h2><p class="s1 rv" style="--d:2">Good. That usually means the brief needs a second look.</p><p class="s2 rv" style="--d:3">Bring us the problem as you see it. We’ll start with the questions it may have missed.</p><a class="btn rv" style="--d:4" href="/contact/">${CTA} ${arr}</a></div></section>`;

  return page({ title: 'Services', desc: 'Strategy, design, technology and film, each shaped by how people actually decide. Three systems, eight disciplines, 64 services.', path: '/services/', active: 'services', body: [hero, framing, systems, questions, scale, angles, cases, pricing, cta].join('\n') });
}

/* ======================= ABOUT ======================= */
export function about() {
  const body = `
<section class="ohero ink" aria-labelledby="hh"><div class="wrap">
  <p class="crumb mono">ABOUT&nbsp;&nbsp;/&nbsp;&nbsp;COGNEXA DIGITAL</p>
  <div class="copy">
    <h1 id="hh"><span class="k rv" style="display:block">Strategy meets</span><span class="t rv" style="--d:1"><span>behavioural</span><span class="c-amber">intelligence.</span></span></h1>
    <p class="s rv" style="--d:2">Strategy, design, growth and technology shaped by applied behavioural science.</p>
    <div class="ctas rv" style="--d:3"><a class="btn" href="/contact/">${CTA} ${arr}</a><a class="link" href="#founders" style="font-weight:400">Meet the founders</a></div>
    <p class="mono-s c-dim rv" style="--d:4;margin-top:28px">Full-stack human behaviour-centric digital transformation</p>
  </div>
  <div class="venn io" role="img" aria-label="Three overlapping circles: Behaviour, Narrative and Technology. Cognexa lives where they meet.">
    <svg viewBox="0 0 600 620" fill="none">
      <circle class="c c1" cx="220" cy="230" r="170" fill="rgba(245,166,36,.06)" stroke="rgba(245,166,36,.8)"/>
      <circle class="c c2" cx="380" cy="230" r="170" fill="rgba(243,238,230,.06)" stroke="rgba(243,238,230,.8)"/>
      <circle class="c c3" cx="300" cy="370" r="170" fill="rgba(179,181,190,.06)" stroke="rgba(179,181,190,.8)"/>
      <circle cx="300" cy="280" r="44" stroke="#f5a624"/><circle cx="300" cy="280" r="26" stroke="#f5a624"/><circle cx="300" cy="280" r="4" fill="#f5a624"/>
      <line x1="210" y1="280" x2="390" y2="280" stroke="#f5a624" stroke-opacity=".8"/>
      <text x="90" y="150" font-family="JetBrains Mono" font-weight="500" font-size="12" fill="#f5a624" letter-spacing="1">BEHAVIOUR</text>
      <text x="90" y="170" font-family="Geist" font-size="13" fill="#b3b5be">Behavioural Strategy</text><text x="90" y="187" font-family="Geist" font-size="13" fill="#b3b5be">&amp; Experience</text>
      <text x="420" y="150" font-family="JetBrains Mono" font-weight="500" font-size="12" fill="#f3eee6" letter-spacing="1">NARRATIVE</text>
      <text x="420" y="170" font-family="Geist" font-size="13" fill="#b3b5be">Narrative, Content &amp; Growth</text>
      <text x="250" y="500" font-family="JetBrains Mono" font-weight="500" font-size="12" fill="#b3b5be" letter-spacing="1">TECHNOLOGY</text>
      <text x="215" y="520" font-family="Geist" font-size="13" fill="#b3b5be">Technology &amp; Digital Systems</text>
    </svg>
    <span class="tag tag-amber" style="position:absolute;left:52%;top:52%">Cognexa lives here</span>
  </div>
  <div class="opath io" style="--n:4;--pw:870px">
    <div class="track">${[['01 - FIND', 'Understand the reality.'], ['02 - FRAME', 'Identify what matters.'], ['03 - MAKE', 'Build the intervention.'], ['04 - MOVE', 'Change behaviour and outcomes.']].map(([b, s], i) => `<div class="node${i === 3 ? ' end' : ''}" style="--i:${i}"><b>${b}</b><small>${s}</small></div>`).join('')}</div>
    <p class="foot">THINK DEEPLY. BUILD PRACTICALLY. MEASURE BEHAVIOUR.</p>
  </div>
</div></section>

<section class="sec bg-black" id="founders"><div class="wrap">
  <p class="secl c-grey rv">02&nbsp;&nbsp;/&nbsp;&nbsp;THE FOUNDERS</p>
  <h2 class="h-sec rv" style="--d:1;margin-top:20px;font-size:clamp(52px,6.1vw,88px)">Three different worlds.<br><span class="c-amber">One shared question.</span></h2>
  <div class="founders" style="margin-top:72px">
    ${[['238:41', 'Hari Bala Krishnan P', '01  /  BEHAVIOUR', 'BEHAVIOURAL STRATEGY & EXPERIENCE', 'tag-amber', 'c-amber', 'A psychologist and behavioural strategist who has worked with brands across Europe and the United States on behaviour-led interventions.'],
       ['238:54', 'Akshay Krishnan', '02  /  NARRATIVE', 'NARRATIVE, CONTENT & GROWTH', 'tag-paper', 'c-paper', 'Leads narrative, content and growth: brand strategy, narrative systems, content ecosystems and growth campaigns.'],
       ['238:67', 'Hari Krishnan', '03  /  TECHNOLOGY', 'TECHNOLOGY & DIGITAL SYSTEMS', 'tag-grey', 'c-grey', 'Leads technology and digital systems: web platforms, product engineering, AI automation and systems integration.']].map(([im, n, t, r, tc, rc, p], i) => `<article class="founder rv" style="--d:${i}"><div class="pt"><img src="${img(im)}" alt="Portrait of ${esc(n)}" loading="lazy"><div class="ov"><span class="tag ${tc}" style="font-size:11px">${t}</span><h3>${esc(n)}</h3><p class="r ${rc}">${esc(r)}</p></div></div><p>${esc(p)}</p></article>`).join('')}
  </div>
  <div class="band rv"><div><h3>Behaviour. Narrative.<br><span class="c-amber">Technology.</span></h3><p>Cognexa lives where they meet.</p></div>
    <svg width="320" height="262" viewBox="0 0 320 262" fill="none" aria-hidden="true" style="max-width:100%"><circle cx="110" cy="90" r="80" fill="rgba(245,166,36,.07)" stroke="rgba(245,166,36,.8)"/><circle cx="210" cy="90" r="80" fill="rgba(243,238,230,.07)" stroke="rgba(243,238,230,.8)"/><circle cx="160" cy="172" r="80" fill="rgba(179,181,190,.07)" stroke="rgba(179,181,190,.8)"/><circle cx="160" cy="118" r="20" stroke="#f5a624"/><circle cx="160" cy="118" r="3" fill="#f5a624"/></svg>
  </div>
</div></section>

<section class="sec-m bg-black"><div class="wrap">
  <p class="secl c-grey rv">03&nbsp;&nbsp;/&nbsp;&nbsp;WHY NOW</p>
  <h2 class="h-sec-s rv" style="--d:1;margin-top:18px;max-width:1200px">AI is changing what digital systems can do. Human behaviour still determines the outcome.</h2>
  <div class="cando" style="margin-top:56px">
    <div class="rv"><p class="mono" style="font-size:12px;color:var(--grey)">AI can</p><ul>${['Scale intelligence', 'Multiply content', 'Automate processes', 'Personalise experiences'].map(t => `<li>${t}</li>`).join('')}</ul></div>
    <div class="hot rv" style="--d:1"><p class="mono c-amber" style="font-size:12px">Only behaviour creates</p><ul>${['Trust', 'Adoption', 'Preference', 'Change'].map(t => `<li>${t}</li>`).join('')}</ul></div>
  </div>
  <p class="rv" style="font-size:20px;line-height:30px;color:var(--grey);margin-top:56px">Trust, adoption, preference and change need more than capability.</p>
</div></section>

<section class="sec-m bg-ink"><div class="wrap">
  <p class="secl c-grey rv">04&nbsp;&nbsp;/&nbsp;&nbsp;HOW WE WORK</p><h2 class="h-sec-s rv" style="--d:1;margin-top:18px">Find. Frame. Make. Move.</h2>
  <div class="steps5 io" style="grid-template-columns:repeat(4,1fr);margin-top:56px">${[['FIND', 'Understand the reality.'], ['FRAME', 'Identify what matters.'], ['MAKE', 'Build the intervention.'], ['MOVE', 'Change behaviour and outcomes.']].map(([k, p], i) => `<div class="step5${i === 3 ? ' last' : ''}" style="--i:${i}${i === 3 ? ';border-top-color:var(--amber-2)' : ''}"><p class="n">${pad2(i + 1)}</p><p class="k">${k}</p><p style="font-size:20px;line-height:28px">${p}</p></div>`).join('')}</div>
  <p class="serif c-amber rv" style="font-size:36px;line-height:40px;margin-top:56px">Think deeply. Build practically. Measure behaviour.</p>
</div></section>

<section class="sec-m bg-paper"><div class="wrap">
  <p class="secl c-muted rv">05&nbsp;&nbsp;/&nbsp;&nbsp;LOOK PAST THE BRIEF</p><h2 class="h-sec-s rv" style="--d:1;margin-top:18px">The request is rarely the real problem</h2>
  <div class="grid-3 briefs3" style="margin-top:56px">${[['“We need more leads.”', 'Often a trust problem.'], ['“We need a better digital experience.”', 'Often a clarity problem.'], ['“We need AI automation.”', 'Often an adoption problem.']].map(([b, c], i) => `<div class="card rv" style="--d:${i}"><p class="mono-s c-muted">The brief</p><h3>${b}</h3><div class="cn"><p class="mono-s c-amber">The constraint</p><b>${c}</b></div></div>`).join('')}</div>
</div></section>

<section class="sec-m bg-black"><div class="wrap">
  <p class="secl c-grey rv">06&nbsp;&nbsp;/&nbsp;&nbsp;WHAT WE DO</p><h2 class="h-sec-s rv" style="--d:1;margin-top:18px">Four capabilities, one backbone</h2>
  <div class="capsx" style="margin-top:56px">${[['Strategy & Transformation', 'Clarify the change before building the machinery.', 'Digital strategy, transformation roadmaps, behavioural diagnosis, operating models'], ['Brand, Content & Growth', 'Make the meaning clear enough to convince people.', 'Brand strategy, narrative systems, content ecosystems, growth campaigns'], ['Experience & Product', 'Design around decisions as well as destinations.', 'Experience strategy, product design, service design, research and testing'], ['Technology & Automation', 'Build systems people can trust, use and sustain.', 'Web platforms, product engineering, AI automation, systems integration']].map(([h, l, d], i) => `<article class="capx rv" style="--d:${i % 2}"><p class="mono c-amber" style="font-size:12px">${pad2(i + 1)}</p><h3>${esc(h)}</h3><p class="l">${l}</p><p class="d">${d}</p></article>`).join('')}</div>
</div></section>

<section class="sec-m bg-paper"><div class="wrap">
  <p class="secl c-muted rv">07&nbsp;&nbsp;/&nbsp;&nbsp;FOUNDER PERSPECTIVE</p><h2 class="h-sec-s rv" style="--d:1;margin-top:18px">On AI and human behaviour</h2>
  <blockquote class="quote rv" style="margin-top:56px"><p>“If anything, those questions become more important when technology moves faster than behaviour.”</p><cite>HARI BALA KRISHNAN P&nbsp;&nbsp;/&nbsp;&nbsp;CO-FOUNDER</cite></blockquote>
  <p class="rv" style="font-size:18px;line-height:28px;color:var(--muted-2);margin-top:56px">AI lowers the cost of producing and automating. It does not settle questions of trust, judgment, motivation and adoption.</p>
</div></section>

<section class="sec-m bg-ink" id="contact"><div class="wrap">
  <h2 class="rv t-display" style="font-size:clamp(44px,5vw,72px);line-height:1.05"><span class="c-grey">You probably don’t need better strategy.</span><br><span class="c-amber">You need a strategy that drives behaviour.</span></h2>
  <p class="rv" style="font-weight:500;font-size:24px;margin-top:24px">Bring us the problem.</p>
  <form class="aform rv" style="margin-top:24px" name="about-contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/">
    <input type="hidden" name="form-name" value="about-contact"><input type="hidden" name="referrer" value=""><p hidden><label>Don’t fill this out: <input name="bot-field"></label></p>
    <label class="sr-only" for="a-n">Name</label><input id="a-n" name="name" placeholder="Name" required autocomplete="name">
    <label class="sr-only" for="a-e">Email</label><input id="a-e" name="email" type="email" placeholder="Email" required autocomplete="email">
    <label class="sr-only" for="a-o">Organisation</label><input id="a-o" name="organisation" placeholder="Organisation (optional)" autocomplete="organization">
    <label class="sr-only" for="a-p">What problem are we solving?</label><input id="a-p" name="problem" placeholder="What problem are we solving?" required>
    <button class="btn" type="submit" style="grid-column:1/-1;justify-self:start;margin-top:12px">Send my brief ${arr}</button>
  </form>
  <div class="form-ok" role="status">Thank you. We have your note and will be in touch within one working day.</div>
  <p class="mono-s c-grey rv" style="margin-top:24px">Where strategy meets behavioural intelligence.</p>
  <div class="offices rv" style="margin-top:24px"><div><small>LONDON, UK</small><a href="tel:${SITE.telUK}">${SITE.phoneUK}</a></div><div><small>BANGALORE, INDIA</small><a href="tel:${SITE.telIN}">${SITE.phoneIN}</a></div><div><small>ONLINE</small><a href="/contact/">cognexadigital.com</a></div></div>
</div></section>`;
  return page({ title: 'About', desc: 'Cognexa Digital: strategy, design, growth and technology shaped by applied behavioural science. Meet the founders.', path: '/about/', active: 'about', body });
}


/* ======================= CONTACT ======================= */
export function contact() {
  const body = `
<section class="sec-m bg-ink"><div class="wrap chero">
  <div><p class="mono c-amber rv">Book a conversation</p><h1 class="rv" style="--d:1;margin-top:28px"><span>Bring us the problem.</span><span class="c-amber">Bring us the brief too.</span></h1><p class="s rv" style="--d:2">Fifteen minutes. We may agree with the brief, take it apart, or find the real opportunity somewhere else. You leave with a clear next step either way.</p></div>
  <div class="c15 rv" style="--d:2"><p class="mono-s" style="color:#9ea1ad">In 15 minutes</p><ul>${['Your brief, as you see it.', 'Our first read of what may sit behind it.', 'A plain next step, even if it is not us.'].map((t, i) => `<li><b>${pad2(i + 1)}</b>${t}</li>`).join('')}</ul></div>
</div></section>

<section class="sec-m bg-paper" id="book"><div class="wrap">
  <p class="secl rv" style="color:#595957">01&nbsp;&nbsp;/&nbsp;&nbsp;BOOK</p><h2 class="h-sec-s rv" style="--d:1;margin-top:12px">Pick a time. Tell us the brief.</h2>
  <div class="bcols" style="margin-top:48px">
    <div class="bcard rv">
      <p class="k">STEP 1&nbsp;&nbsp;/&nbsp;&nbsp;CHOOSE A TIME</p>
      <div class="tgl" data-group data-target="#f-office" data-tz="#tz" role="group" aria-label="Office">
        <button aria-pressed="true" data-value="London, UK" data-tz="Times shown in UK time (GMT)">London, UK</button>
        <button aria-pressed="false" data-value="Bangalore, India" data-tz="Times shown in India time (IST)">Bangalore, India</button>
      </div>
      <p class="tz" id="tz">Times shown in UK time (GMT)</p>
      <div class="days" id="days" data-group data-target="#f-day" role="group" aria-label="Day"></div>
      <div class="slots" data-group data-target="#f-time" role="group" aria-label="Time">${['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'].map((t, i) => `<button aria-pressed="${i === 1}">${t}</button>`).join('')}</div>
      <p class="tz">Pick a preferred time. We confirm the slot by email within one working day.</p>
    </div>
    <div class="bcard rv" style="--d:1">
      <p class="k">STEP 2&nbsp;&nbsp;/&nbsp;&nbsp;TELL US THE BRIEF</p>
      <form class="bform" name="fit-call" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks/">
        <input type="hidden" name="form-name" value="fit-call">
        <input type="hidden" name="referrer" value="">
        <p hidden><label>Don’t fill this out: <input name="bot-field"></label></p>
        <input type="hidden" name="office" id="f-office" value="London, UK">
        <input type="hidden" name="day" id="f-day" value="">
        <input type="hidden" name="time" id="f-time" value="11:30">
        <input type="hidden" name="area" id="f-area" value="Not sure">
        <input type="hidden" name="service" id="f-service" value="">
        <div class="two"><label>Name<input name="name" required autocomplete="name"></label><label>Work email<input name="email" type="email" required autocomplete="email"></label></div>
        <label>Organisation (optional)<input name="organisation" autocomplete="organization"></label>
        <label>The brief, as you see it<textarea name="brief" required placeholder="What is happening, what you have tried, and what would count as a win."></textarea></label>
        <div class="bprompts" aria-label="Start from an example"><span class="mono-s">Start from an example</span>${['Traffic is steady but checkout completion is flat.', 'Demos happen, but deals stall at the committee.', 'We launched a new tool and teams are not using it.'].map(t => `<button type="button" data-prompt="${esc(t)}">${esc(t)}</button>`).join('')}</div>
        <div><span class="mono-s" style="color:#595957">Which area is closest?</span><div class="achips" data-group data-target="#f-area" role="group" aria-label="Area">${['Growth', 'Experience', 'Transformation', 'Not sure'].map(t => `<button type="button" aria-pressed="${t === 'Not sure'}">${t}</button>`).join('')}</div></div>
        <p class="fn">By booking, you agree to us contacting you about this call. See our <a href="/privacy/">privacy policy</a>.</p>
        <button class="btn" type="submit">Confirm my 15-min fit call ${arr}</button>
        <div class="who"><span class="faces">${[['238:41', 'Hari Bala Krishnan P'], ['238:54', 'Akshay Krishnan'], ['238:67', 'Hari Krishnan']].map(([id, n]) => `<img src="${img(id)}" alt="${n}" width="40" height="40" loading="lazy">`).join('')}</span><p><b>You speak with one of the three founders.</b> ${CTA_SUB.split('. ')[0]}. No pitch deck, no obligation.</p></div>
      </form>
      <div class="form-ok" role="status"><p class="serif" style="font-size:36px;line-height:1.1">Thank you.</p><p style="margin-top:10px">Your fit call request is in. We’ll confirm the slot by email within one working day.</p></div>
    </div>
  </div>
</div></section>

<section class="sec-m bg-ink"><div class="wrap">
  <p class="secl rv" style="color:#9ea1ad">02&nbsp;&nbsp;/&nbsp;&nbsp;OFFICES</p><h2 class="h-sec rv" style="--d:1;margin-top:12px;font-size:clamp(48px,5.5vw,80px)">Two cities. One conversation.</h2>
  <div class="ocards" style="margin-top:48px">
    <div class="ocard rv"><small>LONDON, UK</small><a href="tel:${SITE.telUK}">${SITE.phoneUK}</a><small>UK time (GMT)</small></div>
    <div class="ocard rv" style="--d:1"><small>BANGALORE, INDIA</small><a href="tel:${SITE.telIN}">${SITE.phoneIN}</a><small>India time (IST)</small></div>
    <div class="ocard rv" style="--d:2"><small>ONLINE</small><a href="#book">cognexadigital.com</a><small>Send the brief through the form above</small></div>
  </div>
</div></section>

<section class="sec-m bg-paper"><div class="wrap">
  <p class="secl rv" style="color:#595957">03&nbsp;&nbsp;/&nbsp;&nbsp;AFTER YOU BOOK</p><h2 class="h-sec rv" style="--d:1;margin-top:12px;font-size:clamp(48px,5.5vw,80px)">What happens next.</h2>
  <div class="nsteps" style="margin-top:48px">${[['We read your brief', 'Before the call, we read what you send and note what the brief may be hiding.'], ['Fifteen minutes', 'We tell you whether behavioural work is the right next step for you.'], ['A clear next step', 'You leave knowing what to look at first, even if the answer is not us.']].map(([h, p], i) => `<div class="rv" style="--d:${i}"><p class="mono-s" style="color:#595957">${pad2(i + 1)}</p><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
</div></section>
<script>
(function(){var d=document.getElementById('days');if(!d)return;var n=new Date(),out=[],t=new Date(n);t.setDate(t.getDate()+1);
while(out.length<5){var w=t.getDay();if(w>0&&w<6)out.push(new Date(t));t.setDate(t.getDate()+1);}
var D=['SUN','MON','TUE','WED','THU','FRI','SAT'];d.innerHTML=out.map(function(x,i){return '<button type="button" aria-pressed="'+(i===1)+'" data-value="'+x.toDateString()+'"><small>'+D[x.getDay()]+'</small><b>'+x.getDate()+'</b></button>'}).join('');
document.getElementById('f-day').value=out[1].toDateString();
var q=new URLSearchParams(location.search),ta=document.querySelector('textarea[name=brief]'),s=q.get('service');if(s){document.getElementById('f-service').value=s;ta.placeholder='About '+s+'…';}
var sy=q.getAll('s'),b=q.get('brief'),lines=[];if(b)lines.push(b);if(sy.length)lines.push('What we are seeing:\\n- '+sy.join('\\n- '));if(lines.length)ta.value=lines.join('\\n\\n')+'\\n\\n';
document.querySelectorAll('[data-prompt]').forEach(function(x){x.addEventListener('click',function(){ta.value=(ta.value?ta.value.trim()+'\\n':'')+x.dataset.prompt;ta.focus();});});})();
</script>`;
  return page({ title: 'Contact & booking', desc: 'Book a 15-minute fit call with Cognexa. Bring us the problem, and the brief too. Offices in London and Bangalore.', path: '/contact/', active: 'contact', body });
}

/* ======================= THINKING ======================= */
const ART_HREF = '/thinking/why-shoppers-hesitate/';

export function thinking() {
  const filters = ['All', 'AI and Transformation', 'Growth and Marketing', 'Consumer Decision-Making', 'Digital Experience', 'Technology Adoption', 'Business Systems', 'Behavioural Science'];
  const body = `
<section class="bg-paper" style="padding:96px 0 56px"><div class="wrap">
  <p class="mono rv" style="color:#595957">Thinking</p>
  <h1 class="t-display rv" style="--d:1;font-size:clamp(60px,7.2vw,104px);line-height:1;margin-top:28px">Behaviour in a digital economy.</h1>
  <p class="rv" style="--d:2;font-size:22px;line-height:32px;color:#595957;margin-top:28px">Ideas, research and perspectives from the intersection of business, behaviour and technology.</p>
</div></section>
<section class="bg-paper" style="padding:24px 0 72px"><div class="wrap">
  <a class="tfeat rv" href="${ART_HREF}"><div class="im"><img src="/assets/img/ig-checkout.webp" alt="Illustrative chart: where shoppers pause in a checkout — the payment step" fetchpriority="high"></div>
  <div><p class="mono" style="font-size:12px;color:#595957">Featured&nbsp;&nbsp;/&nbsp;&nbsp;Consumer decision-making</p><h2>Why shoppers hesitate at the last click</h2><p>A conversion problem is often a trust problem wearing a different label. Here is how to tell which one you have.</p><p class="mono" style="font-size:12px;color:#595957;margin-top:20px">Cognexa team&nbsp;&nbsp;/&nbsp;&nbsp;6 min read</p><span class="link" style="display:inline-block;margin-top:20px">Read the article ${arr}</span></div></a>
</div></section>
<section class="bg-paper" style="padding:24px 0 40px"><div class="wrap">
  <p class="mono-s" style="color:#595957">Filter by topic</p>
  <div class="tfil" data-group data-filter=".art" data-mode="hide" role="group" aria-label="Filter by topic" id="tfil">${filters.map((f, i) => `<button aria-pressed="${i === 0}">${f}</button>`).join('')}</div>
</div></section>
<section class="bg-paper" style="padding:24px 0 96px"><div class="wrap">
  <div class="arts">${ARTICLES.map(({ image: ig, topic: k, title: h, lede: p, read: m, slug }, i) => `<a class="art rv" style="--d:${i % 3}" href="/thinking/${slug}/" data-tags="${k}"><div class="im"><img src="${ig}" alt="" loading="lazy"></div><p class="k">${k.toUpperCase()}</p><h3>${esc(h)}</h3><p>${esc(p)}</p><p class="m">Cognexa team&nbsp;&nbsp;/&nbsp;&nbsp;${m} min read</p></a>`).join('')}</div>
</div></section>
<section class="tcta"><div class="wrap"><p class="mono rv" style="color:#9ea1ad">Fit call</p><h2 class="rv" style="--d:1">Reading is a start. The brief is the conversation.</h2><a class="btn rv" style="--d:2" href="/contact/">Book a 15-min fit call ${arr}</a></div></section>
<script>
(function(){var q=new URLSearchParams(location.search).get('topic');if(!q)return;q=q.replace(/&/g,'and').toLowerCase();var b=[].slice.call(document.querySelectorAll('#tfil button')).find(function(x){return x.textContent.toLowerCase().replace('-',' ')===q.replace('-',' ')||x.textContent.toLowerCase()===q});if(b)setTimeout(function(){b.click()},50);})();
</script>`;
  return page({ title: 'Thinking', desc: 'Ideas, research and perspectives from the intersection of business, behaviour and technology.', path: '/thinking/', active: 'thinking', body });
}

export function article() {
  const body = `
<article>
<header class="bg-paper" style="padding:80px 0 48px"><div class="wrap ahead">
  <p class="mono rv" style="color:#595957">Thinking&nbsp;&nbsp;/&nbsp;&nbsp;Consumer decision-making</p>
  <h1 class="rv" style="--d:1">Why shoppers hesitate at the last click</h1>
  <p class="s rv" style="--d:2">A conversion problem is often a trust problem wearing a different label.</p>
  <p class="mono rv" style="--d:3;font-size:12px;color:#595957;margin-top:26px">Cognexa team&nbsp;&nbsp;/&nbsp;&nbsp;6 min read&nbsp;&nbsp;/&nbsp;&nbsp;Sample article</p>
</div></header>
<div class="bg-paper" style="padding:0 0 64px"><div class="wrap"><div class="rv-img"><img src="/assets/img/ig-checkout-wide.webp" alt="Illustrative chart: hesitation peaks at the payment step, where shoppers ask about total cost and return policy" fetchpriority="high" style="width:100%"></div></div></div>
<div class="bg-paper" style="padding:0 0 96px"><div class="wrap abody">
  <nav class="toc" aria-label="In this article"><p class="mono-s" style="color:#595957">In this article</p><a href="#s1" class="on">01&nbsp;&nbsp; The brief says conversion</a><a href="#s2">02&nbsp;&nbsp; Look at the moment</a><a href="#s3">03&nbsp;&nbsp; A smaller, safer last step</a></nav>
  <div class="prose">
    <p class="rv">A shopper who reaches checkout has already decided something. What happens next is rarely about the product. It is about whether the last step feels safe, fair and small.</p>
    <h2 id="s1" class="rv">The brief says conversion. The behaviour says doubt.</h2>
    <p class="rv">When a store asks why checkout completion is low, the usual answer is a shorter form or a faster page. Sometimes that is right. Often the hesitation sits earlier: an unexpected cost, a return policy that is hard to find, a payment step that looks unfamiliar.</p>
    <blockquote class="rv">A conversion problem is often a trust problem wearing a different label.</blockquote>
    <h2 id="s2" class="rv">Look at the moment</h2>
    <p class="rv">We start by watching where people slow down, go back or leave, and then ask what they were weighing at that moment. Effort, risk and uncertainty each leave different traces.</p>
    <div class="callout rv"><p class="mono-s" style="color:#595957">What we look for</p><ul><li>•&nbsp; Where people pause.</li><li>•&nbsp; What they check before paying.</li><li>•&nbsp; What they go back to read.</li></ul></div>
    <figure class="fig rv"><div class="fflow"><div><span>Cart</span></div><div><span>Details</span></div><div><em>Doubt</em><span class="on">Payment</span></div><div><span>Confirm</span></div></div><figcaption>Figure 1. Where hesitation tends to show up in a checkout flow (illustrative).</figcaption></figure>
    <h2 id="s3" class="rv">A smaller, safer last step</h2>
    <p class="rv">Once the doubt is named, the fix is usually modest: say the total early, make returns visible, and keep the payment step familiar. The aim is a decision that feels safe.</p>
    <figure class="fig rv"><img src="/assets/img/ig-doubts.webp" alt="Three doubts and three small fixes: show the total early, make returns visible, keep the payment step familiar" loading="lazy"><figcaption>Figure 2. Three doubts shoppers carry to the last click, and the small fixes that answer them (illustrative).</figcaption></figure>
    <p class="mono rv" style="font-size:12px;color:#595957;border-top:1px solid var(--line);padding-top:20px;text-transform:none;letter-spacing:.02em">Written by the Cognexa team. Sample article text, to be replaced.</p>
  </div>
</div></div>
</article>
${relatedCards(['what-should-ai-speed-up', 'five-second-rule-homepage'])}
<section class="tcta"><div class="wrap"><p class="mono rv" style="color:#9ea1ad">Fit call</p><h2 class="rv" style="--d:1">Bring us the brief. We will tell you what may sit behind it.</h2><a class="btn rv" style="--d:2" href="/contact/">Book a 15-min fit call ${arr}</a></div></section>`;
  return page({ title: 'Why shoppers hesitate at the last click', desc: 'A conversion problem is often a trust problem wearing a different label. Here is how to tell which one you have.', path: ART_HREF, active: 'thinking', body });
}

export function thanks() {
  const body = `<section class="sec bg-ink" style="min-height:70vh"><div class="wrap"><p class="mono c-amber rv">Received</p><h1 class="t-display rv" style="--d:1;font-size:clamp(60px,7vw,104px);margin-top:24px">Thank you.<br><span class="c-amber">We’ll be in touch.</span></h1><p class="rv" style="--d:2;font-size:20px;color:var(--grey);margin-top:28px;max-width:560px">We read every brief before we reply. Expect a note from us within one working day.</p><a class="btn rv" style="--d:3;margin-top:36px" href="/">Back to home ${arr}</a></div></section>`;
  return page({ title: 'Thank you', desc: 'Thanks for your brief.', path: '/thanks/', body });
}

export function notFound() {
  const body = `<section class="sec bg-paper" style="min-height:70vh"><div class="wrap"><p class="mono c-muted rv">404</p><h1 class="t-display rv" style="--d:1;font-size:clamp(60px,9vw,140px);margin-top:24px">That page sounds<br>like a <span class="hl">solution.</span></h1><p class="rv io" style="--d:2;font-size:20px;color:var(--muted);margin-top:28px;max-width:560px">We couldn’t find it. Let’s start with the problem instead.</p><div class="ctas rv" style="--d:3;margin-top:36px"><a class="btn" href="/">Back to home ${arr}</a><a class="link" href="/contact/">Bring us the brief</a></div></div></section>`;
  return page({ title: 'Page not found', desc: 'Page not found.', path: '/404', body });
}
