const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const inject = `<script>addEventListener('load',function(){setTimeout(function(){
var hs=[].slice.call(document.querySelectorAll('h2')).filter(function(h){return /Personalised/.test(h.textContent)&&h.offsetParent!==null;});
if(hs.length){var el=hs[0].closest('section')||hs[0].closest('div.relative')||hs[0].parentElement;
window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-360);}
},1500);});</script></body>`;
fs.writeFileSync(path.join(ROOT, '_pc_check.html'), src.replace(/<\/body>/, inject));
console.log('wrote _pc_check.html (scroll variant)');
