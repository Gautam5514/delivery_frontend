# Gopo (QRScan) — Full-Stack Security & Improvement Report
### YC Combinator Readiness Audit · April 2026

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Priority Matrix (Chart)](#2-priority-matrix-chart)
3. [Critical Security Vulnerabilities](#3-critical-security-vulnerabilities)
4. [API Hardening Checklist](#4-api-hardening-checklist)
5. [Frontend Security Checklist](#5-frontend-security-checklist)
6. [Data & Privacy Compliance (GDPR / DPDP)](#6-data--privacy-compliance-gdpr--dpdp)
7. [Reliability & Scalability Gaps](#7-reliability--scalability-gaps)
8. [Missing Infrastructure](#8-missing-infrastructure)
9. [Unique Feature Opportunities (Zero-to-One Ideas)](#9-unique-feature-opportunities-zero-to-one-ideas)
10. [YC Combinator Readiness Score](#10-yc-combinator-readiness-score)

---

## 1. Executive Summary

Gopo is a face-recognition-powered event photo delivery platform. Guests scan a QR code, take a selfie, and instantly receive all event photos they appear in. The core concept is strong and the MVP works end-to-end. However, before a YC interview or production launch, **six critical security holes must be closed** and a set of reliability gaps need to be filled. Additionally, three "zero-to-one" feature ideas are proposed that no competitor currently ships.

---

## 2. Priority Matrix (Chart)

```
IMPACT
  │
  │  ██████████████████████████   ████████████████
  │  [C1] Role self-registration  [C2] No rate limiting
  │
  │  ██████████████   ██████████  ████████████████
  │  [C3] Superadmin  [C4] Token  [C5] .env in repo
  │  plain-text pwd   in LS/XSS
  │
  │  ██████████       ████████    ████████
  │  [H1] No input   [H2] Photo  [H3] Dupe
  │  validation      size limit  matches
  │
  │  ████████         ██████      ████
  │  [M1] No tests   [M2] No     [M3] No
  │                  monitoring  job queue
  │
  └──────────────────────────────────────────────────────── EFFORT
     LOW                 MEDIUM                  HIGH
```

### Severity Legend

| ID  | Area                             | Severity   | Effort | Priority |
|-----|----------------------------------|------------|--------|----------|
| C1  | Any user can self-register as admin | 🔴 Critical | Low    | Fix NOW  |
| C2  | No rate limiting on any endpoint | 🔴 Critical | Low    | Fix NOW  |
| C3  | Superadmin password in plain text | 🔴 Critical | Low    | Fix NOW  |
| C4  | Auth tokens stored in localStorage | 🔴 Critical | Medium | Fix NOW  |
| C5  | `.env` with live secrets in repo | 🔴 Critical | Low    | Fix NOW  |
| C6  | Biometric data — no consent flow  | 🔴 Critical | Medium | Fix NOW  |
| H1  | No input validation / sanitization | 🟠 High   | Medium | Sprint 1 |
| H2  | No file size limit on photo uploads | 🟠 High   | Low    | Sprint 1 |
| H3  | Cloudinary secrets in frontend .env | 🟠 High   | Low    | Sprint 1 |
| H4  | Duplicate match records possible  | 🟠 High    | Low    | Sprint 1 |
| H5  | Guest registration — no event validation | 🟠 High | Low  | Sprint 1 |
| M1  | Zero automated tests              | 🟡 Medium  | High   | Sprint 2 |
| M2  | No monitoring / alerting          | 🟡 Medium  | Medium | Sprint 2 |
| M3  | Async job queue unimplemented     | 🟡 Medium  | High   | Sprint 2 |
| M4  | No unique DB indexes (event code, guest) | 🟡 Medium | Low | Sprint 1 |
| L1  | No HTTPS enforcement at app layer | 🟢 Low     | Low    | Sprint 2 |
| L2  | No API versioning (`/api/v1/`)    | 🟢 Low     | Low    | Sprint 2 |
| L3  | No structured logging             | 🟢 Low     | Low    | Sprint 2 |

---

## 3. Critical Security Vulnerabilities

### C1 — Anyone Can Register as Admin (Role Elevation)
**File:** `backend/controllers/authController.js` lines 50-55  
**Problem:** The signup endpoint reads `role` directly from `req.body`. A user posting `{ "role": "admin" }` immediately gets admin access. The `ADMIN_INVITE_CODE` environment variable is defined but **never checked**.

**Fix Required:**
- Remove `role` from the fields that can be set via API body
- Enforce invite code: hash invite codes at rest, accept them at signup, mark them used
- Default all signups to `role: "user"` and only elevate via a superadmin action

---

### C2 — No Rate Limiting on Any Endpoint
**File:** `backend/index.js` (missing)  
**Problem:** Every endpoint — login, guest registration, photo upload, payment creation — has no rate limit. An attacker can:
- Brute-force the login endpoint indefinitely
- Flood the face-matching pipeline with junk images (expensive CPU)
- Exhaust Razorpay API quotas
- Generate thousands of duplicate guests

**Fix Required:**
- Add `express-rate-limit` globally (100 req/15 min per IP as baseline)
- Tighter limits on sensitive routes: login (5/min), signup (3/min), photo upload (10/min)
- Use Redis-backed store (`rate-limit-redis`) for multi-instance deployments

---

### C3 — Superadmin Credentials Are Stored and Compared in Plain Text
**File:** `backend/controllers/superadminController.js` line 23  
**Problem:** Superadmin login compares passwords with `===` directly against `process.env.SUPERADMIN_PASSWORD`. No hashing, no salt, no timing-safe comparison. This means:
- Plain-text password visible in any process dump, log output, or env inspection
- No protection against timing attacks on this most privileged account

**Fix Required:**
- Hash the superadmin password with `scrypt` at startup and compare with `timingSafeEqual`
- Or better: store superadmin as a proper DB record with the same hashed-password flow used for regular users
- Add brute-force protection (3 failures → 15 min lockout)

---

### C4 — Auth Tokens Stored in localStorage (XSS Vulnerability)
**Files:** `frontend/app/utils/api.js` lines 2-4  
**Problem:** Both `authToken` and `superadminToken` are stored in `localStorage`. Any XSS injection in the app — through a third-party script, a malicious photo filename, or a future partner widget — can steal all tokens silently.

**Fix Required:**
- Move tokens to `HttpOnly; Secure; SameSite=Strict` cookies (server-set, not JS-accessible)
- If SSR cookie approach adds complexity, at minimum move to `sessionStorage` and add strict CSP headers
- Add a Content-Security-Policy header to block inline scripts and untrusted origins

---

### C5 — Live Secrets in the Repository
**File:** `backend/.env` and `frontend/.env`  
**Problem:** Both `.env` files are sitting in the working directory (not in `.gitignore` reliably) and contain Cloudinary API keys, Razorpay keys, Resend API key, MongoDB connection string, and the superadmin password. If pushed to any git remote or shared with a collaborator, all credentials are compromised.

**Fix Required:**
- Confirm `.env` is in `.gitignore` for both `backend/` and `frontend/`
- Run `git log -- '*.env'` to verify it was never committed historically
- Rotate all secrets immediately (new Cloudinary API key, new Razorpay key, new Resend key, new `AUTH_SECRET`, new `SUPERADMIN_PASSWORD`)
- Use a secrets manager (Railway environment variables, Doppler, AWS Secrets Manager) rather than `.env` files in production
- Remove Cloudinary credentials from `frontend/.env` entirely — the frontend should never hold server-side API secrets

---

### C6 — Biometric Face Data With No Consent Flow
**Files:** `backend/controllers/guestController.js`, `backend/services/faceService.js`  
**Problem:** Face descriptors (128-float biometric vectors) are extracted from guest selfies and stored in MongoDB with no:
- Explicit consent screen or checkbox before selfie capture
- Data processing disclosure
- Opt-out or deletion mechanism exposed to guests
- Mention of data retention period at point of collection

**Legal Risk:** In India, the Digital Personal Data Protection Act (DPDP) 2023 classifies face data as sensitive personal data. In the EU, GDPR Article 9 applies. Collection without informed consent is unlawful in most jurisdictions.

**Fix Required:**
- Add a consent screen before selfie capture with: data purpose, retention period (currently 10 days), right to delete, and a mandatory checkbox
- Add a guest-accessible `/delete-my-data` endpoint
- Display "Your face data is automatically deleted after X days" on the registration page
- Store consent timestamps and versions in the Guest model

---

## 4. API Hardening Checklist

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | No input validation library | All controllers | Add Zod or express-validator; validate every `req.body` field |
| 2 | No photo upload file size limit | `backend/routes/adminRoutes.js:8` | Add `limits: { fileSize: 15 * 1024 * 1024 }` to multer |
| 3 | No selfie file size limit | `backend/routes/guestRoutes.js` | Add `limits: { fileSize: 5 * 1024 * 1024 }` |
| 4 | No file type validation on photo upload | `adminController.js` | Check `mimetype` starts with `image/` before processing |
| 5 | Duplicate Match records possible | `adminController.js` (matching loop) | Add unique compound index `{photoId, guestId}` on Match model; use `upsert` |
| 6 | Guest registration accepts nonexistent eventId | `guestController.js:28` | Look up Event by code before creating Guest; return 404 if not found |
| 7 | Event code has no unique index | `backend/models/Event.js` | Add `unique: true` to `code` field |
| 8 | Guest has no unique index on (email, eventId) | `backend/models/Guest.js` | Add compound unique index; use `findOneAndUpdate` with upsert |
| 9 | `getMatches` admin endpoint takes raw email param | `guestRoutes.js:17` | Validate email format; sanitize before DB query |
| 10 | No HMAC algorithm pinned in token verification | `middleware/auth.js` | Explicitly reject tokens with unexpected algorithms |
| 11 | No CSRF protection on state-mutating endpoints | `backend/index.js` | Add `csurf` or use `SameSite=Strict` cookie tokens |
| 12 | Webhook endpoint has no IP allowlist | `billingController.js:200` | Whitelist Razorpay's published IP ranges |
| 13 | Error messages leak stack traces | All controllers | Add global error handler; never expose `err.stack` in responses |
| 14 | No request ID / correlation ID | `backend/index.js` | Add `x-request-id` header on every response for debuggability |
| 15 | MongoDB connection string has no auth source | `backend/.env` | Ensure connection string uses a least-privilege DB user, not root |
| 16 | No API versioning | All routes | Prefix all routes with `/api/v1/`; plan for `/v2/` |
| 17 | `matchService.js` and `jobRunner.js` are empty | `backend/services/`, `backend/workers/` | Either implement or remove dead files; they create false confidence |
| 18 | No graceful shutdown | `backend/index.js` | Handle `SIGTERM`/`SIGINT` to drain in-flight requests before closing DB |

---

## 5. Frontend Security Checklist

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | Tokens in localStorage | `app/utils/api.js:2-4` | Move to HttpOnly cookies (see C4 above) |
| 2 | No Content-Security-Policy header | `next.config.js` (missing) | Add CSP via `next.config.js` `headers()` |
| 3 | Razorpay script loaded from CDN without SRI | `app/utils/razorpay.js` | Add `integrity` + `crossOrigin` attributes to the dynamically loaded script |
| 4 | No environment-based API URL validation | `app/utils/api.js` | Throw at startup if `NEXT_PUBLIC_API_URL` is undefined or malformed |
| 5 | Admin role check is client-side only | `app/admin/layout.js:34-38` | Server-side route protection via Next.js middleware (`middleware.ts`) |
| 6 | Superadmin panel served from same origin | `app/superadmin/` | Host superadmin on a separate subdomain or path protected by VPN/IP whitelist |
| 7 | No loading skeleton / error boundaries | All pages | Add React error boundaries to prevent full-page crashes from API failures |
| 8 | Photo download uses GET with token in URL | `app/gallery/page.js` | Ensure token is always in Authorization header, never query string |
| 9 | No logout on all tabs | `app/utils/api.js` | Use BroadcastChannel API to sync logout across browser tabs |
| 10 | Face selfie captured client-side with no size/quality check | `app/register/page.js` | Validate image dimensions and file size before upload |
| 11 | No HTTPS redirect at app level | (missing) | Add Next.js middleware to redirect HTTP to HTTPS |
| 12 | `NEXT_PUBLIC_*` vars are client-exposed | `frontend/.env` | Audit all `NEXT_PUBLIC_` vars; never prefix server secrets with this |

---

## 6. Data & Privacy Compliance (GDPR / DPDP)

This section is **especially important for YC** — international investors will ask about this directly because face biometric data is the highest-risk category of personal data globally.

| Requirement | Status | What to Do |
|-------------|--------|------------|
| Informed consent before biometric processing | ❌ Missing | Add consent checkbox + privacy notice before selfie capture |
| Right to erasure (delete my data) | ❌ Missing | Add `DELETE /api/guests/me` endpoint; delete from Cloudinary + MongoDB |
| Data retention notice | ⚠️ Partial | Cleanup service exists (10 days) but is never disclosed to users |
| Privacy policy | ❌ Missing | Write and link a privacy policy covering face data, retention, third-party processors |
| Data processing agreement with Cloudinary | ❌ Unknown | Cloudinary processes and stores face images — DPA required under GDPR |
| Consent for marketing emails | ❌ Missing | Onboarding + "photos ready" emails sent without explicit opt-in |
| Data portability | ❌ Missing | Guests cannot export their own data |
| Breach notification procedure | ❌ Missing | Define and document a breach response plan |

---

## 7. Reliability & Scalability Gaps

### Synchronous Face Matching is a Bottleneck
**Problem:** When an admin uploads photos, face matching runs **synchronously in the HTTP request** (`adminController.js`). Uploading 50 photos with face detection + matching can take 30-120 seconds. This:
- Times out on slow connections
- Blocks the Node.js event loop
- Cannot scale past a single server
- Has no progress feedback to the admin

**Fix:** Implement the job queue that is already architecturally documented but has empty files. Use BullMQ + Redis. Return a `jobId` immediately and let the admin poll or receive a WebSocket push when matching completes.

### No Database Indexes on Critical Query Paths
Missing indexes that will cause full collection scans at scale:

| Collection | Missing Index | Query Pattern |
|------------|---------------|---------------|
| `matches` | `{ guestId: 1 }` | Gallery page loads |
| `matches` | `{ photoId: 1, guestId: 1 }` (unique) | Duplicate prevention |
| `photos` | `{ eventId: 1, processed: 1 }` | Matching trigger |
| `guests` | `{ email: 1, eventId: 1 }` (unique) | Registration check |
| `events` | `{ code: 1 }` (unique) | All event lookups |
| `downloadlogs` | `{ guestId: 1, createdAt: -1 }` | Download stats |

### Single MongoDB Node
The app connects to a single MongoDB URI. In production this should be:
- MongoDB Atlas with a 3-node replica set
- Write concern `majority` on critical writes (payments, subscriptions)
- Connection pool tuning (`maxPoolSize: 10`)

### No Health Check Beyond `/`
The `/` route returns "API Running" but doesn't verify DB connectivity, Cloudinary connectivity, or Redis (when added). Implement a proper `GET /api/health` that checks all downstream dependencies and returns structured JSON.

---

## 8. Missing Infrastructure

| Infrastructure | Status | Recommended Tool |
|----------------|--------|------------------|
| Automated tests (unit + integration) | ❌ None | Jest + Supertest for backend; Playwright for E2E |
| CI/CD pipeline | ❌ None | GitHub Actions: lint → test → deploy on push to main |
| Structured logging | ❌ None | Winston or Pino with JSON output; ship to Datadog / Axiom |
| Error tracking | ❌ None | Sentry (free tier covers MVPs) |
| Uptime monitoring | ❌ None | Better Uptime or Checkly (ping every 60s) |
| Background job queue | ❌ Empty files | BullMQ + Redis |
| CDN for frontend | ❌ None | Vercel handles this; ensure `Cache-Control` headers are correct |
| Database backups | ❌ Unknown | Atlas automated backups or `mongodump` cron |
| API documentation | ❌ None | Swagger/OpenAPI auto-generated from route definitions |
| Secret rotation policy | ❌ None | Rotate all secrets every 90 days; use a secrets manager |

---

## 9. Unique Feature Opportunities (Zero-to-One Ideas)

These are features that **no current competitor** (Pixilart, Fotomerge, PhotoMigo, Pic.Me) ships today. These would differentiate Gopo at a YC interview.

---

### Idea 1 — "Liveshot": Real-Time Match Notifications via Push
**What:** When an admin uploads a batch of photos and face matching completes, each guest whose face was found receives a **mobile push notification** instantly — even if they've closed the browser tab.

**Why it's different:** Every competitor requires guests to manually revisit the gallery link. Gopo would be the only platform where photos find *you*, not the other way around.

**How:** Service Workers + Web Push API (VAPID keys). Add a `pushSubscription` field to the Guest model. After matching, call `web-push` for each matched guest. Zero dependency on a mobile app.

---

### Idea 2 — "Privacy Mode": On-Device Face Matching (No Biometric Server Storage)
**What:** Run `face-api.js` entirely in the browser using WebGL. The guest's face descriptor is computed on their device and sent to the server as a floating-point vector — the **raw selfie photo is never uploaded**.

**Why it's different:** Eliminates the most legally sensitive part of the data flow (server-stored selfie images). No competitor offers this. "Your face never leaves your phone" is a compelling marketing claim that directly addresses the #1 guest concern at events.

**How:** Port `@vladmandic/face-api` to run in the browser (it already supports this). Replace the `POST /guests/register` multipart upload with a JSON body containing only the 128-float descriptor array. Delete the Cloudinary selfie storage path entirely for guests who use this mode.

**Compliance bonus:** Eliminates the need for a Data Processing Agreement with Cloudinary for guest biometrics.

---

### Idea 3 — "Momento": AI-Generated Personalized Event Highlight Reels
**What:** After an event, each guest receives a 30-second vertical video of only the photos they appear in, set to music, auto-generated and shareable to Instagram/WhatsApp.

**Why it's different:** Photo delivery is a commodity. A personalized video highlight reel is shareable content — guests post it, which becomes organic marketing for Gopo and for the event organizer. No competitor does per-guest video generation.

**How:** Use FFmpeg (already available in Node.js via `fluent-ffmpeg`) to stitch matched photos into a slideshow video with a Ken Burns effect. Add a royalty-free music track. Generate asynchronously via the job queue (Idea from Section 7). Deliver via a time-limited shareable link.

**Monetization:** Charge admins per video generation as an add-on. Or include X videos in the Pro plan.

---

### Idea 4 — "Smart Album": Guests Can Contribute Their Own Photos
**What:** Allow guests to upload photos they took at the event. Face matching then **automatically tags everyone in those guest photos** and notifies those people — turning every guest into a photographer.

**Why it's different:** Solves the "dark side of the room" problem where the official photographer missed half the event. No competitor treats guests as contributors.

**How:** Add a `POST /api/guests/contribute-photo` endpoint. Run the same face detection + matching pipeline on guest-uploaded photos. Add a `source: "guest"` flag on Photo documents. Show guest-contributed photos in a separate tab in the gallery.

---

### Idea 5 — "Memory Lane": Cross-Event Guest Timeline
**What:** Guests who attend multiple events by different organizers using Gopo get a private timeline of all event photos they've appeared in, across all events — like a personal photo journal tied to their face identity.

**Why it's different:** Turns Gopo from a per-event tool into a lifelong personal photo archive. Massive retention mechanism. No competitor builds a cross-event identity layer.

**How:** Use the guest's email as the cross-event identity key. Build a `GET /api/guests/timeline` endpoint that returns matches across all events. Add privacy controls: guests can opt out of cross-event linking per-event.

**Data moat:** Every event adds to each guest's profile, making Gopo increasingly valuable the more events use it.

---

## 10. YC Combinator Readiness Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Core idea / market insight** | 9/10 | Strong. QR → face match → instant delivery is genuinely useful |
| **Working product** | 7/10 | End-to-end flow works; sync matching is a scale problem |
| **Security posture** | 2/10 | 6 critical vulnerabilities; role elevation alone is disqualifying |
| **Privacy / legal compliance** | 1/10 | Biometric data with no consent — highest legal risk category |
| **Scalability architecture** | 4/10 | Will break under load; no job queue, no indexes, sync matching |
| **Observability** | 1/10 | No logs, no metrics, no error tracking, no tests |
| **Product differentiation** | 6/10 | Good core; no features that competitors couldn't clone in a sprint |
| **Monetization** | 7/10 | Razorpay integration works; plans are well-structured |

### Overall: 4.6 / 10 — **Not ready to pitch. Fix Critical issues first.**

### Minimum Bar to Pitch YC
1. ✅ Close all 6 Critical vulnerabilities (C1–C6) — estimated 3-5 days
2. ✅ Add consent flow for biometric data — estimated 1 day
3. ✅ Add rate limiting + input validation — estimated 1-2 days
4. ✅ At least one of the Zero-to-One features (recommend: Privacy Mode or Live Notifications)
5. ✅ Basic error tracking (Sentry) and uptime monitoring

After those 5 items, the security and differentiation story becomes fundable.

---

*Report generated: April 2026 | Scope: full codebase audit of /QRScan (backend + frontend)*
