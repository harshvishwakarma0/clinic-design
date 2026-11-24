const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.eot': 'application/vnd.ms-fontobject', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.json': 'application/json' };
const COMPRESSIBLE = /^(text\/|application\/javascript|application\/json|image\/svg)/;
const CACHE = { '.html': 'no-cache', '.css': 'public, max-age=86400', '.js': 'public, max-age=86400', '.jpg': 'public, max-age=604800', '.jpeg': 'public, max-age=604800', '.png': 'public, max-age=604800', '.webp': 'public, max-age=604800', '.svg': 'public, max-age=604800', '.gif': 'public, max-age=604800', '.ico': 'public, max-age=604800', '.woff': 'public, max-age=2592000', '.woff2': 'public, max-age=2592000', '.ttf': 'public, max-age=2592000', '.otf': 'public, max-age=2592000', '.mp4': 'public, max-age=604800', '.webm': 'public, max-age=604800' };
const gzCache = new Map();
const qs = (u) => (u.includes('?') ? '?' + u.split('?')[1] : '');
process.on('uncaughtException', (e) => console.log('uncaught:', e.code || e.message));
process.on('unhandledRejection', () => {});
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(path.normalize(ROOT))) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e) { res.writeHead(404); return res.end('not found: ' + p); }
    if (st.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + qs(req.url) }); return res.end(); }
      const idx = path.join(f, 'index.html');
      return fs.stat(idx, (e2, st2) => {
        if (e2) { res.writeHead(404); return res.end('not found: ' + p); }
        send(idx, st2);
      });
    }
    send(f, st);
  });
  function send(f, st) {
    const type = TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': CACHE[path.extname(f).toLowerCase()] || 'public, max-age=3600', 'Last-Modified': st.mtime.toUTCString() };
    const range = req.headers.range;
    if (range && /^bytes=/.test(range)) {
      const [s, e2] = range.replace('bytes=', '').split('-');
      const start = parseInt(s, 10) || 0;
      const end = e2 ? Math.min(parseInt(e2, 10), st.size - 1) : st.size - 1;
      if (start <= end && end < st.size) {
        res.writeHead(206, Object.assign({}, headers, { 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 }));
        const s = fs.createReadStream(f, { start, end }); s.on('error', () => { res.destroy(); }); return s.pipe(res);
      }
    }
    const wantsGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && COMPRESSIBLE.test(type);
    if (wantsGz) {
      const key = f + '@' + st.mtimeMs;
      let gz = gzCache.get(key);
      const done = (buf) => { res.writeHead(200, Object.assign({}, headers, { 'Content-Encoding': 'gzip', 'Content-Length': buf.length, Vary: 'Accept-Encoding' })); res.end(buf); };
      if (gz) return done(gz);
      fs.readFile(f, (err, d) => {
        if (err) { res.writeHead(500); return res.end(); }
        zlib.gzip(d, (e2, z) => {
          if (e2 || z.length >= d.length) { res.writeHead(200, Object.assign({}, headers, { 'Content-Length': d.length })); return res.end(d); }
          if (gzCache.size > 200) gzCache.clear();
          gzCache.set(key, z);
          done(z);
        });
      });
      return;
    }
    res.writeHead(200, Object.assign({}, headers, { 'Content-Length': st.size }));
    const s = fs.createReadStream(f); s.on('error', () => { res.destroy(); }); s.pipe(res);
  }
}).listen(8787, () => console.log('serving on http://localhost:8787'));
