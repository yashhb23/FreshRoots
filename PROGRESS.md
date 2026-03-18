# FreshRoots — Progress Tracker

> This file is the single source of truth for what has been implemented, what is in progress, and what remains. Updated after every phase.

---

## Project Overview

**FreshRoots** is a Mauritius-based fresh vegetable marketplace.
- **Backend:** NestJS + Prisma + PostgreSQL (deployed on Railway & Abacus AI)
- **Mobile:** React Native (no Expo) with React Navigation, Firebase Auth
- **Repo:** Monorepo — `fresh_roots_backend/` and `fresh_roots_mobile/`

---

## Completed Work

### Backend — Feature 1: Advanced Filters ✅
- `minPrice`, `maxPrice`, `inStockOnly`, `sortBy` query params on `GET /api/listings`
- `sortBy` options: `price_asc`, `price_desc`, `created_desc`, `popular`
- Full DTO validation + Swagger annotations
- **Files:** `query-listings.dto.ts`, `listings.service.ts`, `listings.controller.ts`

### Backend — Feature 2: Popularity Tracking ✅
- `view_count`, `order_count`, `popularity_score`, `last_ordered_at` fields on `listings`
- Auto-increment `view_count` on `findOne()`
- Auto-increment `order_count` + set `last_ordered_at` in `orders.service.ts create()`
- `recalculateAllPopularity()` method + admin endpoint `POST /api/listings/admin/recalculate-popularity`
- `sortBy=popular` now sorts by `popularity_score desc`
- **Files:** `schema.prisma`, `listings.service.ts`, `listings.controller.ts`, `orders.service.ts`

### Backend — Feature 3: Location Management ✅
- `delivery_address`, `delivery_district`, `delivery_city`, `delivery_postal_code` on `users`
- `UpdateLocationDto` with validation
- `PATCH /api/auth/me/location` endpoint
- `getCurrentUser` now returns delivery fields
- **Files:** `schema.prisma`, `update-location.dto.ts`, `auth.service.ts`, `auth.controller.ts`

### Mobile — UI Redesign (Home + Product Detail) ✅
- Complete visual overhaul of HomeScreen and ProductDetailScreen
- New components: `ProductCard`, `CategoryChip`
- Design system: theme, spacing, typography, borderRadius, shadows

### Mobile — Auth & Registration ✅
- Firebase Google Sign-In
- Buyer/Seller role selection on registration
- Friendly login error messages

### Mobile — Chat Screen ✅
- Message Seller button on Cart
- Conversation screen with keyboard handling

### Deployment ✅
- Railway deployment working (multi-stage Docker, prisma db push on start)
- Abacus AI deployment working
- Firebase configured

---

## Current Phase: Mobile Integration (Features 1-3)

### Phase Status

| Task | Status | Notes |
|------|--------|-------|
| Update mobile types + API services | Pending | Listing/User types, new API params |
| FiltersModal component | Pending | Wire to HomeScreen filter button |
| Popular products section | Pending | Separate API call with sortBy=popular |
| EditAddressScreen | Pending | Profile + Checkout integration |
| Push mobile integration | Pending | Single commit for all mobile Feature 1-3 work |

---

## Remaining Phases

### Phase 4: Rate Limiting
- Install `@nestjs/throttler`
- Global rate limit + stricter limits on auth endpoints
- Push to GitHub

### Phase 5: Analytics Events
- `search_performed`, `filter_applied`, `product_viewed` PostHog events
- Backend + mobile tracking integration

### Phase 6: Security & Polish
- Remove hardcoded JWT fallback secret (`'rc137'`)
- Audit error handling
- Add loading states
- Offline graceful degradation

---

## Architecture Decisions

- **Role enum:** `admin | buyer | seller` (Deep Agent proposed `user` — rejected, we use buyer/seller)
- **Prisma generator:** `prisma-client-js` only (Deep Agent added `prisma-dbml-generator` — rejected)
- **Schema merges:** All Deep Agent diffs are manually reviewed and selectively merged to prevent regressions

---

## Known Issues

- JWT fallback secrets are hardcoded (`'rc137'` / `'rc137_refresh'`) — scheduled for Phase 6
- MIPS payment credentials not configured (payment integration disabled)
- PostHog analytics partially wired — needs completion in Phase 5
