const fs = require('fs'), path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const bad = [];
let refs = 0;
const IMG = /\.(jpe?g|png|webp|gif|svg|ico|bmp|avif|mp4|webm|woff2?|ttf|otf|eot|css|js)\b/i;
function check(pageFile, u) {
  if (/^(https?:|data:|mailto:|tel:|\/\/)/.test(u)) return;
  refs++;
  const clean = decodeURIComponent(u.split('?')[0].split('#')[0]);
  if (!clean) return;
  const base = path.dirname(pageFile);
  const cands = clean.startsWith('/') ? [path.join(ROOT, clean)]
    : /^[a-zA-Z]:/.test(clean) ? [clean]
    : [path.resolve(base, clean), path.resolve(ROOT, clean), path.resolve(base, clean.replace(/^(\.\.\/)+/, ''))];
  if (!cands.some((c) => { try { return fs.statSync(c).isFile(); } catch { return false; } })) bad.push(path.relative(ROOT, pageFile) + '  ->  ' + u);
}
const files = [];
(function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== '_shots') w(p); } else if (/\.(html|css)$/.test(e.name)) files.push(p); } })(ROOT);
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/(?:src|href|data-src|poster)\s*=\s*["']([^"']+)["']/g)) if (IMG.test(m[1])) check(f, m[1]);
  for (const m of t.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) if (IMG.test(m[1])) check(f, m[1]);
  for (const m of t.matchAll(/srcset\s*=\s*["']([^"']+)["']/g)) m[1].split(',').forEach((part) => { const u = part.trim().split(/\s+/)[0]; if (u && IMG.test(u)) check(f, u); });
}
console.log('local refs checked:', refs, '| broken:', bad.length);
console.log(bad.slice(0, 40).join('\n'));
