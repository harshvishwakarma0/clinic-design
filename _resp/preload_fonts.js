const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const FONT_DIR = 'wp-content/themes/eye-surgeons/assets/client/fonts/';
const FONTS = ['Gilroy-Regular.woff2', 'Gilroy-SemiBold.woff2', 'ClashDisplay-Semibold.woff2'];
const TAGS = FONTS.map(f => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${FONT_DIR}${f}">`).join('\n');
let pages = 0, done = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '_shots' || e.name === 'wp-admin') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/index\.html$/i.test(e.name)) {
      pages++;
      let t = fs.readFileSync(p, 'utf8');
      if (t.includes('rel="preload" as="font"')) { return; }
      const m = [...t.matchAll(/<link rel="preload" as="image"[^\n]*>\n/g)];
      if (m.length) { t = t.slice(0, m[m.length - 1].index + m[m.length - 1][0].length) + TAGS + '\n' + t.slice(m[m.length - 1].index + m[m.length - 1][0].length); }
      else { const i = t.indexOf('</title>'); if (i < 0) { console.log('no anchor', p); return; } t = t.slice(0, i + 8) + '\n' + TAGS + t.slice(i + 8); }
      fs.writeFileSync(p, t); done++;
    }
  }
})(ROOT);
console.log('pages scanned', pages, 'font-preloaded', done);
