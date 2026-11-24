#!/bin/bash
S=qikr
ids() { bsk cooperate sync --session $S --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log(j.context_id+' '+j.observation_id)}catch(e){console.log('E E')}})"; }
for a in 1 2 3 4 5 6; do
  SY=$(ids); [ "$SY" = "E E" ] && { sleep 2; continue; }
  R=$(bsk evaluate --session $S --context "${SY%% *}" --observation "${SY##* }" --json "$1" 2>&1)
  if echo "$R" | grep -q "observation_changed"; then sleep 2; continue; fi
  echo "$R" | tail -12; exit 0
done
echo "EVALFAIL after retries"
