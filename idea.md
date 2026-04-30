# Gopo — Market Validation & Investor Readiness Report

> **Product:** Face-recognition powered event photo delivery platform
> **Date:** April 2026
> **Status:** MVP Complete · Pre-Revenue · Pre-Launch

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What the Product Does](#2-what-the-product-does)
3. [The Problem & The Gap](#3-the-problem--the-gap)
4. [Market Sizing — TAM / SAM / SOM](#4-market-sizing--tam--sam--som)
5. [Competitive Landscape](#5-competitive-landscape)
6. [Business Model & Unit Economics](#6-business-model--unit-economics)
7. [Product-Market Fit Scorecard](#7-product-market-fit-scorecard)
8. [Technical Architecture Summary](#8-technical-architecture-summary)
9. [Investor Readiness](#9-investor-readiness)
10. [Fundraising Roadmap](#10-fundraising-roadmap)
11. [What to Fix — Priority Matrix](#11-what-to-fix--priority-matrix)
12. [The One-Line Pitch](#12-the-one-line-pitch)

---

## 1. Executive Summary

**Gopo is the GotPhoto for India.**

GotPhoto — a face-recognition school photo delivery platform — raised **$28M** and is valued at ~$150M in the US/Europe market. No equivalent product exists for India's **10 million annual weddings** and **2 million corporate events**.

Gopo solves a universal pain: guests at events never receive their photos. Photographers either manually sort thousands of images or dump everything into a WhatsApp group. Gopo replaces this with a QR code, a selfie, and an automatic personal gallery — delivered within hours of the event.

| Metric | Current State | Required to Raise |
|--------|--------------|-------------------|
| Paying Customers | 0 | 10+ |
| MRR | ₹0 | ₹30,000+ |
| Legal Compliance | Incomplete | DPDP/GDPR clean |
| Technical Scalability | Blocking issue | Async job queue |
| **Investor Readiness** | **3 / 10** | **7 / 10** |

**The idea is fundable. The product is not yet.**

---

## 2. What the Product Does

### Core Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GOPO CORE FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

  ADMIN (Photographer / Event Organizer)
  │
  ├── 1. Creates event on Gopo dashboard
  │        └── Gets a unique Event Code + QR code
  │
  ├── 2. Displays QR at venue (standee, invitation, screen)
  │
  └── 3. Uploads event photos after the event
           └── System auto-processes all faces


  GUEST
  │
  ├── 4. Scans QR code with phone
  │
  ├── 5. Enters name + email + takes selfie
  │        └── Selfie → 128-dimension face vector stored
  │
  └── 6. Receives email: "Your photos are ready"
           └── Opens personal gallery → downloads only their photos


  BEHIND THE SCENES (Face Matching Engine)
  │
  ├── For each uploaded photo:
  │     ├── Detect all faces (SSD MobileNet v1)
  │     ├── Extract face descriptor (128-dim vector)
  │     └── Compare against all registered guests (cosine distance < 0.6)
  │
  └── On match found:
        ├── Create Match record (photo ↔ guest)
        └── Queue "photos ready" email notification
```

### Feature Set

| Feature | Status | Description |
|---------|--------|-------------|
| QR Code Generation | ✅ Done | Unique per event, links to guest registration |
| Guest Selfie Registration | ✅ Done | Name + email + selfie → face descriptor stored |
| Batch Photo Upload | ✅ Done | Up to 300 photos per batch |
| Face Matching Engine | ✅ Done | TensorFlow.js + face-api, cosine distance |
| Personal Guest Gallery | ✅ Done | Guests see only their matched photos |
| ZIP Download | ✅ Done | Download all personal photos at once |
| Admin Dashboard | ✅ Done | Event management, guest list, upload history |
| Billing & Subscriptions | ✅ Done | Razorpay, 3 tiers, quota enforcement |
| Email Notifications | ✅ Done | Resend (primary) + Brevo (fallback) |
| Superadmin Panel | ✅ Done | Platform revenue & subscription oversight |
| Data Auto-Deletion | ✅ Done | Guest selfies deleted after 10 days |
| Async Job Queue | ❌ Missing | Placeholder only — critical gap |
| Biometric Consent UI | ❌ Missing | Schema ready, UI flow incomplete |
| Push Notifications | ❌ Missing | Future: Liveshot feature |

---

## 3. The Problem & The Gap

### The Problem

```
┌─────────────────────────────────────────────┐
│           THE CURRENT REALITY               │
│                                             │
│  Event ends                                 │
│      │                                      │
│      ▼                                      │
│  Photographer has 2,000 raw photos          │
│      │                                      │
│      ▼                                      │
│  Manually culls → 800 good photos           │
│      │                                      │
│      ▼                                      │
│  Tries to sort by person → HOURS of work    │
│      │                                      │
│      ▼                                      │
│  Dumps everything into WhatsApp group       │
│      │                                      │
│      ▼                                      │
│  Guests scroll through 800 photos           │
│  looking for themselves → GIVES UP          │
│                                             │
│  Result: 90% of event photos never          │
│  reach the right person.                    │
└─────────────────────────────────────────────┘
```

### The Gap in India

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GLOBAL MARKET COVERAGE                           │
├─────────────────┬───────────────────────────────────────────────────┤
│   MARKET        │   SOLUTION EXISTS?                                │
├─────────────────┼───────────────────────────────────────────────────┤
│ US School Photos│ ✅ GotPhoto ($28M raised, ~$150M valuation)       │
│ EU School Photos│ ✅ GotPhoto (European expansion)                  │
│ US/EU Weddings  │ ⚠️  Partial (Pixieset, Pic-Time — no face match) │
│ India Weddings  │ ❌ NO SOLUTION EXISTS                             │
│ India Corporate │ ❌ NO SOLUTION EXISTS                             │
│ India Schools   │ ❌ NO SOLUTION EXISTS                             │
└─────────────────┴───────────────────────────────────────────────────┘

                    ▲
                    │
              THIS IS GOPO'S ENTIRE PITCH
```

---

## 4. Market Sizing — TAM / SAM / SOM

### India Event Market

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INDIA ANNUAL EVENT VOLUME                        │
│                                                                     │
│   Weddings          ████████████████████████████  10,000,000       │
│   Corporate Events  ████████                       2,000,000       │
│   School Events     ██████████████                 4,000,000       │
│   Other Events      ████████████                   3,500,000       │
│                                              ──────────────         │
│   Total Events/Year                           19,500,000            │
│                                                                     │
│   Professional Photographers (active)              600,000          │
│   Tech-forward photographers (SAM target)           80,000          │
└─────────────────────────────────────────────────────────────────────┘
```

### TAM / SAM / SOM Funnel

```
                    ╔══════════════════════════════════╗
                    ║           TAM                    ║
                    ║   All Indian event photographers ║
                    ║       600,000 × ₹2,000/month     ║
                    ║      = ₹1,440 crore / year       ║
                    ╚══════════════════════════════════╝
                              │
                              ▼
               ╔══════════════════════════════╗
               ║            SAM               ║
               ║  Tech-forward photographers  ║
               ║   who already use software   ║
               ║   80,000 × ₹1,500/month      ║
               ║   = ₹145 crore / year        ║
               ╚══════════════════════════════╝
                          │
                          ▼
            ╔══════════════════════════════╗
            ║            SOM               ║
            ║   5% of SAM in 3–5 years     ║
            ║   4,000 customers            ║
            ║   × ₹1,500/month avg         ║
            ║   = ₹7.2 crore ARR           ║
            ╚══════════════════════════════╝
```

### Revenue Projection (If PMF is achieved)

```
Year    Customers   Avg MRR/customer   MRR          ARR
─────   ─────────   ────────────────   ─────────    ────────────
Y1          50           ₹1,200        ₹60,000      ₹7.2 lakh
Y2         300           ₹1,500        ₹4.5 lakh    ₹54 lakh
Y3       1,200           ₹2,000        ₹24 lakh     ₹2.88 crore
Y4       3,500           ₹2,500        ₹87.5 lakh   ₹10.5 crore
Y5       8,000           ₹3,000        ₹2.4 crore   ₹28.8 crore
```

---

## 5. Competitive Landscape

### Direct Competitors

| Product | Face Match | India | Price (USD) | Raised | Threat Level |
|---------|-----------|-------|-------------|--------|--------------|
| **GotPhoto** | ✅ Yes (schools) | ❌ No | $0–$200/mo | $28M | Low (different segment) |
| **Pixieset** | ❌ No | ❌ No | $8–$32/mo | Unknown | Medium (no face match) |
| **Pic-Time** | ❌ No | ❌ No | $7–$25/mo | Unknown | Low |
| **Facetag** | ✅ Yes | ❌ No | Enterprise | Unknown | Low (no India presence) |
| **Hapi** | ❌ No | ✅ Yes | Free | Small | Low (no face match) |
| **Google Photos** | Partial | ✅ Yes | Free | — | Medium (consumer only) |

### Positioning Matrix

```
                        HIGH AUTOMATION
                              │
                              │
              Gopo ●          │
           (target)           │
                              │
  INDIA ───────────────────── ┼ ──────────────────── GLOBAL
                              │
                   Hapi ●     │        ● GotPhoto
                              │        ● Facetag
                   Pixieset ● │
                              │
                        LOW AUTOMATION
                   (manual photo delivery)
```

### Why Gopo Wins

```
┌─────────────────────────────────────────────────────┐
│              GOPO vs. ALTERNATIVES                  │
│                                                     │
│  WhatsApp Group                                     │
│    ✗ Guests scroll 500+ photos                     │
│    ✗ Quality compressed                             │
│    ✗ No privacy                                     │
│                                                     │
│  Dropbox / Google Drive Link                        │
│    ✗ Still manual sorting required                 │
│    ✗ No face identification                         │
│    ✗ Guests get everything                          │
│                                                     │
│  Pixieset / Pic-Time                                │
│    ✓ Professional gallery                           │
│    ✗ No face matching                               │
│    ✗ Not India-focused                              │
│    ✗ INR billing unavailable                        │
│                                                     │
│  Gopo                                               │
│    ✓ Face recognition auto-delivery                 │
│    ✓ Guest gets only their photos                   │
│    ✓ India-first (INR, Razorpay)                    │
│    ✓ 10-day privacy deletion                        │
│    ✓ Works for weddings, corporate, schools         │
└─────────────────────────────────────────────────────┘
```

---

## 6. Business Model & Unit Economics

### Subscription Tiers (Current — Needs Revision)

```
┌──────────────────────────────────────────────────────────────────┐
│                   CURRENT PRICING (BROKEN)                       │
├──────────────┬──────────────┬───────────────┬────────────────────┤
│   Plan       │   Price      │   Photos/mo   │   Est. Cost/mo     │
├──────────────┼──────────────┼───────────────┼────────────────────┤
│   Basic      │   ₹100       │   500         │   ₹250–400         │  ← LOSS-MAKING
│   Pro        │   ₹999       │   2,000       │   ₹600–800         │  ← ~25% margin
│   Premium    │   ₹2,499     │   10,000      │   ₹1,500–2,500     │  ← ~0-40% margin
└──────────────┴──────────────┴───────────────┴────────────────────┘
```

### Recommended Repricing

```
┌──────────────────────────────────────────────────────────────────┐
│                   RECOMMENDED PRICING                            │
├──────────────┬──────────────┬───────────────┬────────────────────┤
│   Plan       │   Price      │   Photos/mo   │   Gross Margin     │
├──────────────┼──────────────┼───────────────┼────────────────────┤
│   Starter    │   ₹999       │   1,500       │   ~55%             │
│   Pro        │   ₹2,999     │   6,000       │   ~65%             │
│   Studio     │   ₹7,999     │   20,000      │   ~70%             │
└──────────────┴──────────────┴───────────────┴────────────────────┘

Why: Cloudinary storage + bandwidth for 500 photos alone costs ~₹200-400.
     The ₹100 Basic tier is burning money on every customer.
```

### Unit Economics (at recommended pricing)

```
  Revenue per Pro customer:     ₹2,999/month
  COGS (infra, Cloudinary):     ₹900/month
  Gross Profit:                 ₹2,099/month  (70% gross margin)

  Customer Acquisition Cost (estimated):
    Instagram/Facebook ads:     ₹300–500
    Word-of-mouth:              ₹0
    Target blended CAC:         ₹400

  LTV (Pro, 18-month avg retention):
    ₹2,099 × 18 months =        ₹37,782

  LTV : CAC ratio:              ~94x  ← Exceptional
```

### Revenue Scenarios

```
  Conservative (50 customers × ₹1,800 avg):    ₹90,000 MRR  = ₹10.8L ARR
  Base Case    (150 customers × ₹2,200 avg):   ₹3.3L MRR    = ₹39.6L ARR
  Optimistic   (500 customers × ₹2,500 avg):   ₹12.5L MRR   = ₹1.5Cr ARR
```

---

## 7. Product-Market Fit Scorecard

```
┌────────────────────────────────────────────────────────────────────┐
│                    PMF SCORECARD                                   │
├──────────────────────────────┬───────┬────────────────────────────┤
│ Dimension                    │ Score │ Evidence                   │
├──────────────────────────────┼───────┼────────────────────────────┤
│ Problem is real              │  9/10 │ Universal photographer pain │
│ Solution is 10x better       │  8/10 │ QR→selfie→gallery is magic │
│ Willingness to pay           │  7/10 │ Photographers already pay   │
│                              │       │ for Lightroom/Pixieset      │
│ Market size                  │  8/10 │ 600K photographers, growing │
│ Retention potential          │  8/10 │ Monthly subscription fits   │
│                              │       │ recurring event workflow    │
│ Competition (lack of)        │  9/10 │ No India face-match product │
│ Technical barrier to copy    │  6/10 │ face-api is open source;   │
│                              │       │ moat = data, not code       │
│ Legal / regulatory risk      │  2/10 │ Biometric = highest risk    │
│ Traction (current)           │  0/10 │ Zero paying users           │
│ Team (unknown)               │  ?/10 │ Cannot assess from code     │
├──────────────────────────────┼───────┼────────────────────────────┤
│ IDEA POTENTIAL               │ 7.5/10│ Genuinely fundable concept  │
│ CURRENT INVESTABLE STATE     │  3/10 │ Not yet                     │
└──────────────────────────────┴───────┴────────────────────────────┘
```

### PMF Signal: The 3 Questions Test

```
  1. "Would you be very disappointed if this product didn't exist?"
     Target: >40% of photographers say YES
     Current: Unknown (no user research done)

  2. "How did you discover us?"
     Target: Word-of-mouth > 30%
     Current: No users yet

  3. "What would you use instead?"
     Target: "Nothing good exists" or "I'd go back to WhatsApp"
     Current: Unknown (no user research done)

  → ACTION NEEDED: Interview 20 photographers in the next 2 weeks
```

---

## 8. Technical Architecture Summary

### System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      GOPO ARCHITECTURE                           │
└──────────────────────────────────────────────────────────────────┘

  ┌────────────────┐          ┌────────────────┐
  │   Next.js 16   │          │   Next.js 16   │
  │  Admin Panel   │          │  Guest Portal  │
  │  (App Router)  │          │  (App Router)  │
  └───────┬────────┘          └───────┬────────┘
          │                           │
          └──────────┬────────────────┘
                     │  HTTPS REST API
                     ▼
          ┌──────────────────────┐
          │    Express.js 5      │
          │    Node.js Backend   │
          │                      │
          │  ┌────────────────┐  │
          │  │  face-api.js   │  │     ┌──────────────┐
          │  │  TensorFlow.js │  │────▶│  Cloudinary  │
          │  │  (CPU-based)   │  │     │ (Image CDN)  │
          │  └────────────────┘  │     └──────────────┘
          │                      │
          │  ┌────────────────┐  │     ┌──────────────┐
          │  │    Mongoose    │  │────▶│   MongoDB    │
          │  │   ODM layer    │  │     │  (Database)  │
          │  └────────────────┘  │     └──────────────┘
          └──────────────────────┘
                     │
          ┌──────────┴──────────────────────┐
          │                                 │
          ▼                                 ▼
  ┌──────────────┐                ┌──────────────────┐
  │   Razorpay   │                │  Resend / Brevo  │
  │  (Payments)  │                │    (Emails)      │
  └──────────────┘                └──────────────────┘
```

### Face Matching Pipeline

```
  Admin uploads 300 photos
          │
          ▼
  [Multer] → Save to disk (/tmp)
          │
          ▼
  [face-api] Detect all faces in photo
          │
          ├── No face found → Skip photo
          │
          └── Face found → Extract 128-dim descriptor
                    │
                    ▼
          Compare descriptor against ALL registered guests
          (cosine distance threshold: 0.6)
                    │
                    ├── Distance < 0.6 → MATCH found
                    │         └── Create Match(photoId, guestId)
                    │         └── Queue "photos ready" email
                    │
                    └── Distance ≥ 0.6 → No match
                    │
                    ▼
          Upload photo to Cloudinary
          Store URL in MongoDB
          Delete temp file
```

### Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 16 |
| UI | TailwindCSS + Framer Motion | 4 / 12 |
| Backend | Express.js | 5.2 |
| Database | MongoDB + Mongoose | 9.2 |
| Face AI | face-api.js + TensorFlow.js Node | 1.7 / 4.22 |
| Image Storage | Cloudinary | API v2 |
| Payments | Razorpay | 2.9 |
| Email | Resend + Brevo | — |
| Error Tracking | Sentry (client + server) | 10.5 |
| Rate Limiting | express-rate-limit | 8.4 |

---

## 9. Investor Readiness

### What Investors Evaluate (and current scores)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INVESTOR EVALUATION MATRIX                         │
├─────────────────────────┬────────┬──────────┬──────────────────────┤
│ Criteria                │ Weight │  Score   │ Notes                │
├─────────────────────────┼────────┼──────────┼──────────────────────┤
│ Team                    │  25%   │   ?/10   │ Cannot assess        │
│ Market Size             │  20%   │   8/10   │ Large, proven by     │
│                         │        │          │ GotPhoto globally    │
│ Traction                │  25%   │   0/10   │ No users = critical  │
│ Product                 │  15%   │   6/10   │ Works, has gaps      │
│ Business Model          │  10%   │   5/10   │ Pricing broken       │
│ Technical Moat          │  5%    │   5/10   │ Data > code as moat  │
├─────────────────────────┼────────┼──────────┼──────────────────────┤
│ WEIGHTED SCORE          │  100%  │  ~4/10   │ Not fundable yet     │
│ (excluding team)        │        │          │                      │
└─────────────────────────┴────────┴──────────┴──────────────────────┘
```

### The 5 Hardest Investor Questions

**Q1: "How many paying customers do you have?"**
```
  Current:  Zero
  Required: "12 paying photographers, ₹45,000 MRR, 30% MoM growth"
```

**Q2: "Why won't Google Photos / WhatsApp do this?"**
```
  Current:  No clear answer
  Required: "Google solves personal albums, not B2B distribution workflows.
             Our product is a tool for event professionals with consent
             audit trails, quota billing, and batch processing — not
             a consumer app."
```

**Q3: "You store biometric face data — what's your legal exposure?"**
```
  Current:  Critical liability (consent UI missing, no Cloudinary DPA)
  Required: "Explicit biometric consent before every selfie capture.
             Auto-deletion after 10 days. DPDP-compliant consent
             versioning. Signed DPA with all data processors."
```

**Q4: "What happens at 10x scale?"**
```
  Current:  Server crashes (sync face matching in HTTP request)
  Required: "Face matching runs in async BullMQ job queue. HTTP
             returns immediately, processing happens in background
             workers. Horizontally scalable."
```

**Q5: "What's your GTM — how do you acquire photographers?"**
```
  Current:  No strategy documented
  Required: "Wedding photographer Facebook groups (500K+ India
             members), Instagram, and photography community
             partnerships. Target CAC < ₹500, LTV > ₹37,000."
```

### Comparable Exits & Benchmarks

| Company | Segment | Raised | Outcome |
|---------|---------|--------|---------|
| GotPhoto | School photos + face match | $28M | ~$150M valuation |
| Pixieset | Photo delivery (no face) | Bootstrapped | Profitable |
| Pic-Time | Photo galleries | Bootstrapped | Profitable |
| SmugMug | Photo hosting | Bootstrapped | Acquired Flickr |

**Key insight:** This is a bootstrappable business (Pixieset did it). But face-recognition infra requires more capital upfront, making it a better fit for seed funding.

---

## 10. Fundraising Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FUNDRAISING TIMELINE                                │
└─────────────────────────────────────────────────────────────────────────────┘

NOW (April 2026)
│
│  State: Working MVP, zero users, critical legal gaps
│  Raise: Not fundable
│  Focus: Fix security + legal issues
│
▼
─────────────────────── 2 MONTHS ───────────────────────
│
│  Milestone: Fix all 6 critical security issues
│             Complete biometric consent UI
│             Deploy publicly (clean URL)
│             Reprice tiers (remove ₹100 plan)
│
│  State: Legally safe to show, technically clean
│  Raise: Not yet (still no traction)
│
▼
─────────────────────── 4 MONTHS ───────────────────────
│
│  Milestone: 10 free events (offer to photographers)
│             5 paying customers
│             ₹10,000–₹30,000 MRR
│             First case study published
│
│  State: Early PMF signal
│  Raise: ₹25–75 lakh from angels / friends & family
│  Target: Angel investors, founder networks
│
▼
─────────────────────── 8 MONTHS ───────────────────────
│
│  Milestone: 50+ paying customers
│             ₹1–2 lakh MRR
│             Growing 15–20% MoM
│             Async job queue shipped
│
│  State: Clear PMF, scalable product
│  Raise: ₹1–2 crore Pre-Seed
│  Target: ah! Ventures, Venture Catalysts, Titan Capital
│
▼
─────────────────────── 14 MONTHS ──────────────────────
│
│  Milestone: 200+ customers
│             ₹5–8 lakh MRR
│             Cross-event "Memory Lane" feature live
│             Face identity data moat building
│
│  State: Strong growth, defensible data moat
│  Raise: ₹5–15 crore Seed
│  Target: Blume Ventures, Lightspeed Spark, Matrix Partners
│
▼
─────────────────────── 24 MONTHS ──────────────────────

  Milestone: 800+ customers
             ₹25+ lakh MRR
             Expand to schools segment
             SEA/Middle East expansion signal

  State: Category leader in India
  Raise: ₹25–50 crore Series A
  Target: Sequoia Surge, Peak XV, Accel
```

---

## 11. What to Fix — Priority Matrix

### Critical (Fix Before Showing Anyone)

```
┌───┬──────────────────────────────────┬───────────────────────────────────┐
│ # │ Issue                            │ Fix                               │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 1 │ Biometric consent UI missing     │ Add consent screen before selfie  │
│   │ (DPDP/GDPR violation)            │ capture. Store consentGivenAt +   │
│   │                                  │ consentVersion in DB (schema       │
│   │                                  │ already ready).                   │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 2 │ .env secrets in repository       │ Add .env to .gitignore, rotate    │
│   │ (Cloudinary, Razorpay, Resend    │ all keys, use environment-based   │
│   │  keys exposed)                   │ secret injection in deployment.   │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 3 │ Admin role elevation             │ Hash invite codes, mark as        │
│   │ (anyone can become admin)        │ single-use after registration.    │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 4 │ No DPA with Cloudinary           │ Sign Cloudinary Data Processing   │
│   │ (biometric images stored on      │ Agreement. Required for any       │
│   │  third-party without agreement)  │ biometric data under DPDP.        │
└───┴──────────────────────────────────┴───────────────────────────────────┘
```

### High Priority (Fix Before Launch)

```
┌───┬──────────────────────────────────┬───────────────────────────────────┐
│ # │ Issue                            │ Fix                               │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 5 │ Sync face matching will timeout  │ Implement BullMQ + Redis async    │
│   │ at scale (300 photos blocks      │ job queue. jobRunner.js is        │
│   │ HTTP request)                    │ already a placeholder — fill it.  │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 6 │ ₹100 Basic tier is loss-making   │ Remove Basic tier. Set minimum    │
│   │                                  │ at ₹999/month (Starter plan).     │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 7 │ Duplicate Match records possible │ Add unique compound index on      │
│   │ (no unique index on photoId +    │ Match(photoId, guestId).          │
│   │ guestId)                         │                                   │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 8 │ No input validation library      │ Add Zod or express-validator.     │
│   │                                  │ Basic string.trim() is not        │
│   │                                  │ sufficient for production.        │
└───┴──────────────────────────────────┴───────────────────────────────────┘
```

### Medium Priority (Fix Before Fundraising)

```
┌───┬──────────────────────────────────┬───────────────────────────────────┐
│ # │ Issue                            │ Fix                               │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│ 9 │ Zero automated tests             │ Add 20 integration tests (auth,   │
│   │                                  │ upload, matching, billing flows). │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│10 │ No GTM strategy                  │ Document photographer outreach:   │
│   │                                  │ Facebook groups, Instagram, local │
│   │                                  │ photography associations.         │
├───┼──────────────────────────────────┼───────────────────────────────────┤
│11 │ No privacy policy / ToS page     │ Write and publish privacy policy  │
│   │                                  │ (required for DPDP compliance     │
│   │                                  │ and App Store listings).          │
└───┴──────────────────────────────────┴───────────────────────────────────┘
```

---

## 12. The One-Line Pitch

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   "GotPhoto raised $28M making school photo delivery               │
│    automatic with face recognition — we're building               │
│    the same for India's 10 million annual weddings,               │
│    where no solution exists today."                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Zero-to-One Features (Differentiation Roadmap)

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Privacy Mode** | Face matching runs entirely in browser — no biometric data sent to server | Eliminates biggest legal risk; strongest differentiator |
| **Liveshot** | Push notification to guest the moment their face is matched in a newly uploaded photo | Real-time magic moment — no competitor has this |
| **Momento** | AI-generated 30-second personalized highlight reel per guest | Upsell opportunity; shareable content drives organic growth |
| **Memory Lane** | Cross-event timeline — guest sees their photos from all events they've attended | Creates data moat; harder to replicate than any code |
| **Smart Album** | Guests contribute their own photos; auto-tagged with detected faces | Community feature; increases content per event |

### The Defensible Moat

```
  TODAY:          Code is the product  (face-api is open source)

  YEAR 1–2:       Data is the moat
                  ┌─────────────────────────────────────────┐
                  │  Every guest who registers on Gopo       │
                  │  builds a cross-event identity layer.    │
                  │  Their face descriptor + email creates   │
                  │  a portable identity that makes          │
                  │  "Memory Lane" possible — and that       │
                  │  dataset cannot be replicated            │
                  │  by a new entrant.                       │
                  └─────────────────────────────────────────┘

  YEAR 3+:        Network is the moat
                  More events → more guests → more photographers
                  attracted → more events (flywheel)
```

---

*Report generated: April 2026*
*Based on codebase analysis of Gopo v1.0 MVP*
*Internal use only — not for external distribution*
