#!/bin/bash
# bsk visual sweep: emulate each width on idle page, then screenshot each target page
S=qikr
D="/c/Users/Harsh/Downloads/clinic(design)/_resp"
syncids() {
  bsk cooperate sync --session $S --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{var j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('E E')}})"
}
nav() {
  for a in 1 2 3; do
    SY=$(syncids); [ "$SY" = "E E" ] && { sleep 3; continue; }
    R=$(bsk navigate --session $S --context "${SY%% *}" --observation "${SY##* }" --quiet "$1" 2>&1 | tail -1)
    case "$R" in url=*) return 0;; *) sleep 2;; esac
  done
  echo "NAVFAIL $1: $R"
}
for W in 768 1024 1440 1920; do
  if [ $W -lt 700 ]; then H=800; elif [ $W -lt 1100 ]; then H=1024; else H=1080; fi
  if [ $W -lt 1024 ]; then MOB="--mobile --dpr 2"; else MOB="--no-mobile --dpr 1"; fi
  nav "http://localhost:8787/_idle.html"
  SY=$(syncids)
  bsk emulate --session $S --context "${SY%% *}" --observation "${SY##* }" --width $W --height $H $MOB --quiet >/dev/null 2>&1 || echo "EMULFAIL w=$W"
  for P in index locations pricing contact-us treatments our-team blog patient-information surgeons optometrists; do
    [ $P = index ] && U="http://localhost:8787/" || U="http://localhost:8787/$P/"
    nav "$U"
    sleep 5
    bsk screenshot --session $S --out "$D/w${W}_${P}.png" --quiet 2>&1 | grep -v '^$' | tail -1
  done
  echo "done w=$W"
done
