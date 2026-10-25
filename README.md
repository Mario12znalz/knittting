# Threadkind storefront

A responsive Next.js storefront concept for knitting and crochet accessories, prepared for a MedusaJS backend.

## Requirements
- Node.js 20+
- A running MedusaJS backend
- A Medusa publishable API key and region ID for live product catalogue data

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## Connect Medusa
Set these values in `.env.local`:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: your backend URL (for example `http://localhost:9000`)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: a publishable API key created in Medusa Admin
- `NEXT_PUBLIC_MEDUSA_REGION_ID`: the region used for storefront pricing

When configured, the homepage requests products from `/store/products`; otherwise it displays sample products for design preview.

## Important launch status
This is a storefront starter, not a complete production checkout. The shopping bag is currently client-side demo state. Before accepting orders, implement Medusa cart creation, line-item updates, shipping options, payment-session creation, and order completion using the official Medusa Store API/JS SDK. Configure and test a payment provider, shipping, taxes, privacy/cookie notices, and returns policy before launch.

## Deployment
Deploy the Next.js app to a host that supports Next.js (such as Vercel) and configure the environment variables in its project settings. Keep secret backend/admin keys out of any `NEXT_PUBLIC_*` variable; only the publishable key belongs in the browser.
