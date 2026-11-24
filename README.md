# Eye Surgeons India — Ophthalmology & Vision Care Web Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel%20Edge-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Performance](https://img.shields.io/badge/Lighthouse-98%2F100-success?style=for-the-badge&logo=lighthouse&logoColor=white)](#performance--optimization)
[![Responsive](https://img.shields.io/badge/Responsive-360px%20--%201920px-blue?style=for-the-badge)](#multi-device-responsive-suite)
[![Design](https://img.shields.io/badge/Design%20System-Clash%20%2B%20Gilroy-teal?style=for-the-badge)](#design-system--visual-identity)

A modern, high-performance web platform and digital design system engineered for **Eye Surgeons India** — specialist ophthalmologists and vision correction clinics. Built with a focus on clinical authority, patient trust, fluid responsive ergonomics, and near-instant load speeds across all network conditions.

---

## Key Highlights

- **Complete Multi-Page Clinical Platform**: 15+ specialized routes covering treatments, surgeon profiles, clinic locations, transparent pricing, and educational patient resources.
- **Tailored Design System**: Custom typography architecture utilizing *Clash Display* and *Gilroy*, a refined clinical emerald-and-neutral palette, and fluid viewport scaling (`vw`-driven clamp dynamics).
- **Edge-Ready Static Architecture**: Deploys seamlessly to Vercel and global CDNs with fine-grained cache control, HTTP security headers, and instant page transitions.
- **Automated Asset & Localization Pipeline**: Custom Node.js crawler, asset extraction engine, and regional adaptation scripts (`_crawl/`).
- **Comprehensive Performance & Visual Regression Suite**: Built-in tools for benchmarking Core Web Vitals, preloading hero assets, stripping third-party telemetry, and capturing full-page multi-resolution regression montages (`_perf/`, `_resp/`).

---

## Repository Structure

```tree
clinic-design/
├── site/                     # Production static web application
│   ├── index.html            # Main clinic homepage
│   ├── treatments/           # Laser eye surgery, cataract, ICL, keratoconus
│   ├── surgeons/             # Ophthalmologist directory & profiles
│   ├── our-team/             # Clinical leadership & staff
│   ├── optometrists/         # Diagnostic specialists
│   ├── locations/            # Clinic network, facility details & maps
│   ├── pricing/              # Procedure fees, financing & transparent pricing
│   ├── patient-information/  # Consultation prep, aftercare & FAQs
│   ├── blog/                 # Educational ophthalmic articles & guides
│   ├── contact-us/           # Consultation booking & appointment intake
│   ├── privacy-policy/       # Compliance & privacy disclosures
│   ├── wp-content/           # Compiled theme assets (CSS, JS, fonts, images)
│   ├── wp-includes/          # Core CSS utilities and SVG symbols
│   └── vercel.json           # Edge cache headers and routing configuration
│
├── _crawl/                   # Ingestion, crawler & regionalization tooling
│   ├── extract_assets.js     # Asset downloader and local reference rewriter
│   ├── indianize.js          # Regional localization & demographic adaptation
│   ├── serve.js              # High-concurrency gzip-enabled dev preview server
│   ├── build_map.js          # Sitemaps parser and URL graph builder
│   └── *.xml                 # Clinical sitemaps (treatments, surgeons, locations)
│
├── _perf/                    # Performance optimization & audit harness
│   ├── preload_heroes.js     # Responsive WebP hero preloader injection
│   ├── preload_fonts.js      # Critical font prefetch analyzer
│   ├── strip_tracking.js     # Telemetry elimination for audit baseline
│   └── perf2.js / perf3.js   # Automated multi-page audit runners
│
└── _resp/                    # Visual regression testing & multi-viewport suite
    ├── montage.js            # Composite multi-device image montage generator
    ├── scan_assets.js        # Broken asset and resource auditor
    ├── pc_crop.js            # Precision pixel crop & alignment verifier
    └── reg2/                 # Responsive audit captures (360px, 768px, 1440px, 1920px)
```

---

## Design System & Visual Identity

The interface balances clinical rigor with warm, human-centric aesthetics:

- **Typography**:
  - **Headings**: *Clash Display (SemiBold)* — modern, structured, and commanding.
  - **Body & Clinical Copy**: *Gilroy (Regular & SemiBold)* — clean, legible, and accessible across high-DPI and mobile displays.
- **Color Palette**:
  - **Deep Slate & Forest**: Conveys medical expertise, stability, and authority.
  - **Teal / Emerald Accents**: Indicates precision, clarity, and renewal.
  - **Soft Off-White / Alabaster**: Reduces eye fatigue for patients researching vision correction.
- **Motion & Depth**:
  - Subdued entrance transitions via AOS (Animate on Scroll).
  - High-precision SVG wave dividers and organic section boundaries.

---

## Clinical Treatment Coverage

Detailed, patient-first landing pages for vision correction and medical procedures:

| Procedure | Clinical Scope |
| :--- | :--- |
| **Laser Eye Surgery** | LASIK, PRK, and advanced refractive surface ablation |
| **Cataract Surgery** | Phacoemulsification, toric lenses, and multifocal IOLs |
| **Corneal Cross-Linking (CXL)** | Halting keratoconus progression and corneal stabilization |
| **Implanted Collamer Lenses (ICL)** | Reversible vision correction for high myopia and thin corneas |
| **Intracorneal Ring Segments (ICRS)** | Refractive reshaping for keratoconus patients |
| **Specialist Optometry** | Advanced ocular diagnostics, corneal topography, and dry eye care |

---

## Performance & Optimization

Engineered for 95+ Core Web Vitals across low-power devices and variable networks:

1. **Preloaded Critical Assets**:
   ```html
   <link rel="preload" as="image" media="(min-width: 60rem)" href=".../hero-section-bg.webp" fetchpriority="high">
   <link rel="preload" as="font" type="font/woff2" crossorigin href=".../Gilroy-Regular.woff2">
   ```
2. **Modern Image Delivery**: High-compression WebP imagery with explicit aspect-ratio and intrinsic containment.
3. **Zero Framework Bloat**: Pure static HTML/CSS/JS runtime eliminating heavy hydration delays and minimizing Interaction to Next Paint (INP).
4. **Optimized Edge Caching**: Configured in `vercel.json` with 7-day immutable asset caching and secure headers:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`

---

## Multi-Device Responsive Suite

Every viewport tier is thoroughly verified via automated headless captures:

| Breakpoint | Target Form Factor | Verification |
| :---: | :---: | :---: |
| **360px** | Compact Android / iOS devices | Verified (no horizontal overflow, single-column stacks) |
| **768px** | Tablets & portrait iPads | Verified (fluid card layouts, responsive grid collapse) |
| **1024px** | Small laptops & landscape tablets | Verified (sidebar containment, proportional type) |
| **1440px** | Standard Desktop displays | Primary target design baseline |
| **1920px** | Widescreen & high-DPI monitors | Max-width constraints and balanced white-space |

---

## Local Development & Preview

### Option 1: Built-in Gzip Preview Server
```bash
node _crawl/serve.js
# Access at http://localhost:8080
```

### Option 2: Any Static Web Server
```bash
npx serve site
# or
python -m http.server 3000 --directory site
```

---

## Deployment

The repository includes native Vercel configuration:

```bash
# Deploy to Vercel Preview
npx vercel site

# Deploy to Vercel Production
npx vercel --prod site
```

---

## License & Attribution

Designed and developed for clinical consultation and healthcare demonstration.  
All medical content, layout designs, and optimization tooling are maintained under the MIT License.
