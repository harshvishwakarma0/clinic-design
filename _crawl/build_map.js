const fs = require('fs');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/_crawl';
const urls = fs.readFileSync(ROOT + '/urls.txt', 'utf8').replace(/\r/g, '').trim().split('\n')
  .filter(u => !u.endsWith('/feed') && !u.includes('admin-ajax') && !u.includes('wp-json'));
const map = {};
let missing = [];
for (const u of urls) {
  let p = u.replace('https://eyesurgeons.co.nz/', '').replace(/\/+$/, '');
  const fname = 'html/' + (p === '' ? 'home' : p.replace(/\//g, '_')) + '.html';
  if (fs.existsSync(ROOT + '/' + fname)) {
    map[p === '' ? '/' : p + '/'] = fname;
  } else {
    missing.push(u);
  }
}
fs.writeFileSync(ROOT + '/pagepaths.json', JSON.stringify(map, null, 1));
console.log(Object.keys(map).length, 'pages mapped');
if (missing.length) console.log('MISSING:', missing.join(', '));
