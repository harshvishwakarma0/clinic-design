const fs = require('fs');
const path = require('path');
const SITE = 'C:/Users/Harsh/Downloads/clinic(design)/site';

// ---------- replacement tables ----------
const TEXT = [
  // addresses (before city words)
  ['13 Thackeray Street, Hamilton Central', '301, Dr. Annie Besant Marg, Dadar West, Mumbai 400028'],
  ['13 Thackeray street, Hamilton Central', '301, Dr. Annie Besant Marg, Dadar West, Mumbai 400028'],
  ['1913 Cambridge Road, Cambridge 3434.', '89 Turner Road, Bandra West, Mumbai 400050.'],
  ['1913 Cambridge Road, Cambridge 3434', '89 Turner Road, Bandra West, Mumbai 400050'],
  ['1913 Cambridge road, Cambridge 3434', '89 Turner Road, Bandra West, Mumbai 400050'],
  ['Level 1, 49 Taupo Quay, Whanganui 4501', 'Level 2, 45 Hutatma Chowk Road, Colaba, Mumbai 400005'],
  ['Level 1, 49 Taupo Quay, Whanganui 450', 'Level 2, 45 Hutatma Chowk Road, Colaba, Mumbai 400005'],
  ['457 Pollen Street, Thames 3500', 'Plot 12, Vashi Plaza, Sector 19, Vashi, Navi Mumbai 400705'],
  ['82 Manukau Road, Pukekohe 2120', 'Shop 7, Dharam Vihar Road, Teen Haath Naka, Thane West 400601'],
  ['82 Manakau Road, Pukekohe 2120', 'Shop 7, Dharam Vihar Road, Teen Haath Naka, Thane West 400601'],
  // institutions
  ['New Zealand National Eye Bank', 'Mumbai Regional Eye Bank'],
  ['University of Auckland', 'Grant Medical College, Mumbai'],
  ['University of Otago', 'AIIMS, New Delhi'],
  ['Auckland City Hospital', 'KEM Hospital'],
  ['Middlemore Hospital', 'Lilavati Hospital'],
  ['Whanganui Hospital', 'Breach Candy Hospital'],
  ['Waikato Hospital', 'Jaslok Hospital'],
  ['Eye Hospital and Queen Victoria Hospital', 'Mumbai Eye Hospital and Wadia Hospital'],
  ['PhD in Cancer Genomics (2017)', 'PhD in Clinical Ophthalmology (2017)'],
  // legal
  ['Health Information Privacy Code 2020', 'Telemedicine Practice Guidelines 2020'],
  ['Privacy Act 2020', 'DPDP Act 2023'],
  ['Office of the Privacy Commissioner', 'Data Protection Board of India'],
  ['Health and Disability Commissioner', 'National Medical Commission'],
  ['Carﬁx', 'our secure patient portal'],
  ['Carfix', 'our secure patient portal'],
  ['certified health information organisation', 'NABH-accredited healthcare provider'],
  // credentials
  ['MBChB, PhD, FRANZCO', 'MBBS, MS (Ophthalmology), FICO'],
  ['MBBS, FCPS, FRANZCO', 'MBBS, MS (Ophthalmology), Fellowship in Medical Retina'],
  ['FRANZCO, QUALS', 'MBBS, MS (Ophthalmology), FRCS (Ophth)'],
  ['FRANZCO', 'MS (Ophthalmology)'],
  ['MBChB', 'MBBS'],
  ['QUALS', 'FICO'],
  // ACC scheme
  ['ACC Funded Eye Surgery', 'Insurance Funded Eye Surgery'],
  ['ACC-funded', 'insurance-funded'],
  ['ACC funded', 'insurance funded'],
  ['ACC funding', 'insurance coverage'],
  ['ACC scheme', 'insurance scheme'],
  ['ACC portal', 'insurer portal'],
  ['ACC claim', 'insurance claim'],
  ['ACC number', 'policy number'],
  ['ACC process', 'insurer process'],
  ['ACC patients', 'insurance patients'],
  ['ACC appointments', 'insurance-covered appointments'],
  ['ACC guidance', 'insurance guidance'],
  ['ACC and Trauma', 'Insurance and Trauma'],
  ['ACC, ACC', 'TPA, ECHIS'],
  // phones / emails
  ['07 242 0977', '+91 22 4077 2222'],
  ['0800 228 27 228', '1800 425 2228'],
  ['0800 CATARACT', '1800 425 2228'],
  ['0800 cataract', '1800 425 2228'],
  ['info@eyesurgeons.co.nz', 'info@eyesurgeons.in'],
  ['referrals@eyesurgeons.co.nz', 'referrals@eyesurgeons.in'],
  // currency
  ['$4,575', '₹90,000'], ['$5,100', '₹1,00,000'], ['$4,200', '₹80,000'],
  ['$3,400', '₹65,000'], ['$3,200', '₹60,000'],
  ['$290', '₹1,300'], ['$268', '₹1,200'], ['$225', '₹1,000'],
  ['$184', '₹850'], ['$155', '₹700'], ['$75', '₹350'],
  // surgeons
  ['Dr James McKelvie', 'Dr Sanjay Deshpande'], ['James McKelvie', 'Sanjay Deshpande'], ['McKelvie', 'Deshpande'],
  ['Dr Ammar Binsadiq', 'Dr Imran Qureshi'], ['Ammar Binsadiq', 'Imran Qureshi'], ['Binsadiq', 'Qureshi'],
  ['Dr Chris Pruet', 'Dr Vikram Rane'], ['Chris Pruet', 'Vikram Rane'], ['Pruet', 'Rane'],
  ['Dr Nicole Brandt', 'Dr Nikhita Ranade'], ['Nicole Brandt', 'Nikhita Ranade'], ['Brandt', 'Ranade'],
  ['Dr Harris Ansari', 'Dr Harish Anand'], ['Harris Ansari', 'Harish Anand'], ['Ansari', 'Anand'],
  ['Dr John Bladen', 'Dr Jayant Bhosale'], ['John Bladen', 'Jayant Bhosale'], ['Bladen', 'Bhosale'],
  // team staff
  ['Amy Young', 'Amit Joshi'], ['Bevan Young', 'Anita Joshi'], ['Penny Wilson', 'Padma Iyer'],
  ['Jo Hood', 'Jyoti Havaldar'], ['Nikki Whitton', 'Nidhi Waingankar'], ['Jing Yi Wang', 'Jalpa Vyas'],
  ['Laziale Somerset', 'Leela Sawant'], ['Princess Gualini', 'Priya Gaikwad'], ['Charlotta Barfield', 'Charvi Bhatia'],
  ['Diana Lee', 'Divya Lele'], ['Maria Arboleda', 'Meera Arun'],
  // geography (after all specific strings)
  ['New Zealand', 'India'], ['new zealand', 'india'], ['New Zealanders', 'Indians'],
  ['Waikato', 'Maharashtra'], ['Hamilton', 'Mumbai'], ['Cambridge', 'Bandra'],
  ['Whanganui', 'Colaba'], ['Thames', 'Navi Mumbai'], ['Pukekohe', 'Thane'], ['Auckland', 'Mumbai'],
  ['Kiwis', 'Mumbaikars'],
];

const REGEX_TEXT = [
  [/\bACC\b/g, 'Insurance'],
  [/\bNZ\b/g, 'India'],
  [/\bNew Zealand\b/g, 'India'],
];

// first-name swaps only on surgeon pages (avoid collisions elsewhere)
const SURGEON_PAGES = new Set(['surgeons/index.html', 'surgeons/james-mckelvie/index.html', 'surgeons/ammar-binsadiq/index.html', 'surgeons/chris-pruet/index.html', 'surgeons/nicole-brandt/index.html', 'surgeons/harris-ansari/index.html', 'surgeons/dr-john-bladen/index.html', 'our-team/index.html', 'index.html']);
const FIRST_NAMES = [['James', 'Sanjay'], ['Ammar', 'Imran'], ['Chris', 'Vikram'], ['Nicole', 'Nikhita'], ['Harris', 'Harish']];

// attribute / href replacements
const ATTR = [
  ['tel:072420977', 'tel:+912240772222'], ['tel:07 242 0977', 'tel:+912240772222'],
  ['tel:080022827228', 'tel:18004252228'], ['tel:0800 CATARACT', 'tel:18004252228'],
  ['tel:0800228272', 'tel:18004252228'],
  ['mailto:info@eyesurgeons.co.nz', 'mailto:info@eyesurgeons.in'],
  ['mailto:referrals@eyesurgeons.co.nz', 'mailto:referrals@eyesurgeons.in'],
  // map directions coords
  ['-37.792351421679314,%20175.28217874110442', '19.0176,%2072.8478'],
  ['-37.88886174674595,%20175.4535246920758', '19.0544,%2072.8295'],
  ['-37.20422469498896,%20174.90937471476826', '19.1972,%2072.9722'],
  ['-39.934735301406334,%20175.05576677116488', '18.9220,%2072.8347'],
  ['-37.1402019,%20175.5420703', '19.3572,%2073.0016'],
];

function replaceInText(t, isSurgeonPage) {
  for (const [a, b] of TEXT) t = t.split(a).join(b);
  for (const [re, b] of REGEX_TEXT) t = t.replace(re, b);
  if (isSurgeonPage) for (const [a, b] of FIRST_NAMES) t = t.replace(new RegExp('\\b' + a + '\\b', 'g'), b);
  return t;
}

function processTag(tag) {
  for (const [a, b] of ATTR) tag = tag.split(a).join(b);
  // alt/title/aria-label/placeholder/content values may contain site words: run text repl on quoted attrs
  tag = tag.replace(/(alt|title|aria-label|placeholder|content)="([^"]*)"/g, (m, at, v) => `${at}="${replaceInText(v, false)}"`);
  // replace google maps embed iframes with query-based embed
  tag = tag.replace(/src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g, (m) => {
    const coordMap = [
      ['-37.7924', '19.0176,72.8478'], ['-37.889', '19.0544,72.8295'], ['-37.2042', '19.1972,72.9722'],
      ['-39.9346', '18.9220,72.8347'], ['-37.1404', '19.3572,73.0016'],
    ];
    for (const [needle, newc] of coordMap) if (m.includes(needle)) return `src="https://www.google.com/maps?q=${encodeURIComponent(newc)}&output=embed"`;
    return m;
  });
  return tag;
}

let files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory() && !e.name.startsWith('wp-')) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(SITE);

for (const f of files) {
  const rel = path.relative(SITE, f).replace(/\\/g, '/');
  const isSp = SURGEON_PAGES.has(rel);
  let html = fs.readFileSync(f, 'utf8');
  const parts = html.split(/(<[^>]*>)/);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) parts[i] = replaceInText(parts[i], isSp);
    else parts[i] = processTag(parts[i]);
  }
  fs.writeFileSync(f, parts.join(''));
}
console.log('indianized', files.length, 'pages');
