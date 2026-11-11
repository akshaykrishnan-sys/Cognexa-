(() => {
  const d = document, w = window;
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.add('js');
  let hdr, bar, parEls = [], meters = [], lastY = w.scrollY, ticking = false, booted = false;

  function onScroll() {
    const y = w.scrollY;
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 8);
      const menuOpen = d.body.classList.contains('menu-open');
      if (!menuOpen) hdr.classList.toggle('is-hidden', y > lastY && y > 320);
    }
    lastY = y;
    if (bar) {
      const max = d.documentElement.scrollHeight - w.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    if (!reduce && w.innerWidth > 760) {
      const vh = w.innerHeight;
      for (const el of parEls) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const sp = parseFloat(el.dataset.par) || 0.08;
        const c = (r.top + r.height / 2 - vh / 2);
        el.style.transform = `translate3d(0,${(-c * sp).toFixed(1)}px,0)`;
      }
    }
    for (const m of meters) {
      const t = d.querySelector(m.dataset.meter);
      if (!t) continue;
      const r = t.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (w.innerHeight * 0.6 - r.top) / r.height));
      m.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  }
  function boot() {
    if (booted) return; booted = true;
    w.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    w.addEventListener('resize', onScroll);
    d.addEventListener('keydown', e => { if (e.key === 'Escape') d.body.classList.remove('menu-open'); });
  }

  function init() {
  boot();
  d.body.classList.remove('menu-open');
  hdr = d.querySelector('.hdr'); bar = d.querySelector('.progress');
  parEls = [...d.querySelectorAll('[data-par]')]; meters = [...d.querySelectorAll('[data-meter]')];
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = d.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = d.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      hdr && hdr.classList.remove('is-hidden');
      d.querySelectorAll('.mmenu a').forEach((a, i) => a.style.transitionDelay = open ? `${0.15 + i * 0.05}s` : '0s');
    });
    d.querySelectorAll('.mmenu a').forEach(a => a.addEventListener('click', () => d.body.classList.remove('menu-open')));
  }

  /* ---------- unit chart dots (1000 visitors, 28 converted) ---------- */
  d.querySelectorAll('.unit-dots').forEach(box => {
    const n = +box.dataset.n || 1000, hits = +box.dataset.hits || 28;
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const hitSet = new Set(); while (hitSet.size < hits) hitSet.add(Math.floor(rnd() * n));
    const frag = d.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const el = d.createElement('i');
      if (hitSet.has(i)) el.className = 'hit';
      el.style.transitionDelay = `${(i % 50) * 12 + Math.floor(i / 50) * 14}ms`;
      frag.appendChild(el);
    }
    box.appendChild(frag);
  });

  /* ---------- count up ---------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduce) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    const dur = 1600, t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (to * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.hasAttribute('data-count')) countUp(el);
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  d.querySelectorAll('.io,.rv,.rv-l,.rv-img,.mask,[data-count]').forEach(el => io.observe(el));

  /* ---------- focus line in question pairs ---------- */
  const pairs = [...d.querySelectorAll('.pair')];
  if (pairs.length) {
    const pio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-focus', e.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' });
    pairs.forEach(p => pio.observe(p));
  }

  /* ---------- brief chooser ---------- */
  d.querySelectorAll('[data-chooser]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const views = [...root.querySelectorAll('.cview')];
    const select = i => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; });
      views.forEach((v, j) => { v.classList.toggle('is-active', i === j); v.setAttribute('aria-hidden', i !== j); });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          tabs[n].focus(); select(n);
        }
      });
    });
    root.querySelectorAll('.copt').forEach(o => o.addEventListener('click', () => {
      const on = o.getAttribute('aria-pressed') !== 'true';
      o.setAttribute('aria-pressed', on);
    }));
  });

  /* ---------- single-select toggle groups ---------- */
  d.querySelectorAll('[data-group]').forEach(g => {
    const btns = [...g.querySelectorAll('button')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b));
      const target = g.dataset.target && d.querySelector(g.dataset.target);
      if (target) target.value = b.dataset.value || b.textContent.trim();
      if (g.dataset.tz) {
        const tz = d.querySelector(g.dataset.tz);
        if (tz) tz.textContent = b.dataset.tz;
      }
      g.dispatchEvent(new CustomEvent('pick', { detail: b.dataset.value || b.textContent.trim() }));
    }));
  });

  /* ---------- filters (services hub cases, thinking articles) ---------- */
  d.querySelectorAll('[data-filter]').forEach(g => {
    const items = [...d.querySelectorAll(g.dataset.filter)];
    const mode = g.dataset.mode || 'dim';
    g.addEventListener('pick', e => {
      const v = e.detail;
      items.forEach(it => {
        const tags = (it.dataset.tags || '').split('|');
        const show = v === 'All' || tags.includes(v);
        it.classList.toggle(mode === 'hide' ? 'is-hide' : 'is-dim', !show);
      });
    });
  });

  /* ---------- FAQ smooth open ---------- */
  d.querySelectorAll('.faq details').forEach(det => {
    const sum = det.querySelector('summary'), ans = det.querySelector('.ans');
    if (!ans || reduce) return;
    sum.addEventListener('click', e => {
      e.preventDefault();
      if (det.open) {
        ans.style.height = ans.scrollHeight + 'px';
        requestAnimationFrame(() => { ans.style.height = '0px'; });
        ans.addEventListener('transitionend', () => { det.open = false; ans.style.height = ''; }, { once: true });
      } else {
        det.open = true;
        const h = ans.scrollHeight; ans.style.height = '0px';
        requestAnimationFrame(() => { ans.style.height = h + 'px'; });
        ans.addEventListener('transitionend', () => { ans.style.height = ''; }, { once: true });
      }
    });
  });

  /* ---------- article TOC ---------- */
  const tocLinks = [...d.querySelectorAll('.toc a')];
  if (tocLinks.length) {
    const map = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const tio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { tocLinks.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
    }), { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, id) => { const s = d.getElementById(id); s && tio.observe(s); });
  }

  /* ---------- booking form (Netlify Forms via fetch) ---------- */
  d.querySelectorAll('form[data-netlify]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const ok = f.parentElement.querySelector('.form-ok');
      const btn = f.querySelector('[type="submit"]');
      btn && (btn.disabled = true);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(r => { if (!r.ok) throw 0; f.style.display = 'none'; ok && ok.classList.add('on'); })
        .catch(() => { btn && (btn.disabled = false); let m = f.querySelector('.form-err'); if (!m) { m = d.createElement('p'); m.className = 'form-err'; m.setAttribute('role', 'alert'); f.appendChild(m); } m.textContent = 'That did not send. Check your connection and try again, or call us on the number below.'; });
    });
  });

  /* ---------- year ---------- */
  d.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  }
  w.CX = { init };
  if (!w.CX_MANUAL) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init(); }
})();

/* nav dropdowns + mobile accordion (bound per page load) */
(() => {
  const w = window, d = document;
  function bindNav() {
    const hdr = d.querySelector('.hdr'); if (!hdr || hdr.dataset.ddBound) return; hdr.dataset.ddBound = 1;
    const wraps = [...hdr.querySelectorAll('[data-dd]')];
    let t;
    const close = () => { wraps.forEach(x => { x.classList.remove('open'); x.querySelector('.ddt').setAttribute('aria-expanded', 'false'); }); hdr.classList.remove('dd-open'); };
    const open = (x) => { clearTimeout(t); wraps.forEach(y => { if (y !== x) { y.classList.remove('open'); y.querySelector('.ddt').setAttribute('aria-expanded', 'false'); } }); x.classList.add('open'); x.querySelector('.ddt').setAttribute('aria-expanded', 'true'); hdr.classList.add('dd-open'); };
    wraps.forEach(x => {
      x.addEventListener('mouseenter', () => open(x));
      x.addEventListener('mouseleave', () => { t = setTimeout(close, 180); });
      x.addEventListener('focusin', () => open(x));
      x.addEventListener('focusout', e => { if (!x.contains(e.relatedTarget)) t = setTimeout(close, 120); });
      x.querySelectorAll('.ddp a').forEach(a => a.addEventListener('click', close));
    });
    d.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    hdr.querySelector('.dd-dim')?.addEventListener('click', close);
    d.querySelectorAll('.mmenu [data-acc]').forEach(row => {
      const b = row.querySelector('.mrow-h');
      b.addEventListener('click', () => { const o = row.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
    });
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bindNav(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bindNav); else bindNav();
})();

/* ---------- symptom builder, clickable table rows, hesitation check ---------- */
(function () {
  const w = window, d = document;
  function bind() {
    d.querySelectorAll('form[data-symptoms]:not([data-b])').forEach(f => {
      f.dataset.b = 1;
      const btn = f.querySelector('button[type=submit]'), cnt = f.querySelector('.sym-count');
      const upd = () => { const n = f.querySelectorAll('input:checked').length; btn.disabled = !n; cnt.textContent = n ? `${n} symptom${n > 1 ? 's' : ''} ticked. We add ${n > 1 ? 'them' : 'it'} to your brief.` : 'Tick at least one symptom.'; f.querySelectorAll('.map-r').forEach(r => r.classList.toggle('on', r.querySelector('input').checked)); };
      f.addEventListener('change', upd);
      f.querySelectorAll('.schip').forEach(a => a.addEventListener('click', e => e.stopPropagation()));
      upd();
    });
    d.querySelectorAll('tr[data-href]:not([data-b])').forEach(tr => { tr.dataset.b = 1; tr.addEventListener('click', e => { if (!e.target.closest('a')) location.href = tr.dataset.href; }); });
    const f = d.querySelector('form[data-check]:not([data-b])');
    if (!f || !w.CX_CHECK) return;
    f.dataset.b = 1;
    const C = w.CX_CHECK, qs = [...f.querySelectorAll('.chk-q')], res = f.querySelector('.chk-res'), bar = f.querySelector('.chk-bar i');
    let cur = 0;
    const show = i => { cur = i; qs.forEach((q, j) => q.classList.toggle('on', j === i)); res.hidden = i < qs.length; bar.style.width = `${(Math.min(i, qs.length) / qs.length) * 100}%`; const q = qs[i]; if (q) (q.querySelector('input:checked') || q.querySelector('input')).focus({ preventScroll: true }); };
    f.addEventListener('change', e => { if (e.target.type === 'radio') setTimeout(() => cur < qs.length - 1 ? show(cur + 1) : finish(), 220); });
    f.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => show(cur - 1)));
    f.querySelector('[data-restart]').addEventListener('click', () => { f.reset(); show(0); });
    function finish() {
      const sc = { trust: 0, choice: 0, effort: 0, loss: 0, habit: 0 }, ans = [];
      let ind = '', pace = 'audit';
      qs.forEach(q => { const i = q.querySelector('input:checked'); if (!i) return; const o = JSON.parse(i.dataset.sc || '{}'); for (const k in o) sc[k] += o[k]; if (i.dataset.ind !== undefined) ind = i.dataset.ind; if (i.dataset.pace) pace = i.dataset.pace; ans.push(q.querySelector('legend').lastChild.textContent + ' ' + i.nextElementSibling.textContent); });
      const top = Object.keys(sc).sort((a, b) => sc[b] - sc[a])[0], L = C.L[top];
      const $ = k => res.querySelector(`[data-r=${k}]`);
      $('t').textContent = `Most likely: ${L[0].toLowerCase()}.`;
      $('p').textContent = L[1];
      $('moves').innerHTML = L[2].map(m => `<li>${m}</li>`).join('');
      $('pace').textContent = C.P[pace];
      $('links').innerHTML = (ind ? `<a href="/industries/${ind}/">The ${C.I[ind]} playbook →</a>` : '') + `<a href="/services/${L[3][0]}/">${L[3][1]} →</a><a href="/services/${L[4][0]}/">${L[4][1]} →</a>`;
      const brief = `Hesitation check result: ${L[0]}.\n` + ans.map(a => '- ' + a).join('\n');
      $('cta').href = '/contact/?brief=' + encodeURIComponent(brief);
      try { fetch('/api/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lever: top, industry: ind, pace }), keepalive: true }).catch(() => {}); } catch (e) { /* analytics only */ }
      show(qs.length);
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ---------- remember where a visitor came from, for the lead record ---------- */
(function () {
  try {
    const k = 'cx-src';
    if (!sessionStorage.getItem(k)) sessionStorage.setItem(k, JSON.stringify({ landing: location.pathname + location.search, ref: document.referrer || '' }));
    const fill = () => document.querySelectorAll('input[name=referrer]').forEach(i => { const v = JSON.parse(sessionStorage.getItem(k) || '{}'); i.value = `landing: ${v.landing || ''} · referrer: ${v.ref || 'direct'} · form page: ${location.pathname}`; });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
    const orig = window.CX && window.CX.init; if (window.CX) window.CX.init = function () { orig && orig(); fill(); };
  } catch (e) { /* storage blocked: the lead is still sent */ }
})();

/* ---------- premium layer: header state, video facades, mobile collapse, sticky CTA ---------- */
(function () {
  const w = window, d = document;
  function bind() {
    const hdr = d.querySelector('.hdr');
    const onS = () => { hdr && hdr.classList.toggle('scrolled', w.scrollY > 8); const m = d.querySelector('.mcta'); if (m) { const f = d.querySelector('.ftr'); const nearEnd = f && f.getBoundingClientRect().top < w.innerHeight; m.classList.toggle('on', w.scrollY > 480 && !nearEnd && !d.body.classList.contains('menu-open')); } };
    w.addEventListener('scroll', onS, { passive: true }); onS();
    d.querySelectorAll('.vfacade:not([data-b])').forEach(b => { b.dataset.b = 1; b.addEventListener('click', () => { const f = d.createElement('iframe'); f.src = b.dataset.embed; f.title = b.getAttribute('aria-label') || 'Video'; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.loading = 'lazy'; b.replaceWith(f); }); });
    d.querySelectorAll('[data-mcollapse]:not([data-b])').forEach(c => {
      c.dataset.b = 1;
      const n = +c.dataset.mcollapse || 3, sel = c.dataset.mcSel;
      const items = sel ? [...c.querySelectorAll(sel)] : [...c.children];
      if (items.length <= n) return;
      items.forEach((it, i) => { if (i >= n) { it.classList.add('mc-hide'); let s = it.previousElementSibling; if (s && s.matches('.flow,.sep')) s.classList.add('mc-hide'); } });
      const b = d.createElement('button'); b.type = 'button'; b.className = 'mc-more';
      const lbl = () => (c.classList.contains('open') ? 'Show less' : `Show all ${items.length}`);
      b.textContent = lbl(); b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', () => { c.classList.toggle('open'); b.textContent = lbl(); b.setAttribute('aria-expanded', c.classList.contains('open')); });
      c.after(b);
    });
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ---------- homepage hero sequence + film dialog ---------- */
(function () {
  const w = window, d = document;
  function bind() {
    const hs = d.querySelector('[data-hero-slides]:not([data-b])');
    if (hs) {
      hs.dataset.b = 1;
      const slides = [...hs.querySelectorAll('.hs-s')], dots = [...hs.querySelectorAll('.hs-dots button')];
      const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const DUR = (i) => (i === 0 ? 7000 : 5200);
      let i = 0, timer = 0, paused = reduce, visible = true, left = DUR(0), started = Date.now();
      const show = (n) => {
        i = (n + dots.length) % dots.length;
        slides.forEach((s, k) => { const on = k === i - 1; s.classList.toggle('on', on); s.setAttribute('aria-hidden', String(!on)); s.tabIndex = on ? 0 : -1; });
        dots.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.classList.toggle('done', k < i); const f = b.querySelector('i'); f.style.setProperty('--dur', DUR(k) + 'ms'); if (k === i) { f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; } });
        left = DUR(i); schedule();
      };
      const schedule = () => { clearTimeout(timer); if (paused || !visible) return; started = Date.now(); timer = setTimeout(() => show(i + 1), left); };
      const pause = (p) => { if (p) { clearTimeout(timer); left = Math.max(400, left - (Date.now() - started)); } paused = p; hs.classList.toggle('paused', p); hs.querySelector('.hs-pause').setAttribute('aria-pressed', String(p)); hs.querySelector('.hs-pause').setAttribute('aria-label', p ? 'Play the slideshow' : 'Pause the slideshow'); if (!p) schedule(); };
      dots.forEach((b, k) => b.addEventListener('click', () => show(k)));
      hs.querySelector('.hs-pause').addEventListener('click', () => pause(!paused));
      new IntersectionObserver(([e]) => { const v = e.isIntersecting; if (v === visible) return; if (!v) { clearTimeout(timer); left = Math.max(400, left - (Date.now() - started)); } visible = v; if (v) schedule(); }).observe(hs);
      d.addEventListener('visibilitychange', () => { if (d.hidden) pause(true); });
      if (reduce) hs.classList.add('paused');
      show(0);
    }
    d.querySelectorAll('[data-film]:not([data-b])').forEach(btn => {
      btn.dataset.b = 1;
      const dlg = d.querySelector('.film-dlg'); if (!dlg) return;
      const v = dlg.querySelector('video');
      btn.addEventListener('click', () => { const hs = d.querySelector('[data-hero-slides]'); hs && hs.querySelector('.hs-pause') && !hs.classList.contains('paused') && hs.querySelector('.hs-pause').click(); dlg.showModal(); v.currentTime = 0; v.play().catch(() => {}); });
      const close = () => { v.pause(); dlg.close(); };
      dlg.querySelector('.film-x').addEventListener('click', close);
      dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
      dlg.addEventListener('close', () => v.pause());
    });
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ---------- brand film facade (end of homepage) ---------- */
(function () {
  const w = window, d = document;
  function bind() {
    d.querySelectorAll('[data-cbf]:not([data-b])').forEach(st => {
      st.dataset.b = 1;
      const v = st.querySelector('video'), btn = st.querySelector('.cbf-facade');
      btn.addEventListener('click', () => { st.classList.add('playing'); v.controls = true; v.muted = false; v.play().catch(() => { v.controls = true; }); });
      v.addEventListener('ended', () => { st.classList.remove('playing'); v.controls = false; v.load(); });
    });
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ---------- precise markers: reveal when in view ---------- */
(function () {
  const d = document, w = window;
  function bind() {
    const ms = d.querySelectorAll('.mk:not([data-b])'); if (!ms.length) return;
    const io = 'IntersectionObserver' in w ? new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0, rootMargin: '0px 0px -15% 0px' }) : null;
    ms.forEach(m => { m.dataset.b = 1; io ? io.observe(m) : m.classList.add('on'); });
  }
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ================= scroll motion engine (one rAF loop, scrubbed by scroll position) ================= */
(function () {
  const w = window, d = document;
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let items = [];
  function prog(el, start, end) { const r = el.getBoundingClientRect(), h = innerHeight; return clamp((h * start - r.top) / (h * (start - end) + r.height * 0)); }
  function splitWords(el) {
    if (el.dataset.split) return; el.dataset.split = 1;
    const walk = (n) => { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const f = d.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.append(t); else { const s = d.createElement('span'); s.className = 'w'; s.textContent = t; f.append(s); } }); c.replaceWith(f); } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); }); };
    walk(el);
  }
  function bind() {
    items = [];
    if (reduce.matches) return;
    const desk = innerWidth > 760;
    d.querySelectorAll('[data-words]').forEach(el => { splitWords(el); const ws = [...el.querySelectorAll('.w')]; items.push(() => { const p = clamp((innerHeight * .92 - el.getBoundingClientRect().top) / (innerHeight * .5)); ws.forEach((s, i) => s.style.setProperty('--o', (.16 + .84 * clamp(p * ws.length - i)).toFixed(3))); }); });
    const tp = d.querySelector('[data-ribbon]');
    if (tp) items.push(() => { const r = tp.closest('.ribbon').getBoundingClientRect(); const p = (innerHeight - r.top) / (innerHeight + r.height); tp.setAttribute('startOffset', (8 - 70 * p).toFixed(2) + '%'); });
    d.querySelectorAll('.itile, .ocell').forEach((el, i) => { el.classList.add('settle'); const dir = i % 2 ? 1 : -1, rot = dir * (7 + (i % 3) * 3), off = 160 + (i % 3) * 70, sx = dir * (30 + (i % 4) * 20); items.push(() => { const p = ease(clamp((innerHeight * 1.02 - el.getBoundingClientRect().top) / (innerHeight * .55))); el.style.setProperty('--sy', ((1 - p) * off).toFixed(1) + 'px'); el.style.setProperty('--sx', ((1 - p) * sx).toFixed(1) + 'px'); el.style.setProperty('--sr', ((1 - p) * rot).toFixed(2) + 'deg'); }); });
    const mk = d.querySelector('[data-mark]');
    if (mk) { const ls = [...mk.children]; items.push(() => { const p = clamp((innerHeight - mk.getBoundingClientRect().top) / (mk.offsetHeight * 1.6)); ls.forEach((s, i) => s.style.setProperty('--my', ((1 - ease(clamp(p * 1.6 - i * .09))) * 100).toFixed(1) + '%')); }); }
    tick();
  }
  let raf = 0; function tick() { raf = 0; items.forEach(f => f()); }
  const req = () => { if (!raf) raf = requestAnimationFrame(tick); };
  w.addEventListener('scroll', req, { passive: true }); w.addEventListener('resize', () => { bind(); });
  const orig = w.CX && w.CX.init;
  if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ================= bolder scroll scenes: smooth scroll, hero shrink, pinned expand ================= */
(function () {
  const w = window, d = document;
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  if (reduce) return;
  let lenis = null;
  if (w.Lenis && w.matchMedia('(pointer: fine)').matches && !w.CX_MANUAL) {
    lenis = new w.Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
    const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    d.documentElement.classList.add('smooth');
  }
  let fns = [];
  function bind() {
    fns = [];
    const desk = innerWidth > 1024;
    const hx = d.querySelector('.hx-bg');
    if (hx) fns.push(() => { const p = clamp(scrollY / innerHeight); hx.style.setProperty('--hz', (1.06 + .1 * p).toFixed(4)); hx.style.setProperty('--hy', (p * 90).toFixed(1) + 'px'); });
    const hp = d.querySelector('.h-hero-photo');
    if (hp && desk) fns.push(() => { const p = ease(clamp(scrollY / (innerHeight * .8))); hp.style.setProperty('--hs', (1 - .08 * p).toFixed(4)); hp.style.setProperty('--hr', (p * 36).toFixed(1) + 'px'); hp.classList.add('shrink'); });
    const px = d.querySelector('.pin-x');
    if (px && desk) {
      px.classList.add('on'); const ww = px.querySelector('.wherewhy'), im = ww.querySelector('img'), st = ww.querySelector('.stmt'), mk = ww.querySelectorAll('.mk, .mk-g');
      fns.push(() => {
        const r = px.getBoundingClientRect(); const p = clamp(-r.top / (r.height - innerHeight));
        const e = ease(clamp(p / .62));
        ww.style.clipPath = `inset(${(24 * (1 - e)).toFixed(2)}% ${(31 * (1 - e)).toFixed(2)}% round ${(32 * (1 - e)).toFixed(1)}px)`;
        im.style.transform = `scale(${(1.28 - .28 * e).toFixed(4)})`;
        const t = clamp((p - .5) / .25); st.style.opacity = t; st.style.transform = `translateY(${(40 * (1 - t)).toFixed(1)}px)`;
        mk.forEach(m => { m.style.opacity = clamp((p - .62) / .15); });
      });
    }
    tick();
  }
  let raf = 0; const tick = () => { raf = 0; fns.forEach(f => f()); }; const req = () => { if (!raf) raf = requestAnimationFrame(tick); };
  if (lenis) lenis.on('scroll', req); w.addEventListener('scroll', req, { passive: true }); w.addEventListener('resize', bind);
  const orig = w.CX && w.CX.init; if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ================= hero v3 + second-fold interactions ================= */
(function () {
  const w = window, d = document;
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  function maskWords(el) {
    if (el.dataset.mk) return; el.dataset.mk = 1; let n = 0;
    const walk = (node) => [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) { const f = d.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) { f.append(t); return; } const s = d.createElement('span'); s.className = 'mw'; const i = d.createElement('i'); i.textContent = t; i.style.setProperty('--w', n++); s.append(i); f.append(s); }); c.replaceWith(f); }
      else if (c.nodeType === 1) walk(c);
    });
    walk(el);
  }
  function bind() {
    d.querySelectorAll('[data-mask]').forEach(maskWords);
    const hx = d.querySelector('[data-hx]:not([data-b])');
    if (hx && !reduce && w.matchMedia('(pointer: fine)').matches) {
      hx.dataset.b = 1; const bg = hx.querySelector('.hx-bg'), gr = hx.querySelector('.hx-grid'); let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
      const loop = () => { cx += (tx - cx) * .07; cy += (ty - cy) * .07; bg.style.setProperty('--px', (cx * -18).toFixed(2) + 'px'); bg.style.setProperty('--py', (cy * -12).toFixed(2) + 'px'); gr.style.setProperty('--gx', (cx * 6).toFixed(2) + 'px'); gr.style.setProperty('--gy', (cy * 4).toFixed(2) + 'px'); if (Math.abs(tx - cx) + Math.abs(ty - cy) > .001) requestAnimationFrame(loop); else run = false; };
      hx.addEventListener('mousemove', (e) => { const r = hx.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; if (!run) { run = true; requestAnimationFrame(loop); } });
      hx.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!run) { run = true; requestAnimationFrame(loop); } });
    }
    d.querySelectorAll('[data-spot]:not([data-sb])').forEach(el => { el.dataset.sb = 1; el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--sx', (e.clientX - r.left) + 'px'); el.style.setProperty('--sy', (e.clientY - r.top) + 'px'); }); });
    const ch = d.querySelector('.cx2 .chooser');
    if (ch && !reduce) {
      const f = () => { const r = ch.getBoundingClientRect(); const p = clamp((innerHeight - r.top) / (innerHeight * .7)); const e = 1 - Math.pow(1 - p, 3); ch.style.setProperty('--tx', ((1 - e) * 16).toFixed(2) + 'deg'); ch.style.setProperty('--ty', ((1 - e) * 90).toFixed(1) + 'px'); ch.style.setProperty('--ts', (.94 + .06 * e).toFixed(4)); };
      w.addEventListener('scroll', () => requestAnimationFrame(f), { passive: true }); f();
    }
  }
  const orig = w.CX && w.CX.init; if (w.CX) w.CX.init = function () { orig && orig(); bind(); };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind); else bind();
})();
