const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/_crawl';
const HTML = path.join(ROOT, 'html');
const SITE = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const BASE = 'https://eyesurgeons.co.nz';

fs.mkdirSync(SITE, { recursive: true });

// 1. collect asset urls from all html files
const assetRe = /https?:\/\/eyesurgeons\.co\.nz\/(wp-content\/[^"'()\s?#]+|wp-includes\/[^"'()\s?#]+|wp-json\/[^"'()\s?#]+)/g;
const assets = new Set();
const cssRe = /url\((['"]?)([^'")]+)\1\)/g;

function fetchText(url) {
  try {
    return execFileSync('curl', ['-sL', '--max-time', '90', '--retry', '2', url], { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
  } catch (e) { return ''; }
}

function download(url, rel) {
  const dest = path.join(SITE, rel.split('?')[0]);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return true;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    execFileSync('curl', ['-sL', '--max-time', '180', '--retry', '2', url, '-o', dest], { maxBuffer: 10 * 1024 * 1024 });
    return fs.statSync(dest).size > 0;
  } catch (e) { console.log('FAIL', url); return false; }
}

let htmls = fs.readdirSync(HTML).filter(f => f.endsWith('.html'));
// map html filename -> page path
const pagePaths = JSON.parse(fs.readFileSync(path.join(ROOT, 'pagepaths.json'), 'utf8'));

for (const f of htmls) {
  const t = fs.readFileSync(path.join(HTML, f), 'utf8');
  let m;
  while ((m = assetRe.exec(t))) {
    const rel = m[1];
    if (/\.(css|js|png|jpg|jpeg|webp|svg|gif|ico|woff|woff2|ttf|otf|eot|mp4|webm|m3u8|pdf)(?:$|[.-])/.test(rel + '.') || rel.startsWith('wp-content/uploads') || rel.startsWith('wp-content/themes') || rel.startsWith('wp-content/plugins') || rel.startsWith('wp-includes')) {
      if (!/\.(xml|xsl|html)$/.test(rel)) assets.add(rel);
    }
  }
  // also protocol-relative //eyesurgeons.co.nz/
  const re2 = /\/\/eyesurgeons\.co\.nz\/(wp-[^"'()\s?#]+)/g;
  while ((m = re2.exec(t))) assets.add(m[1]);
}

// 2. download CSS files, scan for nested url() refs
const cssList = [...assets].filter(r => r.endsWith('.css'));
console.log('assets found:', assets.size, 'css:', cssList.length);
for (const rel of assets) {
  download(BASE + '/' + rel, rel);
}

for (const rel of cssList) {
  const p = path.join(SITE, rel);
  if (!fs.existsSync(p)) continue;
  const css = fs.readFileSync(p, 'utf8');
  let m;
  while ((m = cssRe.exec(css))) {
    let u = m[2];
    if (u.startsWith('data:') || u.startsWith('#')) continue;
    if (u.startsWith(BASE)) u = u.slice(BASE.length + 1);
    else if (u.startsWith('//eyesurgeons.co.nz/')) u = u.slice('//eyesurgeons.co.nz/'.length);
    else if (u.startsWith('/')) u = u.slice(1);
    else if (!u.startsWith('http')) {
      // relative to css dir
      u = path.posix.normalize(path.posix.join(path.posix.dirname(rel), u));
    } else continue;
    if (u.startsWith('wp-')) {
      if (!assets.has(u)) { assets.add(u); download(BASE + '/' + u, u); }
    }
  }
}

// 3. scan JS for asset refs (fonts etc) - skip heavy, just fonts/images referenced by theme js
console.log('total assets:', assets.size);
fs.writeFileSync(path.join(ROOT, 'assets.json'), JSON.stringify([...assets], null, 1));
