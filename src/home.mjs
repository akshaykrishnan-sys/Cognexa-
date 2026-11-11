import { img, esc, arr, page , CTA, CTA_SUB, IND, mark, fpos } from './lib.mjs';
import { readFileSync } from 'node:fs';
import { readJSON } from './content.mjs';

const scope = readFileSync(new URL('../public/assets/svg/nested-scope.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg aria-hidden="true" ');

const briefs = [
  { tab: '“We need more leads.”', q: 'What makes acquisition the constraint?', opts: ['Not enough people arriving?', 'The wrong people arriving?', 'Enough people arriving, but too few deciding?'], a: 'More leads may be the answer.', b: 'Or they may simply make the existing problem bigger.' },
  { tab: '“We need AI.”', q: 'What needs to become better?', opts: ['Speed?', 'Cost?', 'Decision quality?', 'Customer experience?', 'Capability?'], a: 'AI is a capability.', b: 'The business outcome is the brief.' },
  { tab: '“We need a new website.”', q: 'What needs to change because of it?', opts: ['Perception?', 'Understanding?', 'Trust?', 'Navigation?', 'Conversion?'], a: '', b: 'A new interface matters when it changes the right outcome.' },
  { tab: '“We need automation.”', q: 'What should become automatic?', opts: ['And what should not?'], a: 'Faster isn’t always better.', b: 'Better is better.' },
];

const CL = readJSON('settings/clients.json');
const clients = CL.logos.map(l => [l.logo, l.name, l.context]);

const lenses = [['24:43', 'Technology', 'What becomes possible?'], ['24:47', 'Experience', 'What does someone encounter?'], ['24:51', 'Context', 'What shapes the decision?'], ['24:55', 'Behaviour', 'What happens in practice?', true], ['24:59', 'Business', 'What outcome follows?']];

const stages = [
  ['24:81', 'Signal', 'What changed, or isn’t changing?', ['Revenue. Conversion. Adoption. Efficiency. Engagement. Experience.']],
  ['24:93', 'System', 'Where is it happening?', ['Across the market, customer journey, technology, process or organisation.']],
  ['24:105', 'Behaviour', 'What are people actually doing?', ['Not simply what the process assumes they do.'], true],
  ['24:117', 'Context', 'What is shaping that behaviour?', ['Information. Friction. Incentives. Expectations. Environment. Constraints.']],
  ['24:136', 'Evidence', 'What supports the hypothesis?', ['And what contradicts it?']],
  ['24:149', 'Intervention', 'What should change?', ['Strategy. Technology. Experience. Communication. Process. Behaviour.', 'Or some combination of them.']],
];

const systems = [
  ['25:49', 'Growth', 'Turn attention into commercial movement.', ['Marketing Strategy', 'Behavioural Marketing', 'Campaigns', 'MarTech', 'Conversion', 'Customer Decision Journeys'], '/services/#growth'],
  ['25:54', 'Experience', 'Design around how people understand, navigate, evaluate and decide.', ['UX / CX', 'Web & Digital Experience', 'Customer Journeys', 'Product Experience', 'Behavioural Design', 'User Journey Mapping'], '/services/#experience'],
  ['25:59', 'Transformation', 'Apply technology where it creates business advantage.', ['AI', 'Automation', 'Digital Systems', 'Process Redesign', 'Technology Adoption', 'Transformation Strategy'], '/services/#transformation'],
];

const pairs = [
  ['“How do we increase conversion?”', 'Where is confidence being lost?'],
  ['“How do we improve adoption?”', 'What is the existing behaviour accomplishing that the new system isn’t?'],
  ['“How should we redesign the journey?”', 'Which decision should become easier because of the redesign?'],
  ['“How do we automate the process?”', 'Which parts benefit from automation, and which still depend on judgement?'],
  ['“How should we communicate this?”', 'What must someone understand, believe or feel confident about before they act?'],
];

const outcomes = [[23, 'Revenue', 'E-commerce. Checkout conversion.'], [31, 'Conversion', 'B2B and SaaS. Demo bookings.'], [18, 'Customer value', 'Healthcare. Return visits.'], [37, 'Efficiency', 'Education. Forms completed.'], [19, 'Adoption', 'B2B and SaaS. Trial activation.'], [29, 'Decision quality', 'Fintech. First deposits.']];

// hero slideshow: slug, name, photo, question, tag, tag colour, ring/tag position (% of the photo)
const HS = IND.map(([slug, name, im, , q], i) => [slug, name, im, q, ['Doubt? returns', 'Risk? internal blame', 'Effort? next step', 'Belonging?', 'Trust? security signals'][i], ['tag-amber', 'tag-rust', 'tag-blue', 'tag-amber', 'tag-blue'][i], [62, 50, 62, 50, 40][i], [43, 45, 43, 45, 42][i]]);
const verticals = [['e-commerce', 'E-commerce', 'Why do shoppers hesitate at the last step?'], ['b2b-saas', 'B2B & SaaS', 'Why do buying committees stall?'], ['healthcare', 'Healthcare', 'Why do patients delay the next step?'], ['education', 'Education', 'Why do learners drop off?'], ['fintech', 'Fintech', 'Why does a good product still not feel trusted?']];

const topics = ['AI & Transformation', 'Growth & Marketing', 'Consumer Decision-Making', 'Digital Experience', 'Technology Adoption', 'Business Systems', 'Behavioural Science'];

const topAnn = [['The offer?', 26], ['The audience?', 166], ['Price?', 326], ['Competition?', 446], ['Technology?', 586], ['Experience?', 716]];
const botAnn = [['Trust?', 56], ['Decision effort?', 216], ['Sales follow-up?', 376], ['Timing?', 536], ['Context?', 696]];

export function home() {
  const body = `
<!-- 01 HERO -->
<section class="hx" aria-labelledby="h1" data-hx>
  <div class="hx-media"><img class="hx-bg" src="/assets/img/hero-cobalt.webp" alt="A man in a leather jacket lifting his glasses for a closer look" width="2600" height="1405" fetchpriority="high"></div>
  <div class="hx-grid" aria-hidden="true">
    ${[4.4, 40, 88].map((x, i) => `<i class="gv" style="left:${x}%;--i:${i}"></i>`).join('')}
    ${[13, 38, 62, 86].map((y, i) => `<i class="gh" style="top:${y}%;--i:${i}"></i>`).join('')}
    ${[4.4, 40, 88].flatMap(x => [13, 38, 62, 86].map(y => `<b class="gd" style="left:${x}%;top:${y}%"></b>`)).join('')}
  </div>
  ${['“We need more leads.”', '“We need AI.”', '“We need a new website.”', '“We need automation.”'].map((q, i) => `<p class="hx-q" style="top:${[15.5, 40.5, 64.5, 88.5][i]}%;--i:${i}">${q}</p>`).join('')}
  <div class="hx-in">
    <h1 id="h1"><span class="k">Those sound like solutions.</span><span class="t" data-mask>What’s the <em>problem?</em></span></h1>
    <p class="sub">Cognexa is a behavioural insights agency for e&#8209;commerce, B2B and SaaS, healthcare, education and fintech teams. We find what is really driving a business outcome, then design, build and market the change.</p>
    <div class="hx-ctas"><a class="btn-amber" href="/contact/">${CTA} ${arr}</a><button class="hx-film" type="button" data-film="/assets/video/cognexa-film.mp4"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>Watch the film <span>0:33</span></button></div>
  </div>
  <p class="hx-scroll mono" aria-hidden="true"><i></i>Scroll</p>
  <dialog class="film-dlg" aria-label="Cognexa brand film"><button class="film-x" type="button" aria-label="Close the film">×</button><video controls playsinline preload="none" poster="/assets/video/film-poster.webp"><source src="/assets/video/cognexa-film.mp4" type="video/mp4"><track kind="captions" src="/assets/video/cognexa-film.en.vtt" srclang="en" label="English"></video></dialog>
</section>

<!-- 01b BRIEF CHOOSER -->
<section class="chooser-sec cx2" aria-labelledby="cx-h">
  
  <div class="wrap">
    <div class="cx-head">
      <h2 id="cx-h" class="cx-title" data-words>Every brief is a guess about the problem.</h2>
      <p class="cx-sub">Pick the one that sounds like yours. We’ll show you the questions we ask before anything gets built.</p>
    </div>
    <div class="chooser" data-chooser>
      <div class="chooser-tabs" role="tablist" aria-orientation="vertical" aria-label="Choose a brief">
        <p class="chooser-prompt" aria-hidden="true">Choose a brief.</p>
        ${briefs.map((b, i) => `<button class="ctab" role="tab" id="bt${i}" aria-controls="bp${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${b.tab}</button>`).join('')}
      </div>
      <div class="cpanel">
        ${briefs.map((b, i) => `<div class="cview${i === 0 ? ' is-active' : ''}" role="tabpanel" id="bp${i}" aria-labelledby="bt${i}"${i ? ' aria-hidden="true"' : ''}>
          <div class="cq"><h3>${esc(b.q)}</h3><div>${b.opts.map(o => `<button class="copt" aria-pressed="false"><span class="box"></span>${esc(o)}</button>`).join('')}</div></div>
          <div class="cfind">${b.a ? `<p>${esc(b.a)}</p>` : ''}<p class="strong"><span class="hl">${esc(b.b)}</span></p></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- 02 SIGNAL ≠ DIAGNOSIS -->
<section class="signal" aria-labelledby="sig-h">
  <div class="wrap signal-top">
    <div>
      <p class="big-num rv" aria-label="2.8 percent" data-count="2.8" data-dec="1" data-suf="%">2.8%</p>
      <p class="conv rv" style="--d:1" id="sig-h">Conversion.</p>
      <div class="verdict rv" style="--d:2"><p class="mono-n">Useful signal.</p><p class="serif">Incomplete diagnosis.</p></div>
    </div>
    <div class="unit io" role="img" aria-label="Unit chart: 1,000 visitors, 28 converted. Many possible causes sit around the number.">
      ${topAnn.map(([t, x], i) => `<span class="anno tag-paper" style="left:${(x / 808 * 100).toFixed(2)}%;top:66px;transition-delay:${0.6 + i * 0.08}s">${t}</span><span class="probe" style="left:${((x + 12) / 808 * 100).toFixed(2)}%;top:96px;height:30px;transition-delay:${0.8 + i * 0.08}s"></span>`).join('')}
      <div class="unit-dots" data-n="1000" data-hits="28"></div>
      ${botAnn.map(([t, x], i) => `<span class="probe" style="left:${((x + 12) / 808 * 100).toFixed(2)}%;top:446px;height:44px;transition-delay:${1.2 + i * 0.08}s"></span><span class="anno tag-paper" style="left:${(x / 808 * 100).toFixed(2)}%;top:490px;transition-delay:${1.1 + i * 0.08}s">${t}</span>`).join('')}
    </div>
  </div>
  <div class="pin-x"><div class="pin-s">
  <div class="wherewhy">
    <img src="${img('23:1234')}" alt="A man reviewing an online checkout on a laptop at night" loading="lazy" width="1440" height="680">
    <svg class="marks" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none"><path d="M28 54.8V30.5H50M1412 54.8V30.5H1390M28 650V672H50M1412 650V672H1390" stroke="#F3EEE6" stroke-opacity=".7" stroke-width="1.5"/></svg>
    ${mark('23:1234', 'Decision effort?', 'tag-blue')}
    <div class="stmt">
      <p class="s1 rv">A metric tells us where something is happening.</p>
      <h2 class="rv" style="--d:1">Why it happens needs a closer look.</h2>
      <p class="n rv" style="--d:2">Cognexa investigates the mechanisms behind performance before recommending the intervention.</p>
    </div>
  </div>
  </div></div>
</section>

<!-- CLIENTS -->
<section class="clients" aria-labelledby="cl-h">
  <div class="wrap">
    <p class="mono c-muted rv">Worked with</p>
    <h2 id="cl-h" class="rv" style="--d:1">Organisations our team<br><span style="color:var(--muted-2)">has worked with.</span></h2>
    <div class="cgrid" data-mcollapse="6">
      ${clients.map(([id, n, ctx], i) => `<div class="client rv" style="--d:${i % 4}"><span class="n">${String(i + 1).padStart(2, '0')}</span><div class="lh"><img src="${img(id)}" alt="${esc(n)} logo" loading="lazy"></div><span class="nm">${esc(n.toUpperCase())}</span>${ctx ? `<span class="ctx">${esc(ctx)}</span>` : ''}</div>`).join('')}
    </div>
    <p class="fine">${esc(CL.note)}</p>
  </div>
</section>

<!-- INDUSTRY TILES -->
<section class="itiles" aria-labelledby="it-h">
  <div class="wrap">
    <div class="it-head"><div><p class="mono c-muted rv">Start with your industry</p>
    <h2 id="it-h" class="rv" style="--d:1" data-words>Same behavioural science.<br><span style="color:var(--muted-2)">Different pause.</span></h2></div>
    <a class="link rv" href="/industries/">Compare all five industries ${arr}</a></div>
    <div class="it-grid mscroll">
      ${IND.map(([s, n, im, , q, pause, change], i) => `<a class="itile rv" style="--d:${i}" href="/industries/${s}/"><div class="im"><img src="${img(im)}" alt="" loading="lazy"></div><div class="bd"><p class="k">${esc(n)}</p><h3>${esc(q)}</h3><dl><dt>Typical pause</dt><dd>${esc(pause)}</dd><dt>What we change</dt><dd>${esc(change)}</dd></dl><span class="go">See the playbook ${arr}</span></div></a>`).join('')}
    </div>
  </div>
</section>

<!-- 03 THE COGNEXA DIFFERENCE -->
<section class="sec diff" id="difference" aria-labelledby="df-h">
  <div class="wrap">
    <div class="twoq">
      <div class="conv rv"><p class="mono c-muted">Most Transformation Asks:</p><p>What can the system do?</p></div>
      <div class="rv" style="--d:1"><span class="chip">We also ask:</span><h2 id="df-h">What does the system ask people to do?</h2></div>
    </div>
    <div class="lenses io">
      ${lenses.map(([id, k, q, key], i) => `<div class="lens${key ? ' key' : ''}" style="--spread:${(i - 2) * -40};z-index:${key ? 2 : 1}"><div class="ph" style="${key ? 'box-shadow:0 0 0 8px var(--blue)' : 'box-shadow:0 0 0 5px var(--paper)'}"><img src="${img(id)}" alt="" loading="lazy"></div><div class="cap"><p class="mono-s">${k}</p><p>${q}</p></div></div>`).join('')}
      <span class="dot" style="left:calc(50% - 365px);background:var(--rust)"></span><span class="dot" style="left:calc(50% - 129px);background:#7b9cf5"></span><span class="dot" style="left:calc(50% + 107px);background:var(--blue)"></span><span class="dot" style="left:calc(50% + 343px);background:var(--amber)"></span>
    </div>
    <div class="synth io">
      <p class="rv">Technology, experience, context and behaviour do not operate independently.</p>
      <p class="rv" style="--d:1">Neither should transformation.</p>
      <p class="pay rv" style="--d:2"><span class="hl">Cognexa works where they meet.</span></p>
    </div>
  </div>
</section>

<!-- 04 THE COGNEXA AUDIT -->
<section class="sec audit" aria-labelledby="au-h">
  <div class="wrap">
    <div class="audit-grid">
      <div class="audit-head">
        <p class="rv" id="au-h">Before we decide what to change,</p>
        <p class="serif rv" style="--d:1">we investigate what’s driving the outcome.</p>
        <div class="audit-meter" data-meter="#stages" aria-hidden="true"><span></span></div>
      </div>
      <div id="stages" data-mcollapse="2" data-mc-sel=".stage">
        ${stages.map(([id, k, h, ps, on], i) => `${i ? '<p class="flow" aria-hidden="true">↓</p>' : ''}<article class="stage rv"><div class="crop rv-img"><img src="${img(id)}" alt="" loading="lazy"></div><div><span class="lbl${on ? ' on' : ''}">${k.toUpperCase()}</span><h3>${esc(h)}</h3>${ps.map(p => `<p>${esc(p)}</p>`).join('')}</div></article>`).join('\n        ')}
      </div>
    </div>
    <div class="principle">
      <div class="rv"><p>The goal is a clear diagnosis.</p><p class="serif" data-words>Understanding what’s actually driving the outcome.</p></div>
      
    </div>
  </div>
</section>

<!-- 05 WHAT WE CHANGE -->
<section class="sec systems bg-paper" aria-labelledby="sy-h">
  <div class="wrap">
    <h2 id="sy-h"><span class="a rv">One diagnostic layer.</span><span class="b rv" style="--d:1">Three intervention systems.</span></h2>
    <div class="panels mscroll">
      ${systems.map(([id, t, p, , href], i) => `<a class="panel rv" style="--d:${i}" href="${href}"><img class="par" data-par="0.05" src="${img(id)}" alt="" loading="lazy"><div class="cap"><h3>${t.toUpperCase()}</h3><p>${esc(p)}</p></div></a>`).join('')}
    </div>
    <div class="layer rv"><i></i>Behavioural science runs across all three as an additional way of seeing the problem.</div>
    <div class="caps mobile-hide">
      ${systems.map(([, t, , list, href], i) => `<div class="rv" style="--d:${i}"><ul>${list.map(l => `<li>${esc(l)}</li>`).join('')}</ul><a class="link" href="${href}">Explore ${t} ${arr}</a></div>`).join('')}
    </div>
  </div>
</section>

<!-- 06 BEHAVIOURAL ADVANTAGE -->
<section class="sec adv" aria-labelledby="ad-h">
  <div class="wrap">
    <h2 id="ad-h" class="rv">We ask different questions before we build the answer.</h2>
    <div class="adv-grid">
      <div class="pairs" data-mcollapse="2" data-mc-sel=".pair">
        ${pairs.map(([q, a], i) => `${i ? '<div class="sep" aria-hidden="true">/</div>' : ''}<div class="pair rv"><p class="q">${esc(q)}</p><span class="chip">We also ask:</span><p class="a">${esc(a)}</p></div>`).join('')}
      </div>
      <div class="observer rv-img"><img src="${img('25:155')}" alt="A man pausing to think, hand on chin" loading="lazy"></div>
    </div>
    <div class="adv-pay rv"><p>Behavioural science changes the questions.</p><p class="serif">Better questions can change the intervention.</p></div>
  </div>
</section>

<!-- 08 RECOMMENDATION -->
<section class="sec bg-ink" aria-labelledby="rc-h">
  <div class="wrap">
    <div class="rec-top">
      <h2 id="rc-h" class="rv" data-words>Sometimes the right answer is <span class="c-amberl">smaller than the brief.</span></h2>
      <div class="scope io">${scope}</div>
    </div>
    <div class="recon mscroll">
      <div class="rv"><h3>You may not need more leads.</h3><p>The opportunity may sit after acquisition.</p></div>
      <div class="rv" style="--d:1"><h3>You may not need another platform.</h3><p>The constraint may sit in the process around it.</p></div>
      <div class="rv" style="--d:2"><h3>You may not need more automation.</h3><p>The workflow itself may need reconsidering first.</p></div>
    </div>
    <div class="matters rv"><span class="sq" aria-hidden="true"></span><div><p>We size the intervention to the problem.</p><p class="serif">We look for the one that matters.</p></div></div>
  </div>
</section>

<!-- 09 PROOF -->
<section class="sec proof bg-paper" aria-labelledby="pf-h">
  <div class="wrap">
    <h2 id="pf-h"><span class="a rv">An intervention only matters</span><span class="b rv" style="--d:1">if something consequential moves.</span></h2>
    <div class="chart io">
      <ul aria-label="Outcomes that count">${['Revenue.', 'Conversion.', 'Customer value.', 'Efficiency.', 'Adoption.', 'Decision quality.', 'Business performance.'].map(t => `<li>${t}</li>`).join('')}</ul>
      <svg viewBox="0 0 1042 300" fill="none" role="img" aria-label="Illustrative outcome line: flat through the brief, rising sharply after the intervention">
        <g stroke="#14161A" stroke-opacity=".08">${[0, 50, 100, 150, 200, 250].map(y => `<path d="M0 ${y}H1042"/>`).join('')}</g>
        <path d="M260.5 0V300M781.5 0V300" stroke="#14161A" stroke-opacity=".15"/>
        <path d="M521 0V300" stroke="#14161A" stroke-opacity=".6" stroke-dasharray="6 6"/>
        <path class="draw0" d="M0 230C130.25 236 260.5 222 390.75 232C521 242 521 228 521 228" stroke="#14161A" stroke-opacity=".55" stroke-width="2.5"/>
        <path class="draw" d="M521 228C677.3 224 755.45 120 885.7 70C1015.95 20 1032 40 1032 40" stroke="#14161A" stroke-width="10" stroke-linecap="round"/>
        <path class="draw" d="M521 228C677.3 224 755.45 120 885.7 70C1015.95 20 1032 40 1032 40" stroke="#F4A024" stroke-width="6" stroke-linecap="round"/>
        <circle class="endpt" cx="1032" cy="40" r="10" fill="#F4A024" stroke="#14161A" stroke-width="2"/>
        <path d="M0 299.5H1042" stroke="#14161A"/>
      </svg>
    </div>
    <div class="stages-x">
      <div class="rv"><span class="lbl r">THE BRIEF</span><p>What the organisation initially believed it needed.</p><span class="ar" aria-hidden="true">↓</span></div>
      <div class="rv" style="--d:1"><span class="lbl">WHAT WE FOUND</span><p>What the evidence revealed beneath the visible problem.</p><span class="ar" aria-hidden="true">↓</span></div>
      <div class="rv" style="--d:2"><span class="lbl">WHAT CHANGED</span><p>The intervention across strategy, technology, experience, communication, process or behaviour.</p><span class="ar" aria-hidden="true">↓</span></div>
      <div class="rv" style="--d:3"><span class="lbl a">WHAT MOVED</span><p>The commercial, operational or behavioural outcome.</p></div>
    </div>
    <a class="link rv" href="/case-studies/">Explore selected work ${arr}</a>
  </div>
</section>

<!-- 09b OUTCOME GRID -->
<section class="outcomes" aria-labelledby="oc-h">
  <div class="wrap">
    <p class="mono c-grey2 rv">What we measure</p>
    <h2 id="oc-h" class="rv" style="--d:1">Outcomes over outputs.<br><span class="c-grey2">Measured where behaviour shows up.</span></h2>
    <div class="ogrid" data-mcollapse="3">
      ${outcomes.map(([n, t, p], i) => `<div class="ocell rv" style="--d:${i % 3}"><div><p class="num-w">${t}</p></div><div><h3>${p.split('. ')[1].replace('.', '')}</h3><p>${p.split('. ')[0]}</p></div></div>`).join('')}
    </div>
    <p class="fine2">One behaviour, one baseline, agreed before any work starts. <a href="/case-studies/checkout-trust-gap-closed/">See how it works in a full case ${arr}</a></p>
  </div>
</section>

<!-- 11 THINKING -->
<section class="sec bg-paper" aria-labelledby="th-h">
  <div class="wrap think-grid">
    <div>
      <div class="cover rv-img"><img src="${img('26:223')}" alt="A team reviewing a wall of research notes" loading="lazy"></div>
      <h2 id="th-h" class="rv">Behaviour in a digital economy.</h2>
      <p class="d rv" style="--d:1">Ideas, research and perspectives from the intersection of business, behaviour and technology.</p>
    </div>
    <div>
      <nav class="topics" aria-label="Thinking topics">${topics.map((t, i) => `<a class="rv${i === 2 ? ' on' : ''}" style="--d:${i}" href="/thinking/?topic=${encodeURIComponent(t)}"><span>${esc(t)}</span><i></i></a>`).join('')}</nav>
      <a class="link rv" style="display:inline-block;margin-top:32px" href="/thinking/">Explore thinking ${arr}</a>
    </div>
  </div>
</section>

<!-- 11b COLOUR-BLOCK FILM -->
<section class="cb-film" aria-labelledby="cbf-h">
  <div class="wrap">
    <div class="cbf-head">
      <div><p class="mono-s c-amber rv">Brand film</p><h2 id="cbf-h" class="rv" style="--d:1">Where people pause.</h2></div>
      <p class="cbf-meta rv" style="--d:2"><span>27s</span><span>1080p</span><span>Play with sound on</span></p>
    </div>
    <div class="cbf-stage rv" style="--d:2" data-cbf>
      <video preload="metadata" playsinline poster="/assets/video/colour-block-thumb.webp" src="/assets/video/cognexa-colour-block.mp4" aria-label="Brand film: Where people pause"></video>
      <button class="cbf-facade" type="button" aria-label="Play the brand film, Where people pause, 27 seconds, with sound">
        <span class="cbf-shade"></span>
        <span class="cbf-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
        <span class="cbf-lbl"><b>Brand film:</b> nine moments of doubt, and how we help people move past them. Play with sound on.</span>
        <span class="cbf-dur">0:27</span>
      </button>
    </div>
  </div>
</section>

<!-- 12 FINAL CTA -->
<section class="fcta io" aria-labelledby="fc-h">
  <img class="par" data-par="0.06" src="${img('26:253')}" alt="" loading="lazy">
  <div class="wrap in">
    <div class="dissolve" aria-hidden="true"><span>“We need more leads.”</span><span>“We need AI.”</span><span>“We need automation.”</span><span>“We need a new website.”</span></div>
    <h2 id="fc-h" class="rv" data-words>What are you really trying to <span class="c-bluel">change?</span></h2>
    <p class="s1 rv">Bring us the business problem as you currently see it.</p>
    <p class="s2 rv" style="--d:1">We’ll start with the questions the brief may have missed.</p>
    <a class="btn rv" style="--d:2" href="/contact/">${CTA} ${arr}</a>
  </div>
</section>
`;
  return page({ title: 'Cognexa', desc: 'Cognexa combines behavioural science, AI and digital transformation to understand what is really driving a business outcome, before deciding what to change.', path: '/', body, fitFooter: true });
}
