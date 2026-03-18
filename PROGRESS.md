# FreshRoots — Progress Tracker

> Single source of truth for what has been implemented, what is in progress, and what remains.
> **Last updated:** Phase 6 complete — all planned phases done.

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
- `recalculateAllPopularity()` + admin endpoint `POST /api/listings/admin/recalculate-popularity`
- `sortBy=popular` sorts by `popularity_score desc`
- **Files:** `schema.prisma`, `listings.service.ts`, `listings.controller.ts`, `orders.service.ts`

### Backend — Feature 3: Location Management ✅
- `delivery_address`, `delivery_district`, `delivery_city`, `delivery_postal_code` on `users`
- `UpdateLocationDto` with validation
- `PATCH /api/auth/me/location` endpoint
- `getCurrentUser` returns delivery fields
- **Files:** `schema.prisma`, `update-location.dto.ts`, `auth.service.ts`, `auth.controller.ts`

### Backend — Feature 4: Rate Limiting ✅
- `@nestjs/throttler` installed and configured globally
- Three tiers: `short` (3/1s), `medium` (20/10s), `long` (100/60s)
- Stricter limits on auth endpoints (login: 5/60s, register: 3/60s)
- **Files:** `app.module.ts`, `auth.controller.ts`

### Backend — Feature 5: PostHog Analytics Events ✅
- `search_performed` event tracked when search query is used
- `filter_applied` event tracked when filter params are used
- `product_viewed` event tracked on product detail view
- PostHogService injected into ListingsService
- **Files:** `listings.service.ts`

### Backend — Feature 6: Security Hardening ✅
- Removed hardcoded JWT fallback secrets (`'rc137'` / `'rc137_refresh'`)
- `generateTokens()` now throws if `JWT_SECRET` or `JWT_REFRESH_SECRET` missing
- Fail-fast behavior prevents insecure token signing
- **Files:** `auth.service.ts`

### Mobile — Feature 1 Integration: FiltersModal ✅
- Created `FiltersModal` component (sort, price range, in-stock toggle)
- Filter button on HomeScreen wired to open modal
- Filters applied to API calls via updated `ListingsQueryParams`
- **Files:** `FiltersModal.tsx`, `HomeScreen.tsx`, `listings.ts`

### Mobile — Feature 2 Integration: Popular Products ✅
- Separate `fetchPopularListings()` call with `sortBy=popular`
- Horizontal scrollable popular section on HomeScreen
- "View all" button switches main grid to popular sort
- **Files:** `HomeScreen.tsx`

### Mobile — Feature 3 Integration: Location Management ✅
- Created `EditAddressScreen` with Mauritius district picker
- Profile screen shows delivery address (or "Not set" prompt)
- Checkout screen shows delivery address with Edit/Add button
- HomeScreen header shows user's city dynamically
- Navigation updated with `EditAddress` route
- `authService.updateLocation()` method added
- **Files:** `EditAddressScreen.tsx`, `ProfileScreen.tsx`, `CheckoutScreen.tsx`, `HomeScreen.tsx`, `auth.ts`, `types.ts`, `HomeNavigator.tsx`

### Mobile — Types Updated ✅
- `User` type: added delivery fields
- `Listing` type: added popularity fields (`view_count`, `order_count`, `popularity_score`)
- `ListingsQueryParams`: updated to match backend (`minPrice`, `maxPrice`, `inStockOnly`, new `sortBy` enum)
- **Files:** `types/index.ts`, `services/api/listings.ts`

### Mobile — UI Redesign (Home + Product Detail) ✅ (earlier work)
- Complete visual overhaul of HomeScreen and ProductDetailScreen
- New components: `ProductCard`, `CategoryChip`
- Design system: theme, spacing, typography, borderRadius, shadows

### Mobile — Auth & Registration ✅ (earlier work)
- Firebase Google Sign-In
- Buyer/Seller role selection on registration
- Friendly login error messages

### Mobile — Chat Screen ✅ (earlier work)
- Message Seller button on Cart
- Conversation screen with keyboard handling

### Deployment ✅ (earlier work)
- Railway deployment working (multi-stage Docker, prisma db push on start)
- Abacus AI deployment working
- Firebase configured

---

## Architecture Decisions

- **Role enum:** `admin | buyer | seller` (Deep Agent proposed `user` — rejected, we use buyer/seller)
- **Prisma generator:** `prisma-client-js` only (Deep Agent added `prisma-dbml-generator` — rejected)
- **Schema merges:** All Deep Agent diffs are manually reviewed and selectively merged to prevent regressions
- **JWT:** No fallback secrets — environment variables are mandatory
- **Rate limiting:** Three-tier throttle with stricter auth-specific limits

---

## Known Issues / Remaining Work

- MIPS payment credentials not configured (payment integration disabled)
- PostHog API key needs to be set in Railway/Abacus environment for analytics to be active
- Chat system is local-only (Firebase Firestore) — no backend persistence
- No image upload for listings (currently URL-based)
- No push notifications (scheduled for future)
- Offline mode: basic `isOnline` check exists, but no offline data caching

---

## Git History (this session)

1. `feat(backend): Add location management (Feature 3) + PROGRESS.md`
2. `feat(mobile): Integrate Features 1-3 (Filters, Popularity, Location)`
3. `feat(backend): Add API rate limiting with @nestjs/throttler`
4. `feat(backend): Add PostHog analytics events for search, filter, and product views`
5. `fix(security): Remove hardcoded JWT fallback secrets, fail-fast if missing`
