#!/bin/bash
# download indian replacements into site, exact dims, paced
cd "C:/Users/Harsh/Downloads/clinic(design)/site/wp-content"
dl() { # id w h out
 curl -s "https://images.pexels.com/photos/$1/pexels-photo-$1.jpeg?auto=compress&cs=tinysrgb&w=$2&h=$3&fit=crop" -o "$4" </dev/null
 sz=$(wc -c < "$4")
 if [ "$sz" -lt 3000 ]; then echo "FAIL $4 ($sz)"; else echo "ok   $4 ($sz)"; fi
 sleep 1.2
}
# surgeons
dl 14797916 896 896 uploads/2025/11/james-mckelvie.jpg
dl 14797916 300 300 uploads/2025/11/james-mckelvie-300x300.jpg
dl 6762862 742 742 uploads/2025/11/ammar-binsadiq.jpg
dl 6762862 300 300 uploads/2025/11/ammar-binsadiq-300x300.jpg
dl 10695742 638 638 uploads/2025/11/chris-pruet-1.jpg
dl 10695742 300 300 uploads/2025/11/chris-pruet-1-300x300.jpg
dl 5888168 896 896 uploads/2025/11/harris-ansari-1.jpg
dl 5888168 300 300 uploads/2025/11/harris-ansari-1-300x300.jpg
dl 5738735 1200 1200 uploads/2025/11/nicole-brandt-1.jpg
dl 5738735 300 300 uploads/2025/11/nicole-brandt-1-300x300.jpg
dl 14797861 507 480 uploads/2026/08/john-bladen-new.jpg
dl 14797861 300 284 uploads/2026/08/john-bladen-new-300x284.jpg
# staff
dl 899357 300 300 uploads/2026/02/amy-young-300x300.jpg
dl 7580821 300 300 uploads/2026/02/bevan-young-300x300.jpg
dl 7688183 300 300 uploads/2026/02/penny-wilson-300x300.jpg
dl 4584564 300 300 uploads/2026/03/jo-hood-300x300.jpg
dl 26208424 300 300 uploads/2026/02/diana-lee-300x300.jpg
dl 8837525 300 300 uploads/2026/02/jing-yi-wang-300x300.jpg
dl 7578810 300 300 uploads/2026/02/maria-arbole-300x300.jpg
