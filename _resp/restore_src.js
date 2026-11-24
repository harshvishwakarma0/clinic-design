const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)';
const SITE = path.join(ROOT, 'site');
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_crawl/pagepaths.json'), 'utf8'));
const pages = {};
for (const [k, v] of Object.entries(map)) pages['/' + k.replace(/^\/?/, '')] = path.join(ROOT, '_crawl', v);

let fixed = 0, missed = [];
for (const [pp, srcFile] of Object.entries(pages)) {
  const out = path.join(SITE, pp === '/' ? 'index.html' : pp.slice(1) + 'index.html');
  if (!fs.existsSync(out)) { missed.push('no page ' + pp); continue; }
  const orig = fs.readFileSync(srcFile, 'utf8');
  const cur = fs.readFileSync(out, 'utf8');
  const depth = (pp.match(/\//g) || []).length - 1;
  const pre = '../'.repeat(depth);
  const loc = (s) => s.replace(/^https?:\/\/eyesurgeons\.co\.nz\//, pre);
  const pairs = {};
  for (const m of orig.matchAll(/<script[^>]*id="([^"]+)"[^>]*src="([^"]+)"/g)) pairs[m[1]] = loc(m[2]);
  for (const m of orig.matchAll(/<script[^>]*src="([^"]+)"[^>]*id="([^"]+)"/g)) pairs[m[2]] = loc(m[1]);
  let n = cur;
  for (const [id, src] of Object.entries(pairs)) {
    const re = new RegExp('(<script id="' + id.replace(/[.$]/g, '\\$&') + '" src=")"');
    if (re.test(n)) n = n.replace(re, '$1' + src + '"');
  }
  const stillEmpty = [...n.matchAll(/<script[^>]*src=""/g)].length;
  if (n !== cur) { fs.writeFileSync(out, n); fixed++; }
  if (stillEmpty) missed.push(pp + ' still-empty=' + stillEmpty);
}
console.log('pages fixed:', fixed);
console.log(missed.slice(0, 20).join('\n') || 'no misses');
