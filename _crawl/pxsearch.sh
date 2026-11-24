#!/bin/bash
# usage: pxsearch.sh "query" outfile.html  -> prints id | alt list
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
Q=$(python -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1" 2>/dev/null || node -e "console.log(encodeURIComponent(process.argv[1]))" "$1")
curl -sL -A "$UA" -H "Accept-Language: en-US,en;q=0.9" "https://www.pexels.com/search/$Q/" -o "$2" </dev/null
node -e "
const h=require('fs').readFileSync('$2','utf8');
const tags=h.match(/<img[^>]*>/g)||[];
let seen=new Set();
for(const t of tags){
 const idm=t.match(/pexels-photo-(\d+)\.jpeg/); if(!idm)continue;
 const alt=t.match(/alt=\"([^\"]*)\"/); const altv=alt?alt[1]:'';
 if(seen.has(idm[1])||seen.size>=15)continue;
 seen.add(idm[1]); console.log(idm[1]+' | '+altv);
}
"
