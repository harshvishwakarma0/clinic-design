#!/usr/bin/env bash
# usage: cap.sh <session> <outdir> <count> [delta]
set -u
SID=$1; OUTDIR=$2; N=${3:-10}; DELTA=${4:-700}
mkdir -p "$OUTDIR"
parse() { node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log(j.context_id+'|'+j.observation_id)}catch(e){console.log('|')}})"; }
for i in $(seq 1 "$N"); do
  OUT=$(bsk cooperate sync --session "$SID" --json 2>/dev/null)
  CTX=$(echo "$OUT" | parse)
  C="${CTX%%|*}"; O="${CTX##*|}"
  [ -z "$C" ] && { echo "sync failed at $i"; continue; }
  if [ "$i" -gt 1 ]; then
    bsk wheel --delta-y "$DELTA" --session "$SID" --context "$C" --observation "$O" >/dev/null 2>&1
    sleep 3
    OUT=$(bsk cooperate sync --session "$SID" --json 2>/dev/null)
    CTX=$(echo "$OUT" | parse)
    C="${CTX%%|*}"; O="${CTX##*|}"
  fi
  if bsk screenshot --session "$SID" --context "$C" --observation "$O" --out "$OUTDIR/$(printf '%02d' "$i").png" >/dev/null 2>&1; then
    echo "ok $i"
  else
    echo "retry $i"
    OUT=$(bsk cooperate sync --session "$SID" --json 2>/dev/null)
    CTX=$(echo "$OUT" | parse); C="${CTX%%|*}"; O="${CTX##*|}"
    bsk screenshot --session "$SID" --context "$C" --observation "$O" --out "$OUTDIR/$(printf '%02d' "$i").png" >/dev/null 2>&1 && echo "ok $i (retry)" || echo "FAIL $i"
  fi
done
