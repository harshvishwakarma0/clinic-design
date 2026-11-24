const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const MIN = 45 * 1024;

function walkImages(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_shots') walkImages(p, out); }
    else if (/\.(jpe?g|png)$/i.test(e.name) && fs.statSync(p).size >= MIN) out.push(p);
  }
  return out;
}

const imgs = walkImages(ROOT);
console.log('candidates >=100KB:', imgs.length);

// collect all html/css text once
const texts = {};
function walkRefs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_shots') walkRefs(p); }
    else if (/\.(html|css)$/i.test(e.name)) texts[p] = fs.readFileSync(p, 'utf8');
  }
}
walkRefs(ROOT);

let converted = 0, refPages = 0;
for (const img of imgs) {
  const webp = img.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!fs.existsSync(webp)) {
    const alpha = /png$/i.test(img);
    const q = alpha ? 90 : 78;
    try {
      execSync(`ffmpeg -y -v error -i "${img}" -quality ${q} ${alpha ? '' : '-compression_level 6'} "${webp}"`, { stdio: 'pipe' });
    } catch (e) { console.log('FAIL', img, e.message.slice(0, 120)); continue; }
  }
  const orig = fs.statSync(img).size, nw = fs.statSync(webp).size;
  if (nw >= orig * 0.9) { fs.unlinkSync(webp); continue; }
  converted++;
  const base = path.basename(img);
  const nb = path.basename(webp);
  for (const [p, t] of Object.entries(texts)) {
    if (!t.includes(base)) continue;
    const nt = t.split(base).join(nb);
    if (nt !== t) { fs.writeFileSync(p, nt); texts[p] = nt; refPages++; }
  }
  console.log(base, (orig / 1024).toFixed(0) + 'KB ->', (nw / 1024).toFixed(0) + 'KB');
}
console.log('converted:', converted, 'ref-edits:', refPages);
