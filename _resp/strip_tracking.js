const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';

let pages = 0, report = {};
function bump(k) { report[k] = (report[k] || 0) + 1; }

(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '_shots') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!/index\.html$/.test(e.name)) continue;
    let t = fs.readFileSync(p, 'utf8');
    const before = t.length;
    pages++;

    // 1. Site Kit gtag config block (comment + inline script)
    const startMarker = '<!-- Google tag (gtag.js) snippet added by Site Kit -->';
    const i = t.indexOf(startMarker);
    if (i >= 0) {
      const endNeedle = '//# sourceURL=google_gtagjs-js-after';
      const j = t.indexOf(endNeedle, i);
      if (j >= 0) {
        const k = t.indexOf('</script>', j);
        if (k >= 0) { t = t.slice(0, i) + t.slice(k + 9).replace(/^\s*\n/, ''); bump('gtag_block'); }
      }
    }

    // 2. GTM noscript iframe
    t = t.replace(/<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html[^>]*><\/iframe><\/noscript>\s*/g, '');
    bump('noscript_gtm');

    // 3. dns-prefetch + deferred marker
    t = t.replace(/<link rel='dns-prefetch' href='\/\/www\.googletagmanager\.com' \/>\s*/g, '');
    t = t.replace(/<!-- GTM deferred -->\s*/g, '');

    // 4. interaction loader: drop Google scripts, make widget path depth-correct
    const cm = t.match(/href=['"]([^'"]*?)wp-content\/themes\/eye-surgeons\/assets\/client\/css\/output\.css/);
    const prefix = cm ? cm[1] : '';
    t = t.replace(
      /<script>\(function\(\)\{var fired=false;.*?\}\)\(\);<\/script>/g,
      (s) => {
        const widget = (s.match(/add\('([^']*elevenlabs-convai-widget-embed\.js)'\)/) || [])[1];
        if (!widget) return s;
        const rel = widget.replace(/^(\.\.\/)*wp-content/, 'wp-content');
        return "<script>(function(){var fired=false;function go(){if(fired)return;fired=true;var s=document.createElement('script');s.src='" + prefix + rel + "';s.async=true;document.head.appendChild(s);}['pointerdown','wheel','touchstart','keydown'].forEach(function(ev){addEventListener(ev,go,{once:true,passive:true});});})();</script>";
      }
    );
    bump('loader');

    if (t.length !== before) fs.writeFileSync(p, t);
  }
})(ROOT);
console.log('pages processed:', pages, JSON.stringify(report));
