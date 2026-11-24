const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '_shots' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

let changed = 0;
for (const f of walk(ROOT)) {
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('rel="preload" as="image"')) continue;
  const urls = [];
  for (const m of h.matchAll(/background-image: url\('([^']*hero[^']*)'\)/g))
    if (!urls.includes(m[1])) urls.push(m[1]);
  if (!urls.length) continue;
  const hasMobile = urls.some((u) => /mobile/.test(u));
  const links = urls.map((u) => {
    let media = '';
    if (hasMobile) media = /mobile/.test(u) ? ' media="(max-width: 59.99rem)"' : ' media="(min-width: 60rem)"';
    return `<link rel="preload" as="image"${media} href="${u}">`;
  });
  h = h.replace(/(<title>[\s\S]*?<\/title>)/, '$1\n' + links.join('\n'));
  fs.writeFileSync(f, h);
  changed++;
  console.log(path.relative(ROOT, f), '->', links.map((l) => (l.includes('max-width') ? 'M' : l.includes('min-width') ? 'D' : 'A')).join(','));
}
console.log('pages changed:', changed);
