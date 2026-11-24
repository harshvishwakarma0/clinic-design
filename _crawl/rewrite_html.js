const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/_crawl';
const SITE = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const BASE = 'https://eyesurgeons.co.nz';

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'pagepaths.json'), 'utf8'));
const pagepaths = {};
for (const [k, v] of Object.entries(raw)) pagepaths['/' + k.replace(/^\/?/, '')] = v;
const knownPages = new Set(Object.keys(pagepaths));

function norm(p) { return '/' + p.replace(/^\/+/, '').replace(/\/+$/, '') + (p.replace(/^\/+/, '') ? '/' : ''); }

// clean previously generated pages (keep assets)
for (const e of fs.readdirSync(SITE)) {
  const p = path.join(SITE, e);
  if (e === 'index.html' || (fs.statSync(p).isDirectory() && !e.startsWith('wp-'))) fs.rmSync(p, { recursive: true, force: true });
}

function rewrite(html, pagePath) {
  const relDir = pagePath === '/' ? '' : pagePath.slice(1, -1);
  const dirs = relDir === '' ? 0 : relDir.split('/').length;
  const pre = '../'.repeat(dirs);
  const keepLive = /(wp-admin\/admin-ajax|wp-json|xmlrpc)/;

  let out = html.replace(/(https?:)?\/\/eyesurgeons\.co\.nz\/[^\s"'\\)<>\]}?#]*/g, (m) => {
    const bare = m.replace(/^(https?:)?\/\/eyesurgeons\.co\.nz\//, '');
    if (keepLive.test(bare)) return m;
    const decoded = bare.split('?')[0];
    if (/^(wp-content|wp-includes)\//.test(decoded)) return pre + decoded;
    if (knownPages.has(norm(decoded))) return pre + (norm(decoded) === '/' ? 'index.html' : norm(decoded).slice(1) + 'index.html');
    return m;
  });
  // append fragments preserved: handle '#frag' cases separately
  out = out.replace(/(https?:)?\/\/eyesurgeons\.co\.nz\/([a-zA-Z0-9_/-]*)#(?!organization|website|webpage|richSnippet)[^\s"']*/g, (m, _s, p) => {
    const n = norm(p);
    if (!knownPages.has(n) && n !== '/') return m;
    const frag = m.slice(m.indexOf('#'));
    return pre + (n === '/' ? 'index.html' : n.slice(1) + 'index.html') + frag;
  });
  out = out.replace(/(["'\s])\/(wp-content\/|wp-includes\/)([^"'\s]*)/g, (m, q1, wp, rest) => q1 + pre + wp + rest);
  return out;
}

let count = 0;
for (const [pagePath, srcFile] of Object.entries(pagepaths)) {
  const html = fs.readFileSync(path.join(ROOT, srcFile), 'utf8');
  const out = rewrite(html, pagePath);
  const rel = pagePath === '/' ? 'index.html' : pagePath.slice(1) + 'index.html';
  const dest = path.join(SITE, rel.replace(/\//g, path.sep));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
  count++;
}
console.log('rewrote', count, 'pages');
