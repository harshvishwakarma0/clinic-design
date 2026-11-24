#!/bin/bash
# responsive sweep via bsk emulation
OUT="/c/Users/Harsh/Downloads/clinic(design)/_resp/results.txt"
: > "$OUT"
JS='(function(){var m=document.getElementById("morph-host-root");if(m)m.remove();var d=document,vw=d.documentElement.clientWidth,bad=[];var sel=d.querySelectorAll("body *");for(var i=0;i<sel.length;i++){var el=sel[i];var cs=getComputedStyle(el);if(cs.display==="none"||cs.visibility==="hidden"||cs.position==="fixed")continue;var oc=false,p=el.parentElement;while(p){var pc=getComputedStyle(p);if(/hidden|auto|scroll/.test(pc.overflowX)){oc=true;break;}p=p.parentElement;}if(oc)continue;var r=el.getBoundingClientRect();if(r.width>0&&r.right>vw+3){bad.push(el.tagName+"."+String(el.className).split(" ")[0]+"|r="+Math.round(r.right)+"|w="+Math.round(r.width));}}return JSON.stringify({vw:vw,scrollW:d.documentElement.scrollWidth,n:bad.length,x:bad.slice(0,6)})})()'
for W in 360 390 768 1024 1440 1920; do
  if [ $W -lt 700 ]; then H=800; elif [ $W -lt 1100 ]; then H=900; else H=1080; fi
  if [ $W -lt 1024 ]; then MOB="--mobile --dpr 2"; else MOB="--dpr 1"; fi
  bsk emulate --session ohst --width $W --height $H $MOB --quiet >/dev/null 2>&1
  for P in "/" "/locations/" "/pricing/" "/contact-us/" "/treatments/" "/our-team/" "/blog/" "/patient-information/" "/surgeons/" "/optometrists/"; do
    bsk navigate --session ohst --quiet "http://localhost:8787$P" >/dev/null 2>&1
    RES=""
    for TRY in 1 2 3 4 5 6; do
      sleep 4
      SY=$(bsk cooperate sync --session ohst --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{var j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('ERR ERR')}})")
      CTX=${SY%% *}
      OBS=${SY##* }
      RES=$(bsk evaluate --session ohst --context "$CTX" --observation "$OBS" --timeout 60s "$JS" 2>&1)
      case "$RES" in *'"vw"'*) break;; *) RES="retry$TRY:${RES:0:60}";; esac
    done
    echo "w=$W p=$P $RES" >> "$OUT"
    echo "w=$W p=$P ${RES:0:160}"
  done
done
