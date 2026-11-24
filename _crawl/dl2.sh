#!/bin/bash
cd "C:/Users/Harsh/Downloads/clinic(design)/site/wp-content/themes/eye-surgeons/assets/client/images"
dl() {
 curl -s "https://images.pexels.com/photos/$1/pexels-photo-$1.jpeg?auto=compress&cs=tinysrgb&w=$2&h=$3&fit=crop" -o "$4" </dev/null
 sz=$(wc -c < "$4")
 if [ "$sz" -lt 3000 ]; then echo "FAIL $4 ($sz)"; else echo "ok   $4 ($sz)"; fi
 sleep 1.2
}
dl 8460371 247 202 our-expertise-image-1.jpg
dl 6749698 247 202 our-expertise-image-2.jpg
dl 5996759 247 202 our-expertise-image-3.jpg
dl 4769122 247 202 our-expertise-image-4.jpg
dl 5217058 518 518 quality-care-image-1.jpg
dl 12605612 240 240 quality-care-image-2.jpg
dl 11238648 1000 667 educational-resources-image.jpg
dl 7578797 800 520 contact-us-first-section-1.jpg
dl 4269274 800 533 contact-us-first-section-2.jpg
dl 6129147 800 534 contact-us-first-section-3.jpg
dl 4269203 860 645 contact-us-location-1.jpg
dl 4269206 860 573 contact-us-location-2.jpg
dl 4269270 860 676 contact-us-location-3.jpg
dl 4269271 860 676 contact-us-location-4.jpg
dl 6129646 1200 1200 optometrists-first-section-1.jpg
dl 6749699 1200 1200 optometrists-first-section-2.jpg
dl 9366098 1200 1200 locations-first-section-image-1.jpg
dl 5996644 1160 1160 locations-first-section-image-2.jpg
dl 5996647 1200 1200 location-services-image-1.jpg
dl 7583382 800 800 location-services-image-2.jpg
dl 4269275 545 768 location-hamilton-central.jpg
dl 11811346 1000 1357 location-cambridge.jpg
dl 10975806 1000 1500 location-whanganui.jpg
dl 12177342 1000 1383 location-pukekohe.jpg
cd "C:/Users/Harsh/Downloads/clinic(design)/site/wp-content/uploads/2026/03"
dl 14172615 1500 1002 kayak-lake.jpg
dl 14172615 1024 684 kayak-lake-1024x684.jpg
