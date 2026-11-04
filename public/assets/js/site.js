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
    if (!reduce) {
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
        .catch(() => { btn && (btn.disabled = false); alert('Sorry, something went wrong. Please try again or email us.'); });
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
