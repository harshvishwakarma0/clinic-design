const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';

// 1. downscale oversized responsive webp backgrounds
const downscale = [
  ['wp-content/themes/eye-surgeons/assets/client/images/cta-section-bg-mobile.webp', 750, 72],
];
for (const [rel, w, q] of downscale) {
  const p = path.join(ROOT, rel);
  const tmp = p + '.tmp.webp';
  execSync(`ffmpeg -y -v error -i "${p}" -vf "scale=${w}:-1" -quality ${q} "${tmp}"`);
  const before = fs.statSync(p).size, after = fs.statSync(tmp).size;
  if (after < before * 0.8) { fs.renameSync(tmp, p); console.log('downscale', path.basename(p), (before / 1024) | 0, '->', (after / 1024) | 0, 'KB'); }
  else { fs.unlinkSync(tmp); console.log('skip downscale', path.basename(p)); }
}

// 2. webp pass at 18KB threshold
const MIN = 18 * 1024;
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_shots') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png)$/i.test(e.name) && fs.statSync(p).size >= MIN) out.push(p);
  }
  return out;
}
const texts = {};
(function walkRefs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_shots') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkRefs(p);
    else if (/\.(html|css)$/i.test(e.name)) texts[p] = fs.readFileSync(p, 'utf8');
  }
})(ROOT);

let converted = 0;
for (const img of walk(ROOT)) {
  const webp = img.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!fs.existsSync(webp)) {
    const alpha = /png$/i.test(img);
    try { execSync(`ffmpeg -y -v error -i "${img}" -quality ${alpha ? 90 : 78} ${alpha ? '' : '-compression_level 6'} "${webp}"`); }
    catch (e) { console.log('FAIL', img); continue; }
  }
  const orig = fs.statSync(img).size, nw = fs.statSync(webp).size;
  if (nw >= orig * 0.9) { fs.unlinkSync(webp); continue; }
  converted++;
  const base = path.basename(img);
  for (const [p, t] of Object.entries(texts)) {
    if (!t.includes(base)) continue;
    const nt = t.split(base).join(path.basename(webp));
    if (nt !== t) { fs.writeFileSync(p, nt); texts[p] = nt; }
  }
  console.log('webp', base, (orig / 1024) | 0, '->', (nw / 1024) | 0, 'KB');
}
console.log('webp converted:', converted);

// 3. reduce decimal precision on large single-path decorative SVGs
let svgSaved = 0;
(function walkSvg(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_shots') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSvg(p);
    else if (/\.svg$/i.test(e.name) && fs.statSync(p).size > 40 * 1024) {
      const t = fs.readFileSync(p, 'utf8');
      if (/<text|<image|<tspan/i.test(t)) { console.log('skip svg', e.name); continue; }
      const n = t.replace(/-?\d+\.\d{2,}/g, (m) => String(Math.round(parseFloat(m) * 10) / 10));
      if (n.length < t.length) {
        fs.writeFileSync(p, n);
        svgSaved += t.length - n.length;
        console.log('svg', e.name, (t.length / 1024) | 0, '->', (n.length / 1024) | 0, 'KB');
      }
    }
  }
})(ROOT);
console.log('svg saved:', (svgSaved / 1024) | 0, 'KB');
