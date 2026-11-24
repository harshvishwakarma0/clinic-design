#!/bin/bash
S=qikr
U=https://eye-surgeons-india.vercel.app
ids() { bsk cooperate sync --session $S --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('E E')}})"; }
nav() { for a in 1 2 3 4; do SY=$(ids); [ "$SY" = "E E" ] && { sleep 3; continue; }; R=$(bsk navigate --session $S --context "${SY%% *}" --observation "${SY##* }" --quiet "$1" 2>&1 | tail -1); case "$R" in url=*) return 0;; *) sleep 2;; esac; done; echo "NAVFAIL $1 $R"; }
nav "$U/privacy-policy/"
SY=$(ids); bsk emulate --session $S --context "${SY%% *}" --observation "${SY##* }" --width 390 --height 844 --dpr 3 --mobile --quiet >/dev/null 2>&1 || echo EMULFAIL
nav "$U/"
sleep 10
SY=$(ids)
bsk evaluate --session $S --context "${SY%% *}" --observation "${SY##* }" --json '(function(){var out={vw:innerWidth,scrollW:document.documentElement.scrollWidth,bodyScroll:document.body.scrollWidth,h1:[]};var els=[].slice.call(document.querySelectorAll("div,p,h1,h2,span")).filter(function(e){return /Saving Eyes/.test(e.textContent)&&e.children.length===0;});els.slice(0,3).forEach(function(e){var r=e.getBoundingClientRect();var cs=getComputedStyle(e);out.h1.push({tag:e.tagName,text:e.textContent.trim().slice(0,30),x:Math.round(r.left),right:Math.round(r.right),w:Math.round(r.width),fs:cs.fontSize,align:cs.textAlign,transform:e.parentElement?getComputedStyle(e.parentElement).transform.slice(0,40):"",opacity:e.parentElement?getComputedStyle(e.parentElement).opacity:""});});var hero=document.querySelector(".lg:hidden > div");if(hero){var hr=hero.getBoundingClientRect();out.hero={x:Math.round(hr.left),w:Math.round(hr.width)};}return JSON.stringify(out);})()' 2>&1 | tail -5
