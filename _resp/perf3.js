const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = 'site/wp-content';
const files = [];
(function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (/\.webp$/i.test(e.name)) files.push(p.split(path.sep).join('/')); } })(ROOT);
const dim = (f) => { const b = fs.readFileSync(f), t = b.slice(12, 16).toString();
  if (t === 'VP8X') return [1 + (b[24] | b[25] << 8 | b[26] << 16), 1 + (b[27] | b[28] << 8 | b[29] << 16)];
  if (t === 'VP8L') { const n = b.readUInt32LE(21); return [1 + ((n >> 1) & 0x3fff), 1 + ((n >> 15) & 0x3fff)]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]; };
let total = 0, n = 0;
for (const f of files) {
  const size = fs.statSync(f).size;
  if (size < 45 * 1024) continue;
  const [w] = dim(f);
  const mobile = /mobile/i.test(path.basename(f));
  const target = mobile ? 780 : 1600;
  if (w <= target) continue;
  const tmp = f + '.tmp.webp';
  execSync(`ffmpeg -y -v error -i "${f}" -vf "scale=${target}:-1" -quality 72 "${tmp}"`);
  const nw = fs.statSync(tmp).size;
  if (nw < size * 0.85) { fs.renameSync(tmp, f); total += size - nw; n++; console.log(path.basename(f), w + '->' + target, (size / 1024) | 0, '->', (nw / 1024) | 0, 'KB'); }
  else fs.unlinkSync(tmp);
}
console.log('re-encoded', n, 'files, saved', (total / 1024) | 0, 'KB');
