const fs = require('fs'), path = require('path');
const ROOT = 'site/wp-content';
const out = [];
(function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (/\.webp$/i.test(e.name)) out.push([p.split(path.sep).join('/'), fs.statSync(p).size]); } })(ROOT);
const dim = (f) => { const b = fs.readFileSync(f), f4 = b.slice(12, 16).toString();
  if (f4 === 'VP8X') return [1 + (b[24] | b[25] << 8 | b[26] << 16), 1 + (b[27] | b[28] << 8 | b[29] << 16)];
  if (f4 === 'VP8L') { const n = b.readUInt32LE(21); return [1 + ((n >> 1) & 0x3fff), 1 + ((n >> 15) & 0x3fff)]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]; };
out.filter(([f, s]) => s > 40 * 1024).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([f, s]) => {
  const [w, h] = dim(f);
  console.log(String(Math.round(s / 1024)).padStart(4) + 'KB', (w + 'x' + h).padStart(11), /mobile/i.test(f) ? 'MOBILE ' : 'other  ', f);
});
