const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/_crawl';
const SITE = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const pagepaths = JSON.parse(fs.readFileSync(ROOT + '/pagepaths.json', 'utf8'));
const known = new Set(Object.keys(pagepaths));

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!p.includes('wp-content') && !p.includes('wp-includes')) walk(p); }
    else if (e.name.endsWith('.html')) fix(p);
  }
}
function depthFromSite(destPath) {
  return path.relative(SITE, destPath).split(path.sep).length - 1; // index.html at depth N dirs
}
function fix(file) {
  let t = fs.readFileSync(file, 'utf8');
  const pre = '../'.repeat(depthFromSite(file));
  t = t.replace(/https:\/\/eyesurgeons\.co\.nz\/([a-zA-Z0-9_/-]*)#(?!organization|website|webpage)[^\s"']*/g, (m, p, off, str) => {
    let n = '/' + (p.replace(/\/+$/, '') || '') + (p ? '/' : '');
    if (!known.has(n)) return m;
    const rel = n === '/' ? 'index.html' : n.slice(1) + 'index.html';
    const frag = m.slice(m.indexOf('#'));
    return pre + rel + frag;
  });
  fs.writeFileSync(file, t);
}
walk(SITE);
console.log('fragment links fixed');
