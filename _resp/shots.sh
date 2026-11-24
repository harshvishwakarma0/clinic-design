#!/bin/bash
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
D="C:/Users/Harsh/Downloads/clinic(design)/_resp/reg2"
mkdir -p "$D"
pages="index treatments our-team pricing contact-us locations surgeons blog"
for pg in $pages; do
  u=[EMAIL]
  [ "$pg" = index ] && u="http://localhost:8787/" || u="http://localhost:8787/$pg/"
  "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=390,1500 --virtual-time-budget=20000 --screenshot="$D/m_${pg}.png" "$u" >/dev/null 2>&1
  "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1440,1000 --virtual-time-budget=20000 --screenshot="$D/d_${pg}.png" "$u" >/dev/null 2>&1
  echo "shot $pg"
done
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=390,4200 --virtual-time-budget=30000 --screenshot="$D/m_home_tall.png" "http://localhost:8787/" >/dev/null 2>&1
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,2600 --virtual-time-budget=30000 --screenshot="$D/d_home_tall.png" "http://localhost:8787/" >/dev/null 2>&1
ls "$D" | wc -l
