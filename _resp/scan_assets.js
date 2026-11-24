const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const exts = new Set(['.eot', '.woff', '.woff2', '.ttf', '.otf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.js', '.css', '.ico']);
const bad = [];
let scanned = 0;
(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { if (name !== '.vercel') walk(p); continue; }
    const ext = path.extname(name).toLowerCase();
    if (!exts.has(ext)) continue;
    scanned++;
    const fd = fs.openSync(p, 'r');
    const buf = Buffer.alloc(512);
    const n = fs.readSync(fd, buf, 0, 512, 0);
    fs.closeSync(fd);
    const head = buf.slice(0, n).toString('latin1').trimStart().toLowerCase();
    const isHtml = head.startsWith('<!doctype html') || head.startsWith('<html') || head.includes('<html lang');
    const empty = n === 0;
    const tinyImg = !isHtml && !empty && ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4'].includes(ext) && st.size < 1200;
    if (isHtml || empty || tinyImg) bad.push([path.relative(ROOT, p).replace(/\\/g, '/'), ext, st.size, isHtml ? 'HTML' : empty ? 'EMPTY' : 'TINY']);
  }
})(ROOT);
console.log('scanned', scanned, 'assets; suspicious', bad.length);
bad.slice(0, 60).forEach(b => console.log(b.join(' | ')));
