#!/bin/bash
S=gppt
ids() { bsk cooperate sync --session $S --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('E E')}})"; }
try_with() { # $1 = command string to run with fresh ids
  for a in 1 2 3 4 5 6 7; do
    SY=$(ids); [ "$SY" = "E E" ] && { sleep 2; continue; }
    OUT=$(eval "$1" 2>&1)
    if echo "$OUT" | grep -qiE "observation changed|unfinished"; then sleep 2; continue; fi
    echo "$OUT" | tail -2; return 0
  done
  echo "FAILED: $1"; return 1
}
try_with "bsk navigate --session $S --context \${SY%% *} --observation \${SY##* } --quiet https://eyesurgeons.co.nz/"
sleep 8
try_with "bsk emulate --session $S --context \${SY%% *} --observation \${SY##* } --width 375 --height 667 --dpr 2 --mobile --quiet"
try_with "bsk navigate --session $S --context \${SY%% *} --observation \${SY##* } --quiet https://eyesurgeons.co.nz/"
sleep 12
try_with "bsk evaluate --session $S --context \${SY%% *} --observation \${SY##* } --json '(function(){var s=document.querySelector(\"section.personalised-care\")||[].slice.call(document.querySelectorAll(\"h2\")).find(function(e){return /Personalised/.test(e.textContent)});if(s){s.scrollIntoView({block:\"center\"});}return String(window.scrollY);})()'"
sleep 3
try_with "bsk evaluate --session $S --context \${SY%% *} --observation \${SY##* } --json '(function(){var v=document.querySelectorAll(\"video\");var out=[];[].slice.call(v).forEach(function(el){var r=el.getBoundingClientRect();if(r.width>0||r.height>0)out.push({w:Math.round(r.width),h:Math.round(r.height),top:Math.round(r.top),cls:el.parentElement.className.slice(0,60)});});var h=[].slice.call(document.querySelectorAll(\"h2\")).find(function(e){return /Personalised/.test(e.textContent)});return JSON.stringify({videos:out.slice(0,8),heading:h?Math.round(h.getBoundingClientRect().top):null,vw:innerWidth});})()'"
try_with "bsk screenshot --session $S --out /c/Users/Harsh/Downloads/clinic\(design\)/_resp/orig_personalised_375.png --quiet"
