const fs = require('fs');
const file = process.argv[2];
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const a = (k) => r.audits[k] || {};
const d = (k) => a(k).displayValue || '-';
console.log('URL:', r.finalUrl);
console.log('PERF SCORE:', Math.round((r.categories.performance.score || 0) * 100));
console.log('  LCP ', d('largest-contentful-paint'), '| SI', d('speed-index'), '| TBT', d('total-blocking-time'), '| CLS', d('cumulative-layout-shift'), '| INP', d('interaction-to-next-paint'));
console.log('  total byte weight:', d('total-byte-weight'), '| requests:', (r.audits['network-requests'] || {}).details?.items?.length || '?');
console.log('--- opportunities / failing audits ---');
const rows = [];
for (const k in r.audits) {
  const x = r.audits[k];
  if (x.score === null || x.score === undefined) continue;
  if (x.score >= 0.9) continue;
  if (!['opportunity', 'numeric', 'binary'].includes(x.scoreDisplayMode)) continue;
  rows.push([x.score, k, x.displayValue || '']);
}
rows.sort((p, q) => p[0] - q[0]);
for (const [s, k, dv] of rows) console.log(' ', s.toFixed(2), k, '|', dv);
const nw = (r.audits['network-requests'] || {}).details?.items || [];
if (nw.length) {
  const bySize = [...nw].sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 12);
  console.log('--- heaviest requests ---');
  for (const i of bySize) console.log('  ', (i.transferSize / 1024).toFixed(0) + 'KB', i.resourceType, i.url.replace('http://localhost:8787', ''));
}
