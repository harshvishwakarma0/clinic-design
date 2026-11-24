#!/bin/bash
# post-optimization visual regression sweep with browser-skill
S=qikr
D="/c/Users/Harsh/Downloads/clinic(design)/_resp/reg"
mkdir -p "$D"
syncids() {
  bsk cooperate sync --session $S --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{var j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('E E')}})"
}
nav() {
  for a in 1 2 3 4; do
    SY=$(syncids); [ "$SY" = "E E" ] && { sleep 3; continue; }
    R=$(bsk navigate --session $S --context "${SY%% *}" --observation "${SY##* }" --quiet "$1" 2>&1 | tail -1)
    case "$R" in url=*) return 0;; *) sleep 2;; esac
  done
  echo "NAVFAIL $1: $R"
}
for W in 390 768 1440; do
  if [ $W -le 500 ]; then H=844; FLAGS="--mobile --dpr 3"
  elif [ $W -le 900 ]; then H=1024; FLAGS="--mobile --dpr 2"
  else H=900; FLAGS="--dpr 1"; fi
  nav "http://localhost:8787/_idle.html"
  SY=$(syncids)
  bsk emulate --session $S --context "${SY%% *}" --observation "${SY##* }" --width $W --height $H $FLAGS --quiet >/dev/null 2>&1 || echo "EMULFAIL w=$W"
  for P in index treatments our-team pricing contact-us locations blog surgeons patient-information optometrists corneal-crosslinking; do
    [ $P = index ] && U="http://localhost:8787/" || U="http://localhost:8787/$P/"
    nav "$U"
    sleep 6
    bsk screenshot --session $S --out "$D/${W}_${P}_top.png" --quiet >/dev/null 2>&1
    [ $P = index ] && { bsk screenshot --session $S --full-page --timeout 3m --out "$D/${W}_index_full.png" --quiet >/dev/null 2>&1; }
  done
  echo "done w=$W"
done
