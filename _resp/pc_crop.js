const { execSync } = require('child_process');
const fs = require('fs');
const zlib = require('zlib');
const DIR = 'C:/Users/Harsh/Downloads/clinic(design)/_resp/pc';
const CH = '"C:/Program Files/Google/Chrome/Application/chrome.exe"';

// average colour of every row of a PNG, via ffmpeg scale=1:H rawvideo rgb24
function rowColors(file) {
  const h = pngHeight(file);
  const raw = execSync(`ffmpeg -y -loglevel error -i "${file}" -vf scale=1:${h} -f rawvideo -pix_fmt rgb24 "${file}.raw" && cat "${file}.raw" | wc -c`);
  const buf = fs.readFileSync(file + '.raw');
  fs.unlinkSync(file + '.raw');
  const rows = [];
  for (let i = 0; i < h; i++) rows.push([buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]]);
  return rows;
}
function pngHeight(file) {
  const b = fs.readFileSync(file);
  return b.readUInt32BE(20);
}
function findMarker(rows, kind) {
  // magenta = R high, G low, B high ; cyan = R low, G high, B high
  const hits = [];
  rows.forEach((c, i) => {
    const [r, g, b] = c;
    if (kind === 'top' ? r > 170 && g < 110 && b > 170 : r < 110 && g > 170 && b > 170) hits.push(i);
  });
  return hits.length ? hits[0] : -1;
}

const widths = process.argv.slice(2).map(Number);
for (const w of widths) {
  const out = `${DIR}/full_${w}.png`;
  execSync(`${CH} --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=${w},12000 --virtual-time-budget=30000 --screenshot="${out}" "http://localhost:8787/_pc_check.html"`, { stdio: 'ignore' });
  const rows = rowColors(out);
  const top = findMarker(rows, 'top');
  const bot = findMarker(rows, 'bot');
  if (top < 0 || bot < 0) { console.log(`w=${w} markers not found (top=${top} bot=${bot})`); continue; }
  const y = Math.max(0, top - 40);
  const h = Math.min(12000 - y, bot - top + 90);
  execSync(`ffmpeg -y -loglevel error -i "${out}" -vf "crop=${w}:${h}:0:${y}" "${DIR}/section_${w}.png"`);
  console.log(`w=${w} section y=${top} h=${bot - top} -> section_${w}.png`);
}
