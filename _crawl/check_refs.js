const fs = require('fs');
const path = require('path');
const http = require('http');

const SITE = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const BASE = 'http://localhost:8787';
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory() && !e.name.startsWith('wp-')) walk(p);
    else if (e.name === 'index.html') pages.push(path.relative(SITE, p).replace(/\\/g, '/'));
  }
})(SITE);

function status(url) {
  return new Promise((res) => {
    const req = http.get(url, (r) => { r.resume(); res(r.statusCode); });
    req.on('error', () => res('ERR'));
    req.setTimeout(15000, () => { req.destroy(); res('TIMEOUT'); });
  });
}

(async () => {
  const bad = [];
  let checked = 0;
  for (const pg of pages) {
    const html = fs.readFileSync(path.join(SITE, pg), 'utf8');
    const refs = new Set();
    for (const m of html.matchAll(/(?:src|href|data-src|poster)="([^"]+)"/g)) {
      let u = m[1];
      if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
      const clean = u.split('#')[0].split('?')[0];
      if (!clean) continue;
      const abs = path.posix.normalize(path.posix.join(path.posix.dirname(pg), clean));
      refs.add('/' + abs);
    }
    for (const r of refs) {
      const code = await status(BASE + encodeURI(r));
      checked++;
      if (code !== 200) bad.push(`${pg} -> ${r} [${code}]`);
    }
  }
  console.log(`checked ${checked} refs across ${pages.length} pages; failures: ${bad.length}`);
  bad.slice(0, 60).forEach((b) => console.log(b));
  fs.writeFileSync('C:/Users/Harsh/Downloads/clinic(design)/_crawl/bad_refs.txt', bad.join('\n'));
})();
