import re
"""Build a single-entry preview of the site for the Claude artifact viewer.
Each page's <body> is stored as p/<route-id>.html and loaded by hash (#p-<route-id>)."""
import os, re, shutil, json, sys
ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'public'); OUT = os.path.join(ROOT, 'preview')
shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(os.path.join(OUT, 'p'))
shutil.copytree(os.path.join(SRC, 'assets'), os.path.join(OUT, 'assets'))
shutil.copy(os.path.join(SRC, 'favicon.svg'), OUT)
# full responsive stylesheet (phones and tablets included)
shutil.copy(os.path.join(SRC, 'assets/css/site.css'), os.path.join(OUT, 'assets/css/site-desktop.css'))

def rid(path):
    path = path.strip('/')
    return 'home' if not path else path.replace('/', '-')

def fix_url(m):
    attr, url = m.group(1), m.group(2)
    if url.startswith('//'): return m.group(0)
    path, frag = (url.split('#', 1) + [''])[:2]
    path = path.split('?', 1)[0]
    if path.startswith('/assets/') or path.endswith('.svg') or path.endswith('.webp'):
        return f'{attr}="{path.lstrip("/")}"'
    if not path.endswith('/'): path += '/'
    return f'{attr}="#p-{rid(path)}' + (f'--{frag}' if frag else '') + '"'

routes = {}
for dp, _, fs in os.walk(SRC):
    for f in fs:
        if f != 'index.html' or '/admin' in dp: continue
        full = os.path.join(dp, f)
        url = '/' + os.path.relpath(dp, SRC).replace('.', '') + '/'
        url = re.sub('/+', '/', url)
        html = open(full).read()
        title = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
        body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
        body = re.sub(r'(href|src|poster|data-src|data-src-sm)="(/[^"]*)"', fix_url, body)
        r = rid(url); routes[r] = title
        open(os.path.join(OUT, 'p', r + '.txt'), 'w').write(title + '\n' + body)

home = open(os.path.join(SRC, 'index.html')).read()
head = re.search(r'<head>(.*?)</head>', home, re.S).group(1)
head = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', head, flags=re.S)
head = re.sub(r'(href|src)="/(assets/[^"]*|favicon\.svg)"', r'\1="\2"', head)
head = re.sub(r'<script defer src="assets/js/site\.js(\?v=\w+)?"></script>', '', head)
import hashlib, time
VER = hashlib.sha1((open(os.path.join(OUT, 'assets/css/site-desktop.css')).read() + open(os.path.join(SRC, 'assets/js/site.js')).read() + str(time.time())).encode()).hexdigest()[:8]
head = re.sub(r'assets/css/site\.css(\?v=\w+)?', 'assets/css/site-desktop.css?v=' + VER, head)
shell = f'''<!doctype html>
<html lang="en">
<head>{head}
<script>window.CX_MANUAL = true;</script>
<script src="assets/js/site.js?v={VER}"></script>
</head>
<body>
<style>html{{overflow-x:hidden}}</style>
<div id="app"></div>
<script>
(function () {{
  var ROUTES = {json.dumps(routes)};
  var app = document.getElementById('app'), current = null, cache = {{}};
  function parse() {{
    var h = location.hash.replace(/^#/, '');
    if (h.indexOf('p-') !== 0) return null;
    var parts = h.slice(2).split('--');
    return {{ id: ROUTES[parts[0]] ? parts[0] : 'home', anchor: parts[1] || '' }};
  }}
  function scrollToAnchor(a) {{
    var el = a && document.getElementById(a);
    if (el) el.scrollIntoView({{ behavior: 'smooth', block: 'start' }}); else window.scrollTo(0, 0);
  }}
  function show(id, anchor) {{
    if (id === current) {{ scrollToAnchor(anchor); return; }}
    var get = cache[id] ? Promise.resolve(cache[id]) : fetch('p/' + id + '.txt?v={VER}').then(function (r) {{ return r.text(); }});
    get.then(function (txt) {{
      cache[id] = txt;
      var nl = txt.indexOf('\\n');
      document.title = txt.slice(0, nl).replace(/&amp;/g, '&');
      app.innerHTML = txt.slice(nl + 1);
      app.querySelectorAll('script').forEach(function (old) {{
        var s = document.createElement('script'); s.textContent = old.textContent; old.replaceWith(s);
      }});
      current = id;
      window.scrollTo(0, 0);
      window.CX.init();
      if (anchor) setTimeout(function () {{ scrollToAnchor(anchor); }}, 60);
    }});
  }}
  function go(id, anchor) {{
    show(id, anchor);
    try {{ history.replaceState(null, '', '#p-' + id + (anchor ? '--' + anchor : '')); }} catch (e) {{}}
  }}
  function route() {{ var r = parse() || {{ id: 'home', anchor: '' }}; show(r.id, r.anchor); }}
  document.addEventListener('click', function (e) {{
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    e.preventDefault();
    if (h.indexOf('#p-') === 0) {{
      var parts = h.slice(3).split('--');
      go(ROUTES[parts[0]] ? parts[0] : 'home', parts[1] || '');
      return;
    }}
    scrollToAnchor(h.slice(1));
  }});
  document.addEventListener('submit', function (e) {{
    var f = e.target; if (!f.matches('form[data-netlify]')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    f.style.display = 'none'; var ok = f.parentElement.querySelector('.form-ok'); if (ok) ok.classList.add('on');
  }}, true);
  window.addEventListener('hashchange', route);
  route();
}})();
</script>
</body>
</html>
'''
open(os.path.join(OUT, 'index.html'), 'w').write(shell)
print(len(routes), 'routes')
