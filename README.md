# Trustidy

Trustidy is a web app that scans e-commerce sites and product listings and returns a trust score based on real, verifiable signals — domain age, SSL certificate info, review authenticity heuristics, red-flag language, and more. Just paste a link, then get a report.

Built as a portfolio project to learn Docker, SQL.

## Tech stack

- **Frontend:** React + Vite + Tailwind CSS v4, React Router
- **Backend:** Node.js (plain JavaScript, ES modules) + Express
- **Database:** PostgreSQL via Prisma ORM, running in Docker
- **Caching:** Redis, running in Docker
- **Browser automation:** Playwright, used selectively as a fallback for JavaScript-rendered content

## What it checks

### Site scans (`SiteScan`)

- Domain age and registrar, via RDAP
- SSL certificate issuer, via a raw TLS handshake
- Instagram presence and social profile count, via JSON-LD structured data
- Google Safe Browsing flags (malware, phishing, etc.)
- A representative preview image (`og:image`)
- A computed trust score and scan status

### Listing scans (`ListingScan`)

- Current price, scraped from product structured data
- Self-computed price history (low/high), built from Trustidy's own accumulated scan history — no free third-party price-history API exists, so this grows more useful the more the tool is used
- Red-flag language detection (urgency phrases, missing return policy)
- Review count, average rating, and two heuristics: suspicious review-date clustering and a "generic review" score
- Product images (multiple, where the source provides them)
- A listing-specific trust score and scan status

### Marketplace integrations

- **Etsy:** full official API integration (listings, images, shop reviews) — no scraping involved
- **Everything else:** a generic scraper pipeline (structured data first, Playwright as a fallback for JS-rendered content like reviews)

## Architecture notes worth knowing

- **Redis caches `SiteScan` results** by URL for one hour, so repeated scans of the same domain don't re-run every check.
- **Results pages are fetched by database ID**, not passed through client-side navigation state — this makes scan results genuinely shareable and bookmarkable links, not just session-local.
- **The listing-vs-site detection, and the Etsy-vs-generic routing**, both happen by pattern-matching the URL — no manual mode selection required from the user.
- **Review heuristics use a tiered fallback**: structured page data first (fast, free), then a Playwright-based discovery of a site's underlying review API (e.g. PowerReviews) if the fast path comes up short, pulling a much larger, more statistically meaningful sample of real reviews.

## Known limitations (deliberate, documented tradeoffs)

Several signals and marketplaces were investigated and intentionally left out, rather than built on fragile or questionable foundations:

- **Amazon, eBay, Grailed, and Depop are unsupported.** All four run aggressive anti-bot protection that actively blocks automated access (confirmed via direct testing, not assumption). Rather than fight it with proxies or workarounds, these are documented as out of scope.
- **Trustpilot-style review aggregation isn't supported.** No free API exists; Google Safe Browsing was built instead as the project's external trust-validation signal.
- **Reverse image search isn't supported.** No provider (Google, Bing, TinEye, Yandex) offers a free API for this.
- **Some `SiteScan` fields are always null:** `registrarCountry` (RDAP redacts this under GDPR) and `instagramFollowers` (no free source for an arbitrary account's follower count exists).

## Getting started locally

### Prerequisites

- Node.js
- Docker Desktop

### Setup

```bash
# Clone the repo
git clone <(https://github.com/iZ-X/Trustidy..git)>
cd trustidy

# Start Postgres and Redis
docker compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
node index.js

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Environment variables

Create `backend/.env` and `frontend/.env` using the `.env.example` files as a template. You'll need:

- A Postgres connection string (matches your `docker-compose.yml` credentials)
- A Google Safe Browsing API key (free)
- An Etsy API key and shared secret (free)

## Project status

Core functionality is complete: both scan types work end-to-end, the frontend is fully responsive, and the Etsy integration is live. Not yet deployed to a public host.
