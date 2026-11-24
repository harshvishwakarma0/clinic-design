const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_shots') walk(p, out); }
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let h = fs.readFileSync(f, 'utf8');
  const before = h;
  // 1. remove GTM head snippet
  h = h.replace(/<script>\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\];w\[l\]\.push\(\{'gtm\.start'[\s\S]*?GTM-TWX7W266'\);\}<\/script>/g, '');
  // 2. remove gtag external script (keep inline -after stub)
  h = h.replace(/<script id="google_gtagjs-js" src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=GT-P82GT9C9" async><\/script>\n?/g, '');
  // 3. find + remove elevenlabs loader (either variant), capture its src
  let src = null;
  h = h.replace(/<script>window\.addEventListener\("load",function\(\)\{var go=function\(\)\{var s=document\.createElement\("script"\);s\.src="([^"]+)";[\s\S]*?<\/script>\n?/g, function (_, s1) { src = s1; return ''; });
  h = h.replace(/<script src="([^"]*elevenlabs-convai-widget-embed\.js)" async type="text\/javascript"><\/script>\n?/g, function (_, s1) { src = s1; return ''; });
  if (!src) src = 'wp-content/themes/eye-surgeons/assets/client/js/elevenlabs-convai-widget-embed.js';
  if (h === before) continue;
  const loader = `<script>(function(){var fired=false;function go(){if(fired)return;fired=true;function add(u){var s=document.createElement('script');s.src=u;s.async=true;document.head.appendChild(s);}add('https://www.googletagmanager.com/gtag/js?id=GT-P82GT9C9');add('https://www.googletagmanager.com/gtm.js?id=GTM-TWX7W266');add('${src}');}['pointerdown','wheel','touchstart','keydown'].forEach(function(ev){addEventListener(ev,go,{once:true,passive:true});});setTimeout(go,8000);})();</script>`;
  h = h.replace(/<\/body>/, loader + '</body>');
  fs.writeFileSync(f, h);
  n++;
}
console.log('pages updated:', n);
