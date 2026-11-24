const { execSync } = require('child_process');
const fs = require('fs');
const D = 'C:/Users/Harsh/Downloads/clinic(design)/_resp/reg2';
const pages = ['index', 'treatments', 'our-team', 'pricing', 'contact-us', 'locations', 'surgeons', 'blog'];
function build(prefix, cw, ch, cols, out) {
  const ins = pages.map((p) => ` -i ${D}/${prefix}_${p}.png`).join('');
  const g = 8;
  const W = cw + g, H = ch + g;
  const rows = Math.ceil(pages.length / cols);
  const cells = [];
  for (let i = 0; i < pages.length; i++) cells.push(`${(i % cols) * W}_${Math.floor(i / cols) * H}`);
  const fc = pages.map((p, i) => `[${i}]scale=${cw}:${ch}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${W}:${H}:0:0:color=0xdddddd[m${i}]`).join(';') +
    `;${pages.map((p, i) => `[m${i}]`).join('')}xstack=inputs=${pages.length}:layout=${cells.join('|')}`;
  fs.writeFileSync(`${D}/fc_${prefix}.txt`, fc);
  execSync(`ffmpeg -y -v error${ins} -filter_complex_script ${D}/fc_${prefix}.txt ${D}/${out}`);
  console.log(out, (fs.statSync(`${D}/${out}`).size / 1024) | 0, 'KB', `${rows} rows x ${cols} cols: ${pages.join(', ')}`);
}
build('m', 300, 500, 4, 'MONTAGE_mobile.png');
build('d', 700, 486, 2, 'MONTAGE_desktop.png');
