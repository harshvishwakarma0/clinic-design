const fs = require('fs');
const ROOT = 'C:/Users/Harsh/Downloads/clinic(design)/site';
const w = Number(process.argv[2]), h = Number(process.argv[3]);
const src = process.argv[4] || '_pc_check.html';
fs.writeFileSync(ROOT + '/_pc_frame.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}</style></head><body><iframe id="f" src="${src}" style="width:${w}px;height:${h}px;border:0;display:block"></iframe></body></html>`);
