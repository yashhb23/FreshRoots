# Fresh Roots Marketplace - Comprehensive System Design Document

**Version:** 1.0  
**Date:** January 23, 2026  
**Project Type:** Mobile-First Fresh Produce Marketplace for Mauritius  
**Target Timeline:** 1-month prototype to production-ready MVP  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Complete Recommended Tech Stack](#2-complete-recommended-tech-stack)
3. [System Architecture Diagram](#3-system-architecture-diagram)
4. [Detailed Database Schema](#4-detailed-database-schema)
5. [API Specification Outline](#5-api-specification-outline)
6. [Authentication & Authorization Strategy](#6-authentication--authorization-strategy)
7. [Payment Integration Plan](#7-payment-integration-plan)
8. [Facebook Listing Import/Sync Plan](#8-facebook-listing-importsync-plan)
9. [Notification Architecture](#9-notification-architecture)
10. [Analytics Implementation Plan](#10-analytics-implementation-plan)
11. [UI/UX Specification](#11-uiux-specification)
12. [Performance, Scalability & Reliability Plan](#12-performance-scalability--reliability-plan)
13. [Security Plan](#13-security-plan)
14. [Testing Strategy](#14-testing-strategy)
15. [CI/CD Pipeline Recommendations](#15-cicd-pipeline-recommendations)
16. [Cost Estimate for 12 Months](#16-cost-estimate-for-12-months)
17. [Week-by-Week Milestone Plan](#17-week-by-week-milestone-plan)
18. [Risk Register](#18-risk-register)
19. [Open Questions & Required Items](#19-open-questions--required-items)
20. [Next-Phase Roadmap](#20-next-phase-roadmap)

---

## 1. Executive Summary

### 1.1 Project Overview

**Fresh Roots** is a mobile-first marketplace designed to connect Mauritian consumers with fresh, locally-sourced produce. The platform addresses a clear market need: combining the quality and freshness of traditional markets with the convenience and speed expected from modern e-commerce applications. With Mauritius's online grocery delivery market projected to grow at 17.98% annually to reach US$145.30 million by 2029, Fresh Roots enters a market with strong growth tailwinds, high digital readiness (88.6% smartphone penetration), and significant consumer demand for convenience and quality [1].

The application serves two primary user groups:
- **Consumers:** Browse listings, express interest in products, submit purchase requests with multiple payment options (MCB Juice, credit cards, cash on delivery), and track order status
- **Admin:** Manage product listings, process purchase requests with approval/rejection workflow, import listings from Facebook, and monitor platform analytics

### 1.2 Key Technical Decisions

The recommended technology stack prioritizes rapid development, scalability to millions of users, and alignment with Mauritius's unique market characteristics. Core decisions include:

1. **Frontend:** React Native with Expo framework for mobile-first development, enabling rapid iteration via web previews and Expo Go testing on the target Samsung J7 Prime device, with a clear path to iOS support

2. **Backend:** Node.js with NestJS framework, providing exceptional performance for I/O-heavy operations, unified TypeScript development, and a modular architecture that can evolve from monolith to microservices

3. **Database:** Hybrid approach with PostgreSQL as the primary database for transactional data integrity and Redis for high-performance caching and real-time features

4. **Payment:** Integration via payment aggregators (MIPS or Paywise) to access MCB Juice, My.T Money, and credit cards through a single API, with cash on delivery as a complementary option

5. **Analytics:** PostHog for its all-in-one platform (analytics, A/B testing, session replay, feature flags), self-hosting capability for data ownership, and superior cost-effectiveness at scale (80% cheaper than Mixpanel for anonymous events)

6. **Infrastructure:** Cloudinary for MVP image hosting transitioning to AWS S3 + CloudFront at scale; AWS SES for email ($0.10/1,000 emails); Expo Push Notifications for MVP transitioning to OneSignal for advanced engagement

### 1.3 Development Timeline

The project follows an aggressive but achievable 4-week development timeline:

- **Week 0 (Planning):** Finalize design documents, set up development environment, establish partnerships with payment aggregators
- **Week 1 (Backend Foundation):** Implement database schema, authentication, admin CRUD for listings, and Facebook import prototype
- **Week 2 (Mobile App Core):** Build Expo app with navigation, listing browse/search, product detail screens, and express interest flow
- **Week 3 (Purchase & Admin):** Implement purchase request flow with payment integration, admin dashboard for order management, and notification system
- **Week 4 (Polish & Deploy):** UI/UX refinement, analytics integration, automated APK generation, QA testing, and deployment

### 1.4 Expected Outcomes

By the end of the 1-month prototype phase, Fresh Roots will deliver:

1. **Functional mobile application** testable via Expo Go on Android (Samsung J7 Prime) with signed APK for distribution
2. **Complete backend API** with all core functionalities: authentication, listing management, order processing, payment integration
3. **Admin capabilities** for managing listings (including Facebook imports), processing purchase requests, and viewing analytics
4. **Payment infrastructure** integrated with Mauritius-specific options (Juice, cash on delivery) and compliant with PCI DSS standards
5. **Analytics foundation** tracking key user behaviors and conversion funnels
6. **Production-ready deployment** with CI/CD pipelines, monitoring, and observability tools
7. **Comprehensive documentation** for deployment, API usage, and future development roadmap

### 1.5 Competitive Positioning

Fresh Roots differentiates itself from existing competitors through:

- **Superior freshness guarantees** via cold chain logistics and rapid delivery windows
- **Curated quality focus** rather than broad supermarket-style assortments
- **Seamless mobile experience** optimized for the Mauritian market
- **Direct farmer partnerships** supporting local agriculture and ensuring product traceability
- **Flexible payment options** including the dominant MCB Juice mobile wallet
- **Transparent sourcing** with visibility into product origins and farming practices

The platform is positioned between traditional markets (high freshness, low convenience) and supermarket delivery services (high convenience, lower freshness focus), targeting quality-conscious consumers willing to pay a modest premium for guaranteed freshness and superior user experience.

---

## 2. Complete Recommended Tech Stack

This section provides detailed justifications for each component of the technology stack, compiled from comprehensive research into best practices, cost-effectiveness, and suitability for the Mauritius market [2, 3].

### 2.1 Frontend Technologies

#### 2.1.1 Mobile Framework: React Native with Expo

**Recommendation:** React Native 0.72+ with Expo SDK 50+

**Justification:**
- **Rapid Development:** Expo's managed workflow abstracts native build complexities, providing instant testing via Expo Go on physical devices without APK builds during development. The web preview feature enables real-time iteration viewable in any browser, critical for the aggressive 1-month timeline [2]
- **Cross-Platform Efficiency:** A single TypeScript/JavaScript codebase serves both Android (primary focus) and iOS (future expansion), potentially reducing development and maintenance costs by 30-50% compared to native development
- **Developer Alignment:** Matches the developer's stated preference, maximizing productivity and reducing the learning curve
- **Mature Ecosystem:** Extensive library of pre-built components, comprehensive documentation, and active community support for problem-solving
- **Production Path:** EAS Build provides a straightforward path from development to production APKs/AABs for Google Play Store and IPAs for Apple App Store

**Configuration:**
```
Framework: React Native 0.72+
SDK: Expo SDK 50+
Language: TypeScript 5.0+
Build System: EAS Build for production artifacts
Testing: Expo Go for development, physical device testing
```

#### 2.1.2 Navigation: React Navigation 6.x

**Recommendation:** React Navigation 6.x

**Justification:**
- De-facto standard for React Native navigation with extensive documentation
- Supports all required navigation patterns: stack (drill-down), tab (main sections), drawer (optional future admin interface)
- Deep linking support for future marketing campaigns and push notification routing
- Customizable animations and transitions for polished UX

#### 2.1.3 State Management: Redux Toolkit

**Recommendation:** Redux Toolkit 2.0+

**Justification:**
- **Scalability:** Redux provides predictable, centralized state management crucial for a marketplace with complex data flows (user auth, cart, orders, cached listings)
- **Redux Toolkit Benefits:** Reduces Redux boilerplate by 70-80% with opinionated utilities like `createSlice`, `createAsyncThunk`
- **DevTools:** Time-travel debugging and state inspection significantly accelerate development and bug fixing
- **Persistence:** Easy integration with Redux Persist for offline data caching
- **Team Scalability:** Enforces consistent patterns as team grows

**Key State Slices:**
- `auth`: User authentication state, JWT tokens, user profile
- `listings`: Product catalog, filters, search results
- `cart`: (Future) Shopping cart items and quantities
- `orders`: User's order history and status
- `ui`: App-wide UI state (loading, errors, modals)

#### 2.1.4 UI Component Library: React Native Paper 5.x

**Recommendation:** React Native Paper 5.x

**Justification:**
- **Design System:** Implements Material Design 3, providing a modern, cohesive visual language
- **Component Library:** Comprehensive set of 50+ pre-built, accessible components (buttons, cards, text inputs, modals)
- **Theme System:** Centralized theming with dark mode support built-in
- **Customization:** Extensible for Fresh Roots branding while maintaining consistency
- **Active Maintenance:** Regular updates and strong community support

#### 2.1.5 Offline Support & Caching

**Recommendation:** Redux Persist + Custom Caching Layer

**Implementation Strategy:**
```
Layer 1: AsyncStorage (via Redux Persist)
- Persist user authentication tokens
- Store user preferences and settings
- Cache small configuration data

Layer 2: Application-Level Cache
- Cache product listing responses with 15-minute TTL
- Implement stale-while-revalidate pattern
- Store last 50 viewed product details
- Queue failed API requests for retry
```

**Justification:**
- Mauritius has generally good connectivity (85.8% internet penetration), but ensures app feels fast even on intermittent 3G connections
- Reduces API load and improves perceived performance with instant rendering from cache
- Enables basic browsing functionality during brief network interruptions

### 2.2 Backend Technologies

#### 2.2.1 Runtime & Framework: Node.js with NestJS

**Recommendation:** Node.js 20 LTS with NestJS 10.x

**Justification:**
- **Performance:** Node.js's non-blocking, event-driven architecture is optimal for I/O-heavy marketplace operations (database queries, API calls to payment gateways, Facebook API). Benchmarks show Node.js handles 10,000+ concurrent connections with 2-3x lower memory than Python Django [4]
- **Unified Language:** TypeScript across frontend and backend enables code sharing (types, interfaces, validation schemas), reducing development time by 20-30%
- **NestJS Architecture:** Enforces modular, testable architecture from day one. Dependency injection, decorators, and clear separation of concerns make it easy to scale from monolith to microservices
- **Real-Time Capabilities:** Native WebSocket support via Socket.IO integration for real-time admin dashboard updates
- **Ecosystem:** World's largest package registry (npm) with solutions for every common problem

**NestJS Modules:**
```
@nestjs/core: Core framework
@nestjs/common: Common utilities, decorators
@nestjs/config: Environment configuration
@nestjs/typeorm: Database ORM integration
@nestjs/jwt: JWT authentication
@nestjs/passport: Authentication strategies
@nestjs/swagger: API documentation generation
@nestjs/schedule: Cron jobs (e.g., Facebook sync)
@nestjs/websockets: Real-time features
```

**Alternative Considered:** Python with Django
- **Rejected Because:** Django's synchronous nature requires additional complexity (Celery, Channels) for real-time features. Node.js's async-first design is more natural fit for marketplace operations. NestJS provides better TypeScript alignment with React Native frontend

#### 2.2.2 API Architecture: RESTful API

**Recommendation:** REST over GraphQL for MVP

**Justification:**
- **Simplicity:** REST's resource-oriented design maps naturally to marketplace entities (GET /listings, POST /orders). Simpler for mobile client developers to consume
- **Tooling:** Mature ecosystem for documentation (Swagger/OpenAPI), testing (Postman), monitoring, and caching
- **Caching:** HTTP-level caching with Redis is straightforward for REST endpoints
- **Performance:** Well-designed REST endpoints with proper field selection can match GraphQL efficiency for marketplace use cases

**API Versioning Strategy:**
```
Base URL: https://api.freshroots.mu/v1
Versioning: URL path versioning (/v1, /v2)
Deprecation: 6-month notice for breaking changes
```

**Future Consideration:** GraphQL for complex client needs
- Defer to post-MVP if mobile clients require highly dynamic, nested data queries
- Would enable admin dashboard to fetch precisely needed data for complex reports

### 2.3 Database & Data Management

#### 2.3.1 Primary Database: PostgreSQL 15+

**Recommendation:** PostgreSQL 15+ (managed service: AWS RDS, Google Cloud SQL, or DigitalOcean Managed Databases)

**Justification:**
- **ACID Compliance:** Non-negotiable for financial transactions. PostgreSQL ensures order integrity, prevents double-booking of inventory, and maintains referential integrity between users, orders, and listings
- **Relational Model:** Marketplace data is inherently relational (users place orders containing order items referencing listings). PostgreSQL's foreign keys, joins, and transactions handle this naturally [5]
- **JSON Support:** JSONB columns provide flexibility for semi-structured data (product metadata, tags, Facebook post data) within the relational model
- **Performance:** Excellent query optimizer, support for complex aggregations needed for admin analytics, full-text search for product listings
- **Scalability:** Proven horizontal scaling via read replicas, connection pooling, and partitioning for multi-million user scale
- **Open Source:** No vendor lock-in, extensive community knowledge, compatibility with all major cloud providers

**Configuration for Production:**
```
Version: PostgreSQL 15.x
Instance Size: Start with 2 vCPU, 4GB RAM (scales to 8+ vCPU)
Storage: SSD-backed, auto-scaling up to 1TB
Backups: Daily automated snapshots, 7-day retention
High Availability: Multi-AZ deployment for 99.95% uptime
Connection Pooling: PgBouncer (100-500 connections)
```

**Alternative Considered:** MongoDB
- **Rejected Because:** Lack of enforced relationships creates risk of data inconsistencies in e-commerce transactions. Application-level integrity checks are error-prone. PostgreSQL's constraints provide safety net.

#### 2.3.2 Caching Layer: Redis 7.x

**Recommendation:** Redis 7.x (managed service: AWS ElastiCache, Redis Labs, or DigitalOcean)

**Justification:**
- **Performance:** In-memory storage provides sub-millisecond read/write latency, reducing database load by 60-80% for frequently accessed data
- **Versatility:** Single platform for multiple use cases: API response caching, session storage, rate limiting, pub/sub for real-time admin notifications
- **Data Structures:** Rich data types (strings, hashes, sorted sets) optimize different caching patterns
- **Persistence:** Optional RDB snapshots ensure cached data survives restarts

**Use Cases in Fresh Roots:**
```
1. API Response Caching
   Key: listing:all:page:1
   Value: JSON response of listings
   TTL: 15 minutes
   Impact: 85% of listing requests served from cache

2. Session Storage
   Key: session:{userId}
   Value: JWT refresh token
   TTL: 30 days
   Impact: Stateless JWT validation with logout capability

3. Rate Limiting
   Key: ratelimit:{ip}:{endpoint}
   Value: Request count
   TTL: 15 minutes
   Impact: Prevent abuse, ensure fair access

4. Real-Time Pub/Sub
   Channel: admin:orders:new
   Message: New order notification
   Impact: Instant admin dashboard updates
```

**Cache Invalidation Strategy:**
- **Time-based (TTL):** Listings cache expires after 15 minutes
- **Event-based:** Invalidate specific listing cache on admin update/delete
- **Tag-based:** Invalidate category cache when any product in category changes

### 2.4 Infrastructure & Cloud Services

#### 2.4.1 Hosting Platform

**Recommendation:** AWS (Primary), with DigitalOcean as cost-effective alternative

**Justification:**
- **AWS Pros:** Comprehensive service ecosystem, excellent managed services (RDS, ElastiCache, S3, CloudFront), superior auto-scaling, global infrastructure for future expansion
- **DigitalOcean Pros:** 50-60% lower costs for MVP phase, simpler interfaces, faster setup, excellent for single-region deployment
- **Hybrid Approach:** Start on DigitalOcean for cost efficiency, migrate to AWS as scale demands

**MVP Hosting Architecture (DigitalOcean):**
```
Backend: App Platform (PaaS)
- 1-2 containers, auto-scaling
- $12-24/month per instance

Database: Managed PostgreSQL
- Basic plan: $15/month
- Production plan: $55/month (2GB RAM)

Cache: Managed Redis
- Basic plan: $15/month

Object Storage: Spaces (S3-compatible)
- $5/month + $0.01/GB transfer

CDN: Spaces CDN
- Included with Spaces

Total MVP Cost: ~$60-100/month
```

**Production Scaling Architecture (AWS):**
```
Compute: ECS Fargate or EC2 Auto Scaling Group
Database: RDS PostgreSQL Multi-AZ
Cache: ElastiCache Redis Cluster
Storage: S3 + CloudFront CDN
Load Balancer: Application Load Balancer (ALB)
Secrets: AWS Secrets Manager
Monitoring: CloudWatch + X-Ray
```

#### 2.4.2 File Storage & CDN

**Recommendation:** Phase 1: Cloudinary | Phase 2: AWS S3 + CloudFront + Lambda@Edge

**Phase 1 - Cloudinary (MVP - Months 1-6)**

**Justification:**
- **Zero Setup:** Upload API works out-of-box, no infrastructure management
- **Free Tier:** 25 credits/month = 25GB storage + 25GB bandwidth + 25,000 transformations, sufficient for MVP with 100-500 products [6]
- **Automatic Optimization:** Serves WebP to Chrome/Android, AVIF to modern browsers, JPEG fallback for older devices—without manual configuration
- **Responsive Images:** Single URL with transformation parameters generates thumbnails, mobile, and desktop sizes on-the-fly
- **Fast Integration:** React Native SDK and Node.js SDK enable integration in < 1 day

**Example Transformation URLs:**
```
Original: https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg

Thumbnail: .../c_fill,w_150,h_150,f_auto,q_auto/products/tomato_001.jpg
Mobile: .../c_scale,w_800,f_auto,q_auto,dpr_2.0/products/tomato_001.jpg
Desktop: .../c_scale,w_1600,f_auto,q_80/products/tomato_001.jpg
```

**Cost Projection:**
- 0-1,000 products: Free tier sufficient
- 1,000-5,000 products with 10K monthly active users: ~$50-100/month
- Beyond 5,000 products / 50K users: Consider migration to Phase 2

**Phase 2 - AWS S3 + CloudFront (Scale - Beyond Month 6)**

**Migration Trigger:** Monthly bandwidth > 2TB or Cloudinary costs > $200/month

**Justification:**
- **Cost Savings:** At 10TB/month, AWS solution costs ~$1,000/month vs. Cloudinary's ~$5,000-8,000/month (60-85% savings) [7]
- **Control:** Full ownership of transformation logic, caching rules, and edge behaviors
- **Performance:** CloudFront has 450+ edge locations, including Africa presence, though Cloudinary's CDN includes a Mauritius PoP via Cloudflare partnership [8]

**Implementation:**
```
Storage: S3 bucket (private) - $0.023/GB
CDN: CloudFront distribution - $0.085/GB transfer (first 10TB)
Transformations: Lambda@Edge functions - $0.60 per 1M requests
Smart Caching: Cache-Control headers, ETags, versioned URLs

Image Processing: Sharp library in Lambda@Edge
- Resize, crop, format conversion (WebP, AVIF)
- Quality optimization based on device hints
- Execution time: 50-200ms
```

#### 2.4.3 Domain & SSL

**Recommendation:** Custom domain (freshroots.mu) with Let's Encrypt SSL

**Setup:**
```
Domain Registrar: .mu domain from Internet Direct (Mauritius registrar)
Cost: ~$25-40/year for .mu domain

DNS: Cloudflare (free plan)
- Global anycast DNS
- DDoS protection
- Free SSL certificate (Let's Encrypt)
- DNSSEC support

SSL: Auto-renewing Let's Encrypt certificates via Cloudflare or Certbot
Cost: $0
```

### 2.5 Authentication & Security Services

#### 2.5.1 Authentication: JWT (JSON Web Tokens)

**Recommendation:** JWT-based authentication with refresh token pattern

**Implementation:**
```typescript
// Token Structure
Access Token:
  - Payload: { userId, role, email }
  - Expiration: 15 minutes
  - Storage: Mobile app memory (Redux state, never persisted)
  - Usage: Every API request in Authorization header

Refresh Token:
  - Payload: { userId, tokenId }
  - Expiration: 30 days
  - Storage: Secure device storage (Expo SecureStore), Redis server-side
  - Usage: Obtain new access token when expired
```

**Security Features:**
- **Short-lived Access Tokens:** 15-minute expiry limits damage if token is compromised
- **Refresh Token Rotation:** Each refresh issues new refresh token and invalidates old one
- **Token Revocation:** Store refresh token IDs in Redis; delete on logout for true logout capability
- **Device Binding (Future):** Link refresh token to device fingerprint to prevent token theft

**Password Security:**
```
Hashing: bcrypt with cost factor 12 (2^12 iterations)
Rationale: Bcrypt is specifically designed to resist brute-force attacks
          Cost factor 12 provides ~300ms hash time (balance security/UX)
          
Salt: bcrypt generates unique salt per password automatically
Storage: Store only bcrypt hash, never plaintext password
```

#### 2.5.2 Future: OAuth 2.0 Social Login

**Recommendation:** Integrate Google and Facebook OAuth post-MVP

**Justification:**
- **User Convenience:** 40-60% faster registration, 20-30% lower abandonment rates
- **Trust:** Users more comfortable sharing existing social credentials
- **Profile Data:** Pre-populate name, email, profile photo from social accounts

**Implementation Priority:**
1. **Month 2:** Google OAuth (highest usage in Mauritius)
2. **Month 3:** Facebook OAuth (leverages existing Facebook page relationship)

**Libraries:**
- Frontend: `expo-auth-session` for OAuth flows
- Backend: `@nestjs/passport` with `passport-google-oauth20`, `passport-facebook`

### 2.6 External Service Integration

#### 2.6.1 Payment Processing

**Recommendation:** MIPS or Paywise payment aggregator

**Detailed in Section 7**

#### 2.6.2 Email Service: AWS SES

**Recommendation:** Amazon Simple Email Service (SES)

**Justification:**
- **Cost Efficiency:** $0.10 per 1,000 emails = 95% cheaper than SendGrid ($0.80/1,000) and 90% cheaper than Mailgun
- **Free Tier:** 62,000 emails/month free when hosted on AWS EC2 (or 3,000/month from any host)
- **Deliverability:** Enterprise-grade infrastructure; requires proper DKIM/SPF setup but achieves >98% inbox placement
- **Scalability:** No upper limits; scales to millions of emails

**Setup Requirements:**
- Request production access (default: sandbox mode, can only send to verified addresses)
- Configure DKIM and SPF records for domain authentication
- Set up dedicated IP ($24.95/month) once sending >50,000 emails/month for reputation control
- Implement bounce and complaint handling webhooks

**Email Types:**
```
Transactional (High Priority):
- Order confirmation
- Payment receipt
- Admin order alert
- Password reset
- Account verification

Marketing (Future):
- Weekly produce newsletter
- Seasonal promotions
- Abandoned cart reminders
```

**Alternative:** Mailgun if AWS setup is too complex
- **Trade-off:** 8x cost vs. SES, but simpler setup and better out-of-box analytics
- **Recommendation:** Start with SES, fall back to Mailgun only if deliverability issues arise

#### 2.6.3 Push Notifications

**Recommendation:** Phase 1: Expo Push Notifications | Phase 2: OneSignal

**Detailed in Section 9**

#### 2.6.4 Analytics: PostHog

**Recommendation:** PostHog Cloud (MVP) transitioning to Self-Hosted (Scale)

**Detailed in Section 10**

### 2.7 Development Tools & Monitoring

#### 2.7.1 Version Control & Collaboration

**Recommendation:**
- **Git Hosting:** GitHub (private repositories)
- **Branching Strategy:** Git Flow (main, develop, feature/*, release/*, hotfix/*)
- **Code Review:** Mandatory pull request reviews for all main/develop merges
- **Documentation:** README.md, API documentation in `/docs`, architectural decision records (ADRs)

#### 2.7.2 Error Tracking: Sentry

**Recommendation:** Sentry for both frontend and backend error tracking

**Justification:**
- **Real-Time Alerts:** Instant Slack/email notifications for critical errors
- **Context:** Captures full stack traces, user context, device info, breadcrumbs leading to error
- **Release Tracking:** Associate errors with specific app versions and track error introduction/resolution
- **Performance Monitoring:** Tracks API endpoint response times, database query performance
- **Source Maps:** Deobfuscates minified production JavaScript for readable stack traces

**Free Tier:** 5,000 events/month (sufficient for MVP)

**Integration:**
```typescript
// React Native
import * as Sentry from '@sentry/react-native';
Sentry.init({ dsn: process.env.SENTRY_DSN_MOBILE });

// NestJS Backend
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN_BACKEND });
```

#### 2.7.3 Logging: Winston

**Recommendation:** Winston for structured backend logging

**Configuration:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log aggregation to CloudWatch or ELK Stack in production
```

**Log Levels:**
- **error:** Failed operations requiring immediate attention
- **warn:** Degraded functionality, fallback behaviors activated
- **info:** Key business events (order created, payment completed)
- **debug:** Detailed debugging information (disabled in production)

#### 2.7.4 API Documentation: Swagger/OpenAPI

**Recommendation:** Swagger UI generated from NestJS decorators

**Justification:**
- **Auto-Generated:** NestJS's `@nestjs/swagger` package generates OpenAPI spec from code annotations
- **Always Sync:** Documentation lives alongside code, impossible to drift out-of-sync
- **Interactive:** Swagger UI allows API testing directly from browser
- **Client Generation:** OpenAPI spec can generate TypeScript SDK for React Native client

**Access:** `https://api.freshroots.mu/api/docs`

### 2.8 Testing Tools

**Detailed in Section 14**

### 2.9 CI/CD

**Detailed in Section 15**

### 2.10 Tech Stack Summary Table

| Category | Technology | Justification | Cost (Monthly) |
|----------|-----------|---------------|----------------|
| **Frontend** | React Native + Expo | Rapid dev, cross-platform, developer preference | $0 |
| **Mobile UI** | React Native Paper | Material Design 3, comprehensive components | $0 |
| **State Management** | Redux Toolkit | Predictable, scalable, excellent DevTools | $0 |
| **Navigation** | React Navigation | Industry standard, deep linking support | $0 |
| **Backend** | Node.js + NestJS | High concurrency, TypeScript, modular | $0 |
| **API Style** | REST | Simple, mature tooling, cacheable | $0 |
| **Primary Database** | PostgreSQL 15+ | ACID compliance, relational integrity | $15-55 |
| **Cache** | Redis 7+ | Sub-ms latency, pub/sub, versatile | $15 |
| **Hosting** | DigitalOcean/AWS | Managed services, scalability | $60-100 (MVP) |
| **Images (MVP)** | Cloudinary | Zero setup, free tier, auto-optimization | $0-50 |
| **Images (Scale)** | S3 + CloudFront | 60-85% cost savings at high traffic | $175+ |
| **Email** | AWS SES | $0.10/1,000 emails, enterprise deliverability | $0-20 |
| **Push (MVP)** | Expo Push | Zero config for Expo apps | $0 |
| **Push (Scale)** | OneSignal | Advanced targeting, campaigns | $0-39+ |
| **Analytics** | PostHog | All-in-one, self-hostable, cost-effective | $0-310 |
| **Error Tracking** | Sentry | Real-time, context-rich, release tracking | $0 |
| **Logging** | Winston | Structured, cloud-agnostic | $0 |
| **CI/CD** | GitHub Actions | Native GitHub integration, free tier | $0 |
| **Domain** | freshroots.mu | Local domain | $2-3 |
| **SSL/CDN** | Cloudflare | DDoS protection, free SSL | $0 |
| **Payments** | MIPS/Paywise | Local payment methods, PCI compliance | Transaction fees |
| | | **MVP Total** | **~$100-200/mo** |
| | | **Production (10K users)** | **~$400-700/mo** |

---

## 3. System Architecture Diagram

The complete system architecture diagram has been created as a separate file for clarity and ease of reference.

**File Location:** `/home/ubuntu/fresh_roots_architecture_diagram.txt`

This diagram includes:
- **Client Layer:** React Native mobile app and future admin web dashboard
- **API Gateway:** Load balancing, SSL termination, rate limiting, CORS
- **Application Layer:** NestJS modular architecture with dedicated modules for auth, listings, orders, payments, Facebook integration, notifications, and analytics
- **Data Layer:** PostgreSQL for persistent storage, Redis for caching and real-time features
- **External Services:** Payment gateways, Facebook Graph API, push/email providers, CDN
- **Data Flow Diagrams:** Visual representation of user browsing, purchase flow, and admin approval workflows
- **Scalability Plan:** Architecture evolution from MVP (single instance) to enterprise scale (auto-scaling, multi-region)

Please refer to the architecture diagram file for detailed component interactions and data flows.

---

## 4. Detailed Database Schema

This section defines the complete PostgreSQL database schema for Fresh Roots, including all tables, relationships, indexes, and constraints necessary for core functionality and future scalability.

### 4.1 Schema Design Principles

1. **Normalization:** Third Normal Form (3NF) to eliminate redundancy while maintaining query performance
2. **Referential Integrity:** Foreign keys with appropriate ON DELETE and ON UPDATE actions
3. **Indexing Strategy:** Indexes on foreign keys, frequently queried fields, and composite indexes for complex queries
4. **Timestamps:** `created_at` and `updated_at` on all major entities for audit trails and debugging
5. **Soft Deletes (Future):** Add `deleted_at` timestamp for soft deletion instead of hard DELETE operations
6. **JSON Flexibility:** JSONB columns for semi-structured data (product metadata, Facebook post data)

### 4.2 Core Tables

#### 4.2.1 Users Table

**Purpose:** Store all user accounts (customers and admins)

```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  phone             VARCHAR(20),
  name              VARCHAR(255) NOT NULL,
  role              VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin')),
  email_verified    BOOLEAN DEFAULT FALSE,
  phone_verified    BOOLEAN DEFAULT FALSE,
  profile_image_url TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Comments
COMMENT ON TABLE users IS 'All user accounts including customers and administrators';
COMMENT ON COLUMN users.role IS 'User role: customer (default) or admin';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hash of password, never store plaintext';
```

**Sample Data:**
```sql
-- Admin user
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@freshroots.mu', '$2b$12$...', 'Fresh Roots Admin', 'admin');

-- Customer user
INSERT INTO users (email, password_hash, phone, name, role) VALUES
('customer@example.com', '$2b$12$...', '+230 5123 4567', 'John Doe', 'customer');
```

#### 4.2.2 Listings Table

**Purpose:** Product listings created by admin

```sql
CREATE TABLE listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               VARCHAR(255) NOT NULL,
  description         TEXT,
  price               DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency            VARCHAR(3) DEFAULT 'MUR',
  unit                VARCHAR(20) NOT NULL, -- 'kg', 'pack', 'piece', 'bunch', etc.
  stock_quantity      INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  location            VARCHAR(255), -- Farm location or region
  category            VARCHAR(100), -- 'vegetables', 'fruits', 'herbs', 'dairy', etc.
  tags                TEXT[], -- Array of tags: ['organic', 'hydroponic', 'local']
  is_available        BOOLEAN DEFAULT TRUE,
  facebook_post_id    VARCHAR(255), -- Reference to source Facebook post
  facebook_post_url   TEXT,
  facebook_synced_at  TIMESTAMP WITH TIME ZONE,
  metadata            JSONB, -- Flexible storage for additional attributes
  admin_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listings_admin_id ON listings(admin_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_is_available ON listings(is_available);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_facebook_post_id ON listings(facebook_post_id);
CREATE INDEX idx_listings_tags ON listings USING GIN(tags); -- GIN index for array queries

-- Full-text search index
CREATE INDEX idx_listings_search ON listings 
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

COMMENT ON TABLE listings IS 'Product listings for fresh produce and goods';
COMMENT ON COLUMN listings.metadata IS 'JSON field for flexible attributes: {farming_method, harvest_date, certifications}';
```

**Sample Data:**
```sql
INSERT INTO listings (title, description, price, unit, stock_quantity, location, category, tags, admin_id) VALUES
(
  'Organic Tomatoes',
  'Fresh organic tomatoes harvested this morning from Plaine Magnien',
  85.00,
  'kg',
  50,
  'Plaine Magnien',
  'vegetables',
  ARRAY['organic', 'local', 'fresh'],
  '00000000-0000-0000-0000-000000000001' -- admin UUID
);
```

#### 4.2.3 Listing Images Table

**Purpose:** Store multiple images per listing with ordering

```sql
CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  alt_text    VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id, display_order);

COMMENT ON TABLE listing_images IS 'Multiple images per listing, ordered for carousel display';
COMMENT ON COLUMN listing_images.display_order IS 'Order of image display, 0 = primary image';
```

#### 4.2.4 Orders Table

**Purpose:** Purchase requests from customers

```sql
CREATE TYPE order_status AS ENUM (
  'pending',           -- Initial state after submission
  'payment_pending',   -- Awaiting payment confirmation
  'payment_confirmed', -- Payment verified, awaiting admin approval
  'approved',          -- Admin approved, ready for fulfillment
  'rejected',          -- Admin rejected
  'preparing',         -- Order being prepared
  'out_for_delivery',  -- In transit
  'delivered',         -- Successfully delivered
  'cancelled'          -- Cancelled by customer or admin
);

CREATE TYPE payment_method AS ENUM (
  'juice',             -- MCB Juice mobile payment
  'myt_money',         -- My.T Money
  'card',              -- Credit/Debit card
  'cash_on_delivery'   -- COD
);

CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      VARCHAR(20) UNIQUE NOT NULL, -- Human-readable: FR-2026-001234
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status            order_status DEFAULT 'pending',
  payment_method    payment_method NOT NULL,
  payment_status    VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_transaction_id TEXT, -- External payment provider transaction ID
  subtotal_amount   DECIMAL(10, 2) NOT NULL CHECK (subtotal_amount >= 0),
  delivery_fee      DECIMAL(10, 2) DEFAULT 0,
  cod_fee           DECIMAL(10, 2) DEFAULT 0, -- Cash on delivery fee if applicable
  total_amount      DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  currency          VARCHAR(3) DEFAULT 'MUR',
  delivery_address  JSONB, -- {line1, line2, city, postal_code, phone, notes}
  notes             TEXT, -- Customer notes or special instructions
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Sequence for order numbers
CREATE SEQUENCE order_number_seq START 1000;

COMMENT ON TABLE orders IS 'Purchase requests from customers';
COMMENT ON COLUMN orders.order_number IS 'Human-readable order identifier: FR-2026-001234';
```

#### 4.2.5 Order Items Table

**Purpose:** Line items within an order

```sql
CREATE TABLE order_items (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id              UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  quantity                INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_at_purchase  DECIMAL(10, 2) NOT NULL, -- Lock price at time of order
  unit                    VARCHAR(20) NOT NULL,
  subtotal                DECIMAL(10, 2) NOT NULL,
  listing_title_snapshot  VARCHAR(255) NOT NULL, -- Preserve title in case listing is deleted
  listing_image_snapshot  TEXT, -- Preserve primary image URL
  created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_listing_id ON order_items(listing_id);

COMMENT ON TABLE order_items IS 'Individual line items within an order';
COMMENT ON COLUMN order_items.unit_price_at_purchase IS 'Price locked at purchase time, immune to future price changes';
```

#### 4.2.6 Interest Expressions Table

**Purpose:** Track "Express Interest" actions before purchase

```sql
CREATE TYPE interest_status AS ENUM ('new', 'contacted', 'converted', 'not_interested');

CREATE TABLE interest_expressions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  message     TEXT, -- Optional message from customer
  status      interest_status DEFAULT 'new',
  admin_notes TEXT, -- Admin's follow-up notes
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_interest_expressions_user_id ON interest_expressions(user_id);
CREATE INDEX idx_interest_expressions_listing_id ON interest_expressions(listing_id);
CREATE INDEX idx_interest_expressions_status ON interest_expressions(status, created_at DESC);
CREATE UNIQUE INDEX idx_interest_unique ON interest_expressions(user_id, listing_id) 
  WHERE status IN ('new', 'contacted'); -- Prevent duplicate active interests

COMMENT ON TABLE interest_expressions IS 'Customer expressions of interest before purchase commitment';
```

#### 4.2.7 Admin Actions Table

**Purpose:** Audit log of admin decisions and actions

```sql
CREATE TYPE admin_action_type AS ENUM (
  'order_approved',
  'order_rejected',
  'order_status_updated',
  'listing_created',
  'listing_updated',
  'listing_deleted',
  'user_status_changed',
  'facebook_import'
);

CREATE TABLE admin_actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action_type     admin_action_type NOT NULL,
  target_entity   VARCHAR(50), -- 'order', 'listing', 'user'
  target_id       UUID, -- ID of affected entity
  description     TEXT,
  metadata        JSONB, -- Additional context: {old_status, new_status, reason}
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id, created_at DESC);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_entity, target_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);

COMMENT ON TABLE admin_actions IS 'Complete audit log of all admin actions for compliance and debugging';
```

#### 4.2.8 Notifications Table

**Purpose:** In-app notification center for users

```sql
CREATE TYPE notification_type AS ENUM (
  'order_status_update',
  'payment_confirmation',
  'admin_message',
  'system_alert',
  'promotional'
);

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  action_url  TEXT, -- Deep link to relevant screen
  read        BOOLEAN DEFAULT FALSE,
  read_at     TIMESTAMP WITH TIME ZONE,
  metadata    JSONB, -- Context: {order_id, listing_id}
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(user_id, read, created_at DESC);

COMMENT ON TABLE notifications IS 'In-app notification center, separate from push notifications';
```

#### 4.2.9 Refresh Tokens Table

**Purpose:** Track JWT refresh tokens for secure logout

```sql
CREATE TABLE refresh_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash      VARCHAR(255) NOT NULL UNIQUE, -- Hash of refresh token
  device_info     JSONB, -- {device_id, device_name, os, app_version}
  ip_address      INET,
  expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked         BOOLEAN DEFAULT FALSE,
  revoked_at      TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Cleanup job: Delete expired tokens older than 30 days
CREATE INDEX idx_refresh_tokens_cleanup ON refresh_tokens(expires_at) WHERE expires_at < NOW();

COMMENT ON TABLE refresh_tokens IS 'Refresh tokens for JWT authentication with device tracking';
```

### 4.3 Supporting Tables

#### 4.3.1 Categories Table (Future Enhancement)

**Purpose:** Structured product categories

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url    TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE CASCADE, -- For hierarchical categories
  display_order INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

#### 4.3.2 Reviews Table (Future Enhancement)

**Purpose:** Customer reviews and ratings

```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL, -- Verified purchase
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       VARCHAR(255),
  comment     TEXT,
  images      TEXT[], -- Review image URLs
  is_verified BOOLEAN DEFAULT FALSE, -- Verified purchase
  helpful_count INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id, created_at DESC);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE UNIQUE INDEX idx_reviews_unique ON reviews(user_id, listing_id); -- One review per user per listing
```

### 4.4 Database Functions & Triggers

#### 4.4.1 Updated At Trigger

**Purpose:** Automatically update `updated_at` timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER interest_expressions_updated_at BEFORE UPDATE ON interest_expressions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4.4.2 Order Number Generation

**Purpose:** Generate human-readable order numbers

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'FR-' || 
                      TO_CHAR(NOW(), 'YYYY') || '-' || 
                      LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

#### 4.4.3 Order Total Calculation Validation

**Purpose:** Ensure order total matches sum of items

```sql
CREATE OR REPLACE FUNCTION validate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  calculated_subtotal DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(subtotal), 0) INTO calculated_subtotal
  FROM order_items
  WHERE order_id = NEW.id;
  
  IF calculated_subtotal != NEW.subtotal_amount THEN
    RAISE EXCEPTION 'Order subtotal mismatch: calculated % != stored %', 
                    calculated_subtotal, NEW.subtotal_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER orders_total_validation 
  AFTER INSERT OR UPDATE ON orders
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION validate_order_total();
```

### 4.5 Views for Common Queries

#### 4.5.1 Active Listings View

```sql
CREATE VIEW active_listings AS
SELECT 
  l.*,
  (SELECT image_url FROM listing_images WHERE listing_id = l.id ORDER BY display_order LIMIT 1) AS primary_image,
  (SELECT COUNT(*) FROM interest_expressions WHERE listing_id = l.id AND status = 'new') AS interest_count
FROM listings l
WHERE l.is_available = TRUE
  AND l.stock_quantity > 0
ORDER BY l.created_at DESC;
```

#### 4.5.2 Order Summary View

```sql
CREATE VIEW order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  u.name AS user_name,
  u.email AS user_email,
  o.status,
  o.payment_method,
  o.payment_status,
  o.total_amount,
  o.created_at,
  COUNT(oi.id) AS item_count,
  SUM(oi.quantity) AS total_items
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.id;
```

### 4.6 Data Migration Strategy

**Phase 1: MVP Schema**
- Core tables: users, listings, listing_images, orders, order_items, admin_actions, notifications
- Deploy using TypeORM migrations

**Phase 2: Enhancements (Month 2-3)**
- Add categories table with migration to populate from existing listing.category strings
- Add reviews table
- Implement full-text search optimizations

**Phase 3: Optimization (Month 4+)**
- Add materialized views for analytics
- Implement table partitioning for orders (by month)
- Add database sharding strategy for multi-region expansion

### 4.7 Backup & Recovery Strategy

**Automated Backups:**
- Daily automated snapshots at 2 AM MUT (off-peak hours)
- Retention: 7 daily, 4 weekly, 12 monthly snapshots
- Point-in-time recovery (PITR) enabled with 7-day WAL retention

**Backup Testing:**
- Monthly restoration test to staging environment
- Verify data integrity and application compatibility

**Disaster Recovery:**
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 15 minutes (via PITR)

---

## 5. API Specification Outline

This section defines the RESTful API endpoints for Fresh Roots, organized by functional domain. Full OpenAPI/Swagger documentation will be auto-generated from NestJS decorators.

### 5.1 API Design Principles

1. **RESTful Conventions:** Use HTTP verbs (GET, POST, PUT, PATCH, DELETE) semantically
2. **Resource-Oriented URLs:** Nouns not verbs (`/listings` not `/getListings`)
3. **Consistent Response Format:** Standard envelope for all responses
4. **Pagination:** Cursor-based pagination for scalability
5. **Filtering & Sorting:** Query parameters for search, filter, sort
6. **Versioning:** URL path versioning (`/v1/`, `/v2/`)
7. **Error Handling:** Standard HTTP status codes with detailed error messages

### 5.2 Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response payload */ },
  "meta": {
    "timestamp": "2026-01-23T10:30:00Z",
    "version": "1.0"
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-23T10:30:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

### 5.3 Authentication Endpoints

**Base Path:** `/api/v1/auth`

#### 5.3.1 Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "+230 5123 4567"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "created_at": "2026-01-23T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validations:**
- Email: Valid format, not already registered
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Name: Required, 2-255 chars
- Phone: Optional, valid Mauritius format (+230)

**Errors:**
- `400 Bad Request`: Validation failure
- `409 Conflict`: Email already exists

#### 5.3.2 Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account disabled

#### 5.3.3 Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // New refresh token (rotation)
  }
}
```

#### 5.3.4 Logout

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### 5.3.5 Get Current User

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer {accessToken}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+230 5123 4567",
    "role": "customer",
    "email_verified": true,
    "created_at": "2026-01-20T10:00:00Z"
  }
}
```

### 5.4 Listings Endpoints

**Base Path:** `/api/v1/listings`

#### 5.4.1 Get All Listings

**Endpoint:** `GET /listings`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20, max: 100): Items per page
- `category` (string): Filter by category
- `search` (string): Full-text search query
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `tags` (string[]): Filter by tags (comma-separated)
- `sortBy` (string): `created_at`, `price`, `title`
- `sortOrder` (string): `asc`, `desc` (default: `desc`)

**Example:** `GET /listings?category=vegetables&search=organic&sortBy=price&sortOrder=asc`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Organic Tomatoes",
      "description": "Fresh organic tomatoes...",
      "price": 85.00,
      "unit": "kg",
      "stock_quantity": 50,
      "location": "Plaine Magnien",
      "category": "vegetables",
      "tags": ["organic", "local", "fresh"],
      "is_available": true,
      "primary_image": "https://freshby4roots.com/cdn/shop/files/Beefsteak-Tomatoes.jpg?v=1745515552&width=480",
      "images": [
        {
          "id": "uuid",
          "url": "https://images.pexels.com/photos/5503106/pexels-photo-5503106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          "alt_text": "Organic tomatoes closeup"
        }
      ],
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

#### 5.4.2 Get Listing by ID

**Endpoint:** `GET /listings/:id`

**Response:** `200 OK` (Same structure as individual listing above with full details)

**Errors:**
- `404 Not Found`: Listing does not exist

#### 5.4.3 Create Listing (Admin Only)

**Endpoint:** `POST /admin/listings`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:**
```json
{
  "title": "Fresh Organic Lettuce",
  "description": "Crispy organic lettuce from hydroponic farm",
  "price": 45.00,
  "unit": "piece",
  "stock_quantity": 100,
  "location": "Curepipe",
  "category": "vegetables",
  "tags": ["organic", "hydroponic", "pesticide-free"],
  "images": [
    {
      "url": "https://i.ytimg.com/vi/mtsRY51-e1Q/sddefault.jpg",
      "alt_text": "Organic lettuce"
    }
  ]
}
```

**Response:** `201 Created`

**Errors:**
- `403 Forbidden`: Non-admin user attempting creation

#### 5.4.4 Update Listing (Admin Only)

**Endpoint:** `PUT /admin/listings/:id`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:** (Same as Create, all fields optional)

**Response:** `200 OK`

#### 5.4.5 Delete Listing (Admin Only)

**Endpoint:** `DELETE /admin/listings/:id`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Listing deleted successfully"
  }
}
```

**Note:** Soft delete preferred in production (set `is_available = false`)

### 5.5 Orders Endpoints

**Base Path:** `/api/v1/orders`

#### 5.5.1 Express Interest

**Endpoint:** `POST /orders/express-interest`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "listing_id": "uuid",
  "message": "I'm interested in purchasing 5kg. Do you deliver to Quatre Bornes?"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "listing_id": "uuid",
    "message": "I'm interested...",
    "status": "new",
    "created_at": "2026-01-23T10:30:00Z"
  }
}
```

#### 5.5.2 Create Purchase Request

**Endpoint:** `POST /orders/purchase-request`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "uuid",
      "quantity": 2
    },
    {
      "listing_id": "uuid2",
      "quantity": 1
    }
  ],
  "payment_method": "juice",
  "delivery_address": {
    "line1": "123 Main Street",
    "line2": "Apartment 4B",
    "city": "Quatre Bornes",
    "postal_code": "72301",
    "phone": "+230 5123 4567",
    "notes": "Gate code: 1234"
  },
  "notes": "Please deliver after 6 PM"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "FR-2026-001234",
      "status": "pending",
      "payment_method": "juice",
      "subtotal_amount": 170.00,
      "delivery_fee": 50.00,
      "total_amount": 220.00,
      "created_at": "2026-01-23T10:30:00Z"
    },
    "payment_url": "https://gateway.mips.mu/pay/abc123" // If applicable
  }
}
```

**Business Logic:**
1. Validate stock availability for all items
2. Calculate totals (subtotal + delivery fee + COD fee if applicable)
3. Create order and order_items records (status: pending)
4. If payment method requires redirect (Juice, card), initiate payment and return URL
5. If COD, mark payment_status as 'pending_cod'
6. Send notification to admin
7. Send confirmation email to customer

#### 5.5.3 Get My Orders

**Endpoint:** `GET /orders/my-orders`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `status` (string): Filter by order status
- `page` (number): Page number
- `limit` (number): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "FR-2026-001234",
      "status": "approved",
      "payment_method": "juice",
      "payment_status": "completed",
      "total_amount": 220.00,
      "items": [
        {
          "listing_title": "Organic Tomatoes",
          "quantity": 2,
          "unit": "kg",
          "unit_price": 85.00,
          "subtotal": 170.00,
          "image": "https://media.istockphoto.com/id/140453734/photo/fresh-tomatoes.jpg?s=612x612&w=0&k=20&c=b6XySPuRKF6opBf0bexh9AhkWck-c7TaoJvRdVNBgT0="
        }
      ],
      "created_at": "2026-01-23T10:30:00Z",
      "updated_at": "2026-01-23T11:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

#### 5.5.4 Get Order Details

**Endpoint:** `GET /orders/:id`

**Headers:** `Authorization: Bearer {accessToken}`

**Response:** `200 OK` (Full order details with items)

**Authorization:** User can only view their own orders; admins can view all

### 5.6 Admin Order Management Endpoints

**Base Path:** `/api/v1/admin/orders`

**Authorization:** All endpoints require admin role

#### 5.6.1 Get All Orders

**Endpoint:** `GET /admin/orders`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Query Parameters:**
- `status` (string): Filter by status
- `payment_method` (string): Filter by payment method
- `from_date` (ISO date): Orders created after date
- `to_date` (ISO date): Orders created before date
- `page`, `limit`: Pagination

**Response:** `200 OK` (Paginated list of all orders with user info)

#### 5.6.2 Approve Order

**Endpoint:** `PUT /admin/orders/:id/approve`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:**
```json
{
  "notes": "Order confirmed, preparing for delivery tomorrow"
}
```

**Response:** `200 OK`

**Side Effects:**
1. Update order status to 'approved'
2. Log admin action in admin_actions table
3. Send push notification to customer
4. Send email confirmation to customer
5. Create in-app notification

#### 5.6.3 Reject Order

**Endpoint:** `PUT /admin/orders/:id/reject`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:**
```json
{
  "reason": "Insufficient stock for requested items",
  "notes": "We'll restock next week"
}
```

**Response:** `200 OK`

**Side Effects:**
1. Update order status to 'rejected'
2. Log admin action with reason
3. Restore stock quantities
4. Initiate refund if payment was completed
5. Notify customer with rejection reason

#### 5.6.4 Update Order Status

**Endpoint:** `PATCH /admin/orders/:id/status`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:**
```json
{
  "status": "out_for_delivery",
  "notes": "Driver: John, ETA 30 minutes"
}
```

**Response:** `200 OK`

### 5.7 Payment Endpoints

**Base Path:** `/api/v1/payments`

#### 5.7.1 Initiate Payment

**Endpoint:** `POST /payments/initiate`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "order_id": "uuid",
  "payment_method": "juice",
  "return_url": "freshroots://payment/success",
  "cancel_url": "freshroots://payment/cancel"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_abc123",
    "payment_url": "https://gateway.mips.mu/pay/abc123",
    "expires_at": "2026-01-23T11:00:00Z"
  }
}
```

**Flow:**
1. Backend calls payment aggregator API to create payment session
2. Return payment URL to mobile app
3. Mobile app opens in-app browser or deep links to Juice app
4. User completes payment
5. Payment gateway redirects to return_url with payment status

#### 5.7.2 Payment Callback (Webhook)

**Endpoint:** `POST /payments/callback`

**Note:** This endpoint receives webhooks from payment gateway, not called by mobile app

**Security:** Verify webhook signature using gateway's secret key

**Request Body** (from payment gateway):
```json
{
  "event": "payment.completed",
  "payment_id": "pay_abc123",
  "order_id": "uuid",
  "transaction_id": "txn_xyz789",
  "amount": 220.00,
  "currency": "MUR",
  "status": "success",
  "signature": "sha256_signature"
}
```

**Response:** `200 OK`

**Side Effects:**
1. Verify signature
2. Update order payment_status and payment_transaction_id
3. Update order status to 'payment_confirmed'
4. Send confirmation notification to customer
5. Alert admin of new paid order

#### 5.7.3 Verify Payment Status

**Endpoint:** `GET /payments/:payment_id/status`

**Headers:** `Authorization: Bearer {accessToken}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_abc123",
    "order_id": "uuid",
    "status": "completed",
    "transaction_id": "txn_xyz789",
    "amount": 220.00,
    "completed_at": "2026-01-23T10:45:00Z"
  }
}
```

### 5.8 Facebook Integration Endpoints (Admin)

**Base Path:** `/api/v1/admin/facebook`

#### 5.8.1 Trigger Manual Import

**Endpoint:** `POST /admin/facebook/import`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Request Body:**
```json
{
  "page_id": "61582787822940",
  "max_posts": 50
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "job_id": "import_abc123",
    "status": "processing",
    "message": "Import started, check status at /admin/facebook/import-status/:job_id"
  }
}
```

**Note:** Runs asynchronously due to potentially long execution time

#### 5.8.2 Get Import Status

**Endpoint:** `GET /admin/facebook/import-status/:job_id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "job_id": "import_abc123",
    "status": "completed",
    "posts_fetched": 45,
    "listings_created": 32,
    "listings_skipped": 13,
    "errors": [],
    "started_at": "2026-01-23T10:00:00Z",
    "completed_at": "2026-01-23T10:05:00Z"
  }
}
```

### 5.9 Notification Endpoints

**Base Path:** `/api/v1/notifications`

#### 5.9.1 Get My Notifications

**Endpoint:** `GET /notifications`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `unread_only` (boolean): Filter to unread notifications
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "order_status_update",
      "title": "Order Approved",
      "message": "Your order FR-2026-001234 has been approved and is being prepared",
      "read": false,
      "action_url": "freshroots://orders/uuid",
      "created_at": "2026-01-23T11:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "unread_count": 3
  }
}
```

#### 5.9.2 Mark Notification as Read

**Endpoint:** `PATCH /notifications/:id/read`

**Response:** `200 OK`

#### 5.9.3 Mark All as Read

**Endpoint:** `POST /notifications/read-all`

**Response:** `200 OK`

### 5.10 Analytics Endpoints (Future)

**Base Path:** `/api/v1/analytics`

**Note:** PostHog handles client-side event tracking. These endpoints are for admin dashboard analytics.

#### 5.10.1 Get Dashboard Stats

**Endpoint:** `GET /admin/analytics/dashboard`

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Query Parameters:**
- `from_date`, `to_date`: Date range

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2026-01-01",
      "to": "2026-01-23"
    },
    "orders": {
      "total": 150,
      "pending": 12,
      "approved": 120,
      "rejected": 8,
      "total_revenue": 45000.00
    },
    "users": {
      "total": 320,
      "new_this_period": 45
    },
    "listings": {
      "total": 85,
      "out_of_stock": 5
    },
    "popular_products": [
      {
        "id": "uuid",
        "title": "Organic Tomatoes",
        "total_orders": 45,
        "revenue": 3825.00
      }
    ]
  }
}
```

### 5.11 Rate Limiting

**Strategy:** Token bucket algorithm via Redis

**Limits by Tier:**
```
Anonymous (no auth):
  - 30 requests per 15 minutes per IP
  - Applied to: GET /listings, POST /auth/register, POST /auth/login

Authenticated User:
  - 100 requests per 15 minutes per user ID
  - Applied to: All authenticated endpoints

Admin:
  - 300 requests per 15 minutes per admin ID
  - Applied to: Admin endpoints

Special Endpoints:
  - POST /auth/login: 5 attempts per 15 minutes per email (prevent brute force)
  - POST /payments/callback: No limit (verified webhook)
```

**Response for Rate Limit Exceeded:** `429 Too Many Requests`
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again in 5 minutes",
    "retry_after": 300
  }
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706012400 (Unix timestamp)
```

### 5.12 API Documentation

**Access:** `https://api.freshroots.mu/api/docs`

**Auto-Generated:** Swagger/OpenAPI 3.0 spec from NestJS decorators

**Features:**
- Interactive API testing (Try It Out)
- Request/response schemas
- Authentication flow documentation
- Example requests for all endpoints
- Error code reference

---

## 6. Authentication & Authorization Strategy

This section defines the complete authentication and authorization architecture for Fresh Roots, ensuring secure access control across the platform.

### 6.1 Authentication Flow

#### 6.1.1 JWT (JSON Web Token) Architecture

**Token Types:**

**1. Access Token**
```
Purpose: Short-lived token for API authentication
Lifetime: 15 minutes
Storage: Mobile app memory (Redux state), never persisted to disk
Transmission: HTTP Authorization header: Bearer {token}

Payload Structure:
{
  "sub": "user_uuid",              // Subject (user ID)
  "email": "user@example.com",
  "role": "customer",              // or "admin"
  "iat": 1706009400,               // Issued at (timestamp)
  "exp": 1706010300                // Expiration (timestamp)
}

Signing Algorithm: HS256 (HMAC with SHA-256)
Secret: 256-bit secret key stored in environment variable
```

**2. Refresh Token**
```
Purpose: Long-lived token to obtain new access tokens
Lifetime: 30 days
Storage: 
  - Mobile: Expo SecureStore (encrypted, device keychain)
  - Backend: Redis with user_id:token_hash key
Transmission: Request body (not in headers)

Payload Structure:
{
  "sub": "user_uuid",
  "tokenId": "unique_token_id",    // For revocation tracking
  "iat": 1706009400,
  "exp": 1708601400                // 30 days
}

Signing Algorithm: HS256
Secret: Different secret from access token
```

#### 6.1.2 Registration & Login Flow

**Registration Flow:**
```
1. User submits registration form (email, password, name, phone)
2. Backend validates input:
   - Email format and uniqueness
   - Password strength (min 8 chars, 1 uppercase, 1 number, 1 special)
   - Phone format (Mauritius: +230 XXXX XXXX)
3. Hash password with bcrypt (cost factor 12)
4. Create user record in PostgreSQL
5. Generate access token (15 min) and refresh token (30 days)
6. Store refresh token hash in Redis with 30-day TTL
7. Return both tokens to client
8. Mobile app stores refresh token in SecureStore
9. Send verification email (optional for MVP)
```

**Login Flow:**
```
1. User submits email and password
2. Backend queries user by email
3. If user not found → return 401 Unauthorized (generic message to prevent email enumeration)
4. Compare password with bcrypt hash
5. If mismatch → return 401 Unauthorized
6. If match:
   - Generate new access token and refresh token
   - Store refresh token in Redis
   - Log login event (IP, device info)
   - Return tokens
7. Mobile app stores tokens
```

#### 6.1.3 Token Refresh Flow

```
1. Mobile app makes API request with expired access token
2. Backend returns 401 Unauthorized with error code TOKEN_EXPIRED
3. Mobile app intercepts 401 with TOKEN_EXPIRED code
4. App retrieves refresh token from SecureStore
5. App sends POST /auth/refresh with refresh token
6. Backend validates refresh token:
   - Verify JWT signature
   - Check expiration
   - Verify token exists in Redis (not revoked)
7. If valid:
   - Generate new access token
   - Generate new refresh token (token rotation)
   - Delete old refresh token from Redis
   - Store new refresh token in Redis
   - Return both new tokens
8. Mobile app updates tokens in memory and SecureStore
9. Retry original failed request with new access token
```

**Refresh Token Rotation:**
- Each refresh operation generates a new refresh token
- Old refresh token is immediately invalidated
- Prevents replay attacks: if old token is used again, all tokens for that user are revoked
- User must log in again (potential security breach detected)

#### 6.1.4 Logout Flow

```
1. User triggers logout in app
2. Mobile app sends POST /auth/logout with refresh token
3. Backend:
   - Deletes refresh token from Redis (token revocation)
   - Logs logout event
4. Mobile app:
   - Clears access token from Redux state
   - Deletes refresh token from SecureStore
   - Navigates to login screen
```

**Note:** Access tokens cannot be truly revoked due to stateless JWT design. 15-minute lifetime limits exposure window.

### 6.2 Authorization (Role-Based Access Control)

#### 6.2.1 User Roles

**Roles:**
```
1. customer (default): Regular users who can browse and purchase
2. admin: Elevated privileges for listing management and order processing
```

**Future Roles:**
```
3. seller: Individual sellers in multi-vendor expansion
4. delivery_driver: For delivery management module
5. moderator: Customer service role for handling disputes
```

#### 6.2.2 Permission Matrix

| Feature | Endpoint | customer | admin |
|---------|----------|----------|-------|
| **Listings** |
| Browse listings | GET /listings | ✓ | ✓ |
| View listing detail | GET /listings/:id | ✓ | ✓ |
| Create listing | POST /admin/listings | ✗ | ✓ |
| Update listing | PUT /admin/listings/:id | ✗ | ✓ |
| Delete listing | DELETE /admin/listings/:id | ✗ | ✓ |
| **Orders** |
| Express interest | POST /orders/express-interest | ✓ | ✓ |
| Create purchase | POST /orders/purchase-request | ✓ | ✓ |
| View own orders | GET /orders/my-orders | ✓ | ✓ |
| View all orders | GET /admin/orders | ✗ | ✓ |
| Approve order | PUT /admin/orders/:id/approve | ✗ | ✓ |
| Reject order | PUT /admin/orders/:id/reject | ✗ | ✓ |
| **Payments** |
| Initiate payment | POST /payments/initiate | ✓ | ✓ |
| View payment status | GET /payments/:id/status | ✓ (own) | ✓ (all) |
| **Facebook** |
| Trigger import | POST /admin/facebook/import | ✗ | ✓ |
| View import status | GET /admin/facebook/import-status/:id | ✗ | ✓ |
| **Analytics** |
| Dashboard stats | GET /admin/analytics/dashboard | ✗ | ✓ |

#### 6.2.3 Implementation: NestJS Guards

**JWT Auth Guard** (Applied to protected endpoints)
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Validates JWT signature and extracts user payload
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user; // Attached to request.user
  }
}
```

**Roles Guard** (Applied to admin-only endpoints)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No specific role required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some(role => user.role === role);
  }
}
```

**Usage Example:**
```typescript
@Controller('admin/listings')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply both guards
export class AdminListingsController {
  
  @Post()
  @Roles('admin') // Decorator specifies required role
  async createListing(@Body() dto: CreateListingDto, @CurrentUser() user) {
    // Only admin users reach this point
    return this.listingsService.create(dto, user.id);
  }
}
```

### 6.3 Password Security

#### 6.3.1 Password Requirements

**Minimum Requirements:**
- Length: 8-128 characters
- Must include:
  - At least 1 uppercase letter (A-Z)
  - At least 1 lowercase letter (a-z)
  - At least 1 number (0-9)
  - At least 1 special character (!@#$%^&*)

**Validation Regex:**
```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
```

**Rejected Patterns:**
- Common passwords (check against dictionary of top 10,000 passwords)
- User's email or name embedded in password
- Sequential characters (12345, abcde)

#### 6.3.2 Password Hashing

**Algorithm:** bcrypt

**Cost Factor:** 12
```
Cost 10 = ~100ms hash time
Cost 12 = ~300ms hash time (recommended balance)
Cost 14 = ~1,200ms hash time (too slow for UX)
```

**Rationale:**
- bcrypt is specifically designed for password hashing (unlike SHA-256)
- Adaptive: can increase cost factor as hardware improves
- Built-in salt generation (unique salt per password)
- Resistant to rainbow table and GPU brute-force attacks

**Implementation:**
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hashing (on registration/password change)
async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Verification (on login)
async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}
```

**Storage:**
- **NEVER** store plaintext passwords
- Store only bcrypt hash in `users.password_hash` column
- Hash length: 60 characters (VARCHAR(255) for future algorithm changes)

#### 6.3.3 Password Reset Flow (Future)

```
1. User clicks "Forgot Password"
2. User enters email address
3. Backend:
   - Check if email exists (return success regardless to prevent enumeration)
   - Generate secure random reset token (32 bytes, hex encoded)
   - Store token hash in Redis with 1-hour TTL, key: password_reset:{user_id}
   - Send email with reset link: https://freshroots.mu/reset-password?token={token}
4. User clicks email link
5. Mobile app/web validates token via API: GET /auth/reset-password/validate?token={token}
6. If valid, show password reset form
7. User submits new password
8. Backend:
   - Validates token (check Redis, not expired)
   - Validate new password against requirements
   - Hash new password with bcrypt
   - Update user.password_hash
   - Delete reset token from Redis
   - Invalidate all existing refresh tokens (force re-login on all devices)
   - Send "Password Changed" confirmation email
```

### 6.4 Security Best Practices

#### 6.4.1 Token Security

**Access Token:**
- Short lifetime (15 min) limits damage if compromised
- Never stored persistently (memory only)
- Transmitted only over HTTPS
- Validated on every request

**Refresh Token:**
- Stored encrypted in device secure storage
- Never transmitted in URL or query parameters
- Rotated on every refresh (single-use)
- Revocable (stored in Redis)
- Bound to device (future: include device fingerprint in payload)

#### 6.4.2 Session Management

**Concurrent Sessions:**
- MVP: Allow unlimited concurrent sessions (desktop + mobile)
- Future: Track all active sessions with device info
- Allow user to view and revoke sessions from settings

**Idle Timeout:**
- Access tokens auto-expire after 15 min of no activity
- Refresh tokens expire after 30 days absolute
- Future: Implement sliding window refresh (extends on use)

#### 6.4.3 Brute Force Protection

**Login Attempts:**
- Max 5 failed attempts per email per 15 minutes
- Implement using Redis counter with TTL
- After limit: temporary lockout, send email alert to user

**Password Reset:**
- Max 3 reset requests per email per hour
- Rate limit password reset form submission

#### 6.4.4 Account Enumeration Prevention

**Strategy:** Return generic error messages

**Example:**
```
❌ Bad: "Email address not found in our system"
✅ Good: "If that email address is in our system, we've sent a password reset link"

❌ Bad: "Incorrect password for user@example.com"
✅ Good: "Invalid email or password"
```

**Rationale:** Prevents attackers from determining which emails are registered users

#### 6.4.5 Two-Factor Authentication (Future Enhancement)

**Recommendation:** Implement TOTP (Time-based One-Time Password) in Month 3+

**Flow:**
1. User enables 2FA in settings
2. Backend generates secret key
3. Display QR code (generate with app like Google Authenticator)
4. User scans QR code
5. User enters first OTP to confirm setup
6. Backend validates and stores encrypted secret in database
7. On future logins:
   - User enters email/password
   - System prompts for 6-digit OTP
   - User enters code from authenticator app
   - Backend validates OTP (30-second window)
   - Issue tokens only if OTP valid

**Libraries:**
- Backend: `speakeasy` for TOTP generation/validation
- Frontend: `expo-barcode-scanner` for QR scanning (optional convenience)

---

## 7. Payment Integration Plan

This section compiles all payment integration research and defines the complete payment architecture for Fresh Roots, focusing on Mauritius-specific requirements [9, 10].

### 7.1 Payment Landscape in Mauritius

**Key Findings:**
- **MCB Juice** is the dominant mobile payment platform with 600,000+ active users
- No publicly accessible API or SDK for direct Juice integration
- Integration achieved through certified payment service providers (PSPs)
- Digital payment adoption accelerated post-COVID, now preferred over cash
- **Stripe is NOT available** in Mauritius without U.S. business entity setup
- Local PSPs provide unified access to multiple payment methods

### 7.2 Recommended Payment Architecture

#### 7.2.1 Primary Strategy: Payment Aggregator Integration

**Recommendation:** Integrate with **MIPS (Multiple Internet Payment System)** or **Paywise**

**MIPS Overview:**
- **Type:** Payment orchestrator (not traditional gateway)
- **HQ:** Mauritius ("Made in Moris" certified)
- **Key Feature:** Single API for Juice, My.T Money, Blink, cards
- **Compliance:** PCI DSS certified
- **Pricing:** Transaction-based fees (typically 2-3% + MUR 5-10 fixed fee)

**Paywise Overview:**
- **Type:** Full-service payment processor
- **HQ:** Mauritius with global banking connections
- **Key Feature:** Supports 50+ banks, 15 currencies, 3D-Secure
- **Compliance:** PCI DSS Level 1
- **Pricing:** Custom merchant agreement (competitive with MIPS)

**Selection Criteria:**
```
Evaluate both providers on:
1. Transaction fees (especially for MUR 200-500 average order value)
2. Settlement speed (daily vs. weekly payouts)
3. API documentation quality and developer support
4. Integration complexity (REST API, SDKs, webhooks)
5. Uptime SLA and historical reliability
6. Juice deep-linking support quality
7. Merchant onboarding timeline (typically 2-4 weeks)
```

**Recommendation:** Start discussions with both in parallel during Week 0, select based on fastest onboarding and best commercial terms.

#### 7.2.2 Payment Methods Supported

**1. MCB Juice (Priority 1)**
```
User Flow:
1. User selects "Pay with Juice" at checkout
2. Backend initiates payment with aggregator API
3. Aggregator returns payment URL/deep link
4. Mobile app options:
   a) Desktop/Web: Display QR code for user to scan with Juice app
   b) Mobile: Deep link to Juice app (juice://pay?ref=xxx)
5. User authorizes payment in Juice app
6. Juice app redirects back to Fresh Roots app
7. Backend receives webhook from aggregator confirming payment
8. Order status updated to payment_confirmed

Technical Details:
- Deep Link Scheme: juice://pay (if supported by aggregator)
- Fallback: In-app browser with QR code display
- Payment Reference: Include order_number for reconciliation
```

**2. My.T Money (Priority 2)**
```
Similar flow to Juice via aggregator
Deep Link: myt://pay (if available)
User Base: 200,000+ users (secondary to Juice but significant)
```

**3. Credit/Debit Cards (Priority 2)**
```
Supported Cards: Visa, Mastercard (issued by MCB, SBM, other local banks)
Flow: 
- Aggregator provides hosted payment page
- User enters card details on aggregator's secure page
- 3D-Secure authentication (OTP to user's phone)
- Payment processed through bank network
- Redirect back to app with payment result

PCI Compliance: SAQ-A (simplest) - card data never touches Fresh Roots servers
```

**4. Cash on Delivery (Priority 1)**
```
Implementation:
- Option selected at checkout (no external integration)
- Order created with payment_method = 'cash_on_delivery'
- payment_status = 'pending_cod'
- Apply COD surcharge (MUR 20-30) to offset handling cost
- Admin manually marks payment_status = 'completed' after cash received

Best Practices (from research):
✓ Set minimum order value (MUR 500) for COD eligibility
✓ Apply COD fee (MUR 25) clearly stated at checkout
✓ SMS/call verification before dispatch (reduce no-shows)
✓ Restrict COD for repeat customers with failed deliveries
✓ Track COD failure rate by region, disable in high-risk areas
```

### 7.3 Payment Flow Architecture

#### 7.3.1 Purchase Request with Card/Juice Payment

```
┌──────────────┐                ┌──────────────┐                ┌──────────────┐
│  Mobile App  │                │  NestJS API  │                │  MIPS/Paywise│
└──────┬───────┘                └──────┬───────┘                └──────┬───────┘
       │                               │                               │
       │ 1. POST /orders/              │                               │
       │    purchase-request           │                               │
       ├──────────────────────────────>│                               │
       │                               │                               │
       │                               │ 2. Validate stock, calculate  │
       │                               │    total, create order        │
       │                               │                               │
       │                               │ 3. POST /payments/initiate    │
       │                               │    {amount, order_id, method} │
       │                               ├──────────────────────────────>│
       │                               │                               │
       │                               │ 4. Return payment session     │
       │                               │<──────────────────────────────┤
       │                               │    {payment_url, session_id}  │
       │                               │                               │
       │ 5. Return order + payment_url │                               │
       │<──────────────────────────────┤                               │
       │                               │                               │
       │ 6. Open in-app browser or     │                               │
       │    deep link to Juice app     │                               │
       │ ────────────────────────────────────────────────────────────> │
       │                               │                        [User │
       │                               │                     Completes │
       │                               │                       Payment]│
       │                               │                               │
       │ 7. Redirect back to app       │                               │
       │ <──────────────────────────────────────────────────────────── │
       │                               │                               │
       │                               │ 8. Webhook: payment.completed │
       │                               │<──────────────────────────────┤
       │                               │                               │
       │                               │ 9. Verify signature, update   │
       │                               │    order payment_status       │
       │                               │                               │
       │                               │ 10. Send push notification    │
       │                               │     + email receipt           │
       │                               │                               │
       │ 11. Fetch updated order       │                               │
       ├──────────────────────────────>│                               │
       │                               │                               │
       │ 12. Return order with         │                               │
       │     status: payment_confirmed │                               │
       │<──────────────────────────────┤                               │
```

#### 7.3.2 Backend Payment Service Implementation

**Key Components:**

**Payment Service Interface:**
```typescript
interface IPaymentProvider {
  initiatePayment(params: InitiatePaymentDto): Promise<PaymentSessionDto>;
  verifyPaymentStatus(paymentId: string): Promise<PaymentStatusDto>;
  handleWebhook(payload: any, signature: string): Promise<WebhookResultDto>;
  refundPayment(transactionId: string, amount: number): Promise<RefundDto>;
}
```

**MIPS Provider Implementation:**
```typescript
@Injectable()
export class MipsPaymentProvider implements IPaymentProvider {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async initiatePayment(params: InitiatePaymentDto): Promise<PaymentSessionDto> {
    const { orderId, amount, paymentMethod, returnUrl } = params;
    
    // Call MIPS API to create payment session
    const response = await this.httpService.post(
      'https://api.mips.mu/v1/payments/create',
      {
        merchant_id: this.configService.get('MIPS_MERCHANT_ID'),
        order_id: orderId,
        amount: amount,
        currency: 'MUR',
        payment_method: paymentMethod, // 'juice', 'card', etc.
        return_url: returnUrl,
        webhook_url: 'https://api.freshroots.mu/v1/payments/callback',
      },
      {
        headers: {
          'Authorization': `Bearer ${this.configService.get('MIPS_API_KEY')}`,
          'Content-Type': 'application/json'
        }
      }
    ).toPromise();

    return {
      paymentId: response.data.payment_id,
      paymentUrl: response.data.payment_url,
      expiresAt: response.data.expires_at,
    };
  }

  async verifyPaymentStatus(paymentId: string): Promise<PaymentStatusDto> {
    const response = await this.httpService.get(
      `https://api.mips.mu/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.configService.get('MIPS_API_KEY')}`,
        }
      }
    ).toPromise();

    return {
      paymentId: response.data.payment_id,
      orderId: response.data.order_id,
      status: this.mapMipsStatus(response.data.status),
      transactionId: response.data.transaction_id,
      amount: response.data.amount,
      completedAt: response.data.completed_at,
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookResultDto> {
    // Verify webhook signature to ensure it's from MIPS
    const expectedSignature = this.generateSignature(payload);
    
    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // Process webhook event
    return {
      event: payload.event, // 'payment.completed', 'payment.failed'
      orderId: payload.order_id,
      transactionId: payload.transaction_id,
      status: this.mapMipsStatus(payload.status),
      amount: payload.amount,
    };
  }

  private generateSignature(payload: any): string {
    const secret = this.configService.get('MIPS_WEBHOOK_SECRET');
    const dataToSign = JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
  }

  private mapMipsStatus(mipsStatus: string): PaymentStatus {
    const statusMap = {
      'completed': PaymentStatus.COMPLETED,
      'pending': PaymentStatus.PENDING,
      'failed': PaymentStatus.FAILED,
      'refunded': PaymentStatus.REFUNDED,
    };
    return statusMap[mipsStatus] || PaymentStatus.UNKNOWN;
  }
}
```

**Webhook Security:**
```typescript
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('callback')
  async handlePaymentWebhook(
    @Body() payload: any,
    @Headers('x-mips-signature') signature: string
  ) {
    // 1. Verify signature
    const webhookResult = await this.paymentsService.handleWebhook(payload, signature);
    
    // 2. Update order in database
    await this.ordersService.updatePaymentStatus(
      webhookResult.orderId,
      webhookResult.status,
      webhookResult.transactionId
    );

    // 3. Send notification to customer
    if (webhookResult.status === PaymentStatus.COMPLETED) {
      await this.notificationsService.sendOrderConfirmation(webhookResult.orderId);
    }

    // 4. Alert admin of new paid order
    await this.notificationsService.alertAdminNewOrder(webhookResult.orderId);

    // 5. Return 200 OK to acknowledge webhook
    return { success: true };
  }
}
```

### 7.4 PCI Compliance Strategy

**Compliance Level:** PCI DSS SAQ-A (Self-Assessment Questionnaire A)

**Why SAQ-A:**
- Fresh Roots **never** handles, stores, or transmits cardholder data
- All card data is entered on the payment aggregator's hosted page
- Aggregator is PCI DSS Level 1 compliant and handles all card data
- Fresh Roots only receives tokenized transaction IDs

**Requirements for SAQ-A:**
1. Use only validated PCI DSS compliant PSP (✓ MIPS/Paywise)
2. All payment pages served over HTTPS/TLS (✓ Let's Encrypt)
3. Implement proper access controls (✓ JWT auth, role-based access)
4. Maintain information security policy (✓ Document in Month 2)
5. Conduct quarterly network security scans (✓ Use Qualys or similar)

**Annual Compliance Process:**
1. Complete SAQ-A questionnaire (12 questions, ~1 hour)
2. Attestation of Compliance (AOC) signed by authorized personnel
3. Submit to acquiring bank (if required) or maintain internally
4. Quarterly vulnerability scans by Approved Scanning Vendor (ASV)

**Cost:** $0 for SAQ-A self-assessment, ~$200-500/year for ASV scanning

### 7.5 Cash on Delivery (COD) Implementation

#### 7.5.1 COD Workflow

**Checkout Flow:**
```
1. User selects "Cash on Delivery" payment method
2. Display COD terms clearly:
   - COD fee: MUR 25
   - Total amount due at delivery
   - Exact change appreciated or mobile payment option
3. Backend creates order with:
   - payment_method = 'cash_on_delivery'
   - payment_status = 'pending_cod'
   - cod_fee = 25.00 applied to total
4. Send SMS confirmation with order details and COD amount
5. Admin receives order notification in dashboard
6. Admin workflow:
   a) Verify order via SMS/call (optional)
   b) Approve order
   c) Prepare for delivery
   d) Update status to 'out_for_delivery'
7. Delivery completion:
   a) Admin (or driver) marks order as 'delivered'
   b) Admin manually updates payment_status = 'completed'
   c) Enter collected amount and any notes
8. Customer receives delivery confirmation notification
```

#### 7.5.2 COD Risk Mitigation

**Minimum Order Value:**
```
Threshold: MUR 500
Rationale: Delivery cost + COD handling makes small orders unprofitable
Implementation: Validation at checkout:
  if (paymentMethod === 'cod' && totalAmount < 500) {
    throw new BadRequestException('Minimum order value for COD is MUR 500');
  }
```

**COD Fee:**
```
Amount: MUR 20-30 (test MUR 25)
Rationale: 
  - Offsets cash handling, verification, failed delivery risk
  - Encourages digital payment adoption
  - Industrystandard practice (Jumbo, Winners charge similar)
Display: Clearly itemized at checkout as "COD Service Fee: MUR 25"
```

**Customer Verification:**
```
Implementation:
1. After order creation, trigger automated SMS:
   "Hi [Name], confirm your COD order FR-2026-001234 for MUR 545 to [address]. Reply YES to confirm."
2. Track SMS response in admin dashboard
3. Optional: Admin can call for high-value orders (>MUR 2,000)
4. If no confirmation within 2 hours, mark order as 'verification_pending'
5. Admin decides to proceed or cancel

Technology:
- SMS Gateway: Use Twilio or local provider (e.g., Emtel Business SMS)
- Cost: ~MUR 0.50 per SMS, negligible vs. failed delivery cost (MUR 50-100)
```

**Customer History Tracking:**
```
Metrics per customer:
- Total COD orders
- Successful deliveries
- Failed deliveries (not home, refused, incorrect address)
- Cancellation rate

Business Rules:
- If failed_delivery_rate > 30%: Disable COD for customer, require prepayment
- If 3 consecutive failed deliveries: Permanent COD restriction
- Good customers (>5 successful deliveries): Waive COD fee as loyalty benefit

Implementation:
Add fields to users table:
- cod_orders_count
- cod_failed_count
- cod_eligible (boolean)

Update via trigger on order status change
```

**Geographic Restrictions:**
```
Analysis (Month 2-3):
1. Track COD success rate by delivery region (postal code)
2. Identify high-risk areas (low success rate, far delivery distance)
3. Disable COD for specific postal codes or offer only with verification

Example:
if (deliveryPostalCode in HIGH_RISK_ZONES && paymentMethod === 'cod') {
  throw new BadRequestException('COD not available in your area. Please use online payment.');
}
```

#### 7.5.3 COD Dashboard (Admin)

**Metrics to Display:**
- Pending COD orders count
- COD revenue collected today/week/month
- COD failure rate
- Top customers by COD usage
- High-risk orders requiring verification

**Admin Actions:**
- Mark order as "COD Collected" with amount
- Record failed delivery with reason
- Flag customer for COD restriction

### 7.6 Fallback & Contingency Planning

**Scenario 1: Payment Aggregator API Downtime**
```
Detection: Webhook not received within 5 minutes or API timeout
Fallback:
1. Display to user: "Payment processing, please check back in 5 minutes"
2. Backend retries status check every 60 seconds for 10 minutes
3. If still no confirmation:
   - Send email to admin with order details
   - Admin manually verifies payment via aggregator dashboard
   - Admin manually updates order payment status
4. Send apology email/notification to customer with order status
```

**Scenario 2: Juice Deep Link Fails**
```
Problem: Deep link doesn't open Juice app on user's device
Fallback:
1. Detect failure (user returns to app within 5 seconds)
2. Automatically switch to QR code display mode
3. Show instructions: "Scan this QR code with your Juice app to complete payment"
4. Display QR code full-screen with countdown timer (5 minutes)
```

**Scenario 3: Complete Aggregator Service Failure**
```
Immediate Action:
1. Disable digital payments in app (show only COD option)
2. Display banner: "Online payments temporarily unavailable. COD still accepted."
3. Alert all admins via email/SMS

Recovery:
- If downtime < 2 hours: Wait for restoration
- If downtime > 2 hours: Activate backup aggregator (if second provider integrated)
- If downtime > 24 hours: Consider emergency Stripe setup or manual bank transfer flow
```

**Scenario 4: Unable to Secure Aggregator Partnership**
```
Contingency Timeline:
Week 0-1: Prioritize MIPS/Paywise onboarding in parallel
Week 2: If blocked, begin Stripe account setup via U.S. LLC route
Week 3: If both fail, launch with COD-only MVP
Week 4: Continue partnership discussions, integrate payment when ready

Stripe via U.S. LLC:
- Form Delaware LLC: ~$300 + $50 registered agent (via services like Stripe Atlas)
- Apply for EIN (free): 1-2 weeks
- Open U.S. bank account: Mercury or Wise Business (~1 week)
- Create Stripe account: Instant
- Total time: 3-4 weeks
- Ongoing: File annual Delaware franchise tax ($300/year), U.S. tax returns
```

### 7.7 Payment Testing Strategy

**Sandbox/Test Mode:**
```
All payment aggregators provide test environments
Request test API credentials during onboarding

Test Cards (typical for MIPS/Paywise):
- Success: 4111 1111 1111 1111, any future expiry, any CVV
- Decline (insufficient funds): 4000 0000 0000 0002
- 3D-Secure required: 4000 0000 0000 3220

Test Juice Payments:
- Aggregator provides test Juice account or mock flow
- Simulate approval and rejection scenarios
```

**Test Checklist (Week 3):**
```
□ Successful card payment end-to-end
□ Failed card payment handling (show user-friendly error)
□ Successful Juice payment (if deep link available)
□ Juice payment via QR code fallback
□ Payment timeout handling (webhook not received)
□ Duplicate webhook handling (idempotency)
□ Refund initiation (admin-triggered)
□ COD order creation and workflow
□ Payment status verification API call
□ Webhook signature validation (invalid signature rejected)
```

### 7.8 Payment Reporting & Reconciliation

**Daily Reconciliation Process:**
```
1. Generate report from Fresh Roots database:
   - All orders with payment_status = 'completed'
   - Group by payment_method
   - Sum total_amount

2. Download settlement report from aggregator dashboard
   - List of transactions settled
   - Gross amount, fees, net amount

3. Match transactions:
   - Compare order_number or transaction_id
   - Flag discrepancies (orders in Fresh Roots but not in aggregator, or vice versa)

4. Manual review of flagged items:
   - Missing webhooks (fetch status via API)
   - Refunds or chargebacks
   - Settlement timing differences (T+1 or T+2)

5. Update accounting system with net revenue
```

**Automation (Month 3+):**
- Scheduled cron job to fetch aggregator report via API
- Automated matching algorithm
- Email report to admin with flagged discrepancies

### 7.9 Refunds & Dispute Handling

**Refund Triggers:**
- Admin rejects order after payment completed
- Customer returns damaged goods
- Overcharge or pricing error
- Delivery failure (non-COD orders)

**Refund Process:**
```
1. Admin initiates refund from order detail page
2. Admin enters refund amount and reason
3. Backend calls aggregator refund API:
   POST /v1/payments/{transactionId}/refund
   { amount: 220.00, reason: "Order rejected - out of stock" }
4. Aggregator processes refund to original payment method
5. Update order payment_status = 'refunded'
6. Log action in admin_actions table
7. Send email to customer confirming refund
8. Notify customer refund will appear in 5-7 business days
```

**Refund Timeline:**
- Juice/My.T Money: Typically instant to 24 hours
- Credit/Debit cards: 5-10 business days (bank processing time)

**Dispute Handling (Chargebacks):**
```
If customer disputes charge with bank:
1. Aggregator notifies Fresh Roots via email/webhook
2. Provide evidence within 7-14 days:
   - Order confirmation
   - Delivery confirmation (signature/photo)
   - Customer communication logs
3. Aggregator submits evidence to card network
4. Decision: Merchant wins (funds retained) or Customer wins (refund issued + chargeback fee MUR 200-400)

Prevention:
- Clear product descriptions and images
- Delivery confirmation with signature
- Responsive customer service
- Easy refund process (reduces chargeback motivation)
```

---

## 8. Facebook Listing Import/Sync Plan

This section compiles research on Facebook Graph API integration and defines the complete workflow for importing product listings from the Fresh Roots Facebook page [11].

### 8.1 Facebook Graph API Overview

**Key Findings from Research:**
- No single endpoint to directly "import products" from a Page
- Requires creating a **Product Catalog** and adding **Product Items** programmatically
- Access requires **Page Access Token** with specific permissions
- Subject to **Business Use Case (BUC) rate limits**
- Web scraping is technically possible but highly discouraged (fragile, violates TOS)

**Facebook Page:**
- URL: `https://www.facebook.com/profile.php?id=61582787822940`
- Page ID: `61582787822940`
- Current content: Product posts with images, descriptions, prices

### 8.2 Integration Architecture

#### 8.2.1 Workflow: Semi-Automated Import with Manual Review

**Rationale:**
- Fully automated import risks importing irrelevant posts or incorrectly parsed data
- Manual review step ensures quality control
- Admin can edit/enhance listings before publishing

**Workflow:**
```
┌─────────────────────────────────────────────────────────────┐
│                 FACEBOOK IMPORT WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

1. [Admin] Triggers import from admin dashboard
   └─> POST /api/v1/admin/facebook/import
   
2. [Backend] Fetches Page Access Token from secure storage
   └─> Verify token is not expired
   
3. [Backend] Calls Facebook Graph API
   └─> GET /v1.0/{page-id}/feed?fields=id,message,created_time,full_picture,attachments
   
4. [Backend] Parses each post
   ├─> Extract product title from first line of message
   ├─> Extract description from remaining message text
   ├─> Parse price (regex patterns: "MUR 85", "Rs 85", "85 rupees")
   ├─> Extract image URLs from attachments
   └─> Save parsed data as DRAFT listing
   
5. [Backend] Returns import summary
   └─> "45 posts fetched, 32 products parsed, 13 skipped"
   
6. [Admin] Reviews draft listings in dashboard
   ├─> Views: title, description, price, images
   ├─> Actions:
   │   ├─> Edit any field (title, price, category, tags)
   │   ├─> Publish (moves to active listings)
   │   ├─> Discard
   │   └─> Bulk publish all
   └─> Each published listing links to original FB post_id
   
7. [System] Scheduled sync (optional, future)
   └─> Daily cron job checks for new posts since last import
   └─> Repeats steps 3-6 automatically
```

### 8.3 Required Permissions & Access Token

#### 8.3.1 Facebook App Setup

**Prerequisites:**
1. Admin must have Facebook Developer account
2. Create a Facebook App in Facebook Developers console
3. Add **Fresh Roots** Facebook Page to the app

**App Configuration:**
```
App Name: Fresh Roots Marketplace
App Purpose: Business
Category: E-commerce
Privacy Policy URL: https://freshroots.mu/privacy
Terms of Service URL: https://freshroots.mu/terms

Products to Add:
- Facebook Login (for obtaining user access token)
- Marketing API (for catalog management - future)
```

#### 8.3.2 Permissions Required

**Page Permissions:**
```
pages_read_engagement: Read Page posts and content
pages_show_list: Display list of Pages user manages
pages_manage_posts: Manage Page posts (optional, for auto-posting)
```

**Public Content Access (for public page data):**
```
Required Feature: Page Public Content Access
Status: Requires App Review for production use
Approval Time: 3-5 business days
Alternative: Use dev/test mode with admin user access (sufficient for MVP)
```

#### 8.3.3 Obtaining Page Access Token

**Process:**
```
1. User Authorization (One-time setup by admin)
   ├─> Admin logs into Fresh Roots admin dashboard
   ├─> Navigates to Settings > Facebook Integration
   ├─> Clicks "Connect Facebook Page"
   ├─> Redirected to Facebook OAuth dialog
   ├─> Grants requested permissions
   └─> Redirected back to Fresh Roots with authorization code

2. Backend Token Exchange
   ├─> POST https://graph.facebook.com/v19.0/oauth/access_token
   ├─> Params: {
   │     client_id: {app_id},
   │     client_secret: {app_secret},
   │     redirect_uri: "https://admin.freshroots.mu/auth/facebook/callback",
   │     code: {authorization_code}
   │   }
   └─> Receives: User Access Token (short-lived, 1 hour)

3. Get Page Access Token
   ├─> GET https://graph.facebook.com/v19.0/me/accounts
   ├─> Header: Authorization: Bearer {user_access_token}
   ├─> Response: List of pages user manages
   ├─> Extract Page Access Token for Fresh Roots page
   └─> This token is long-lived (60 days) or never expires if user doesn't change password

4. Store Securely
   ├─> Encrypt Page Access Token
   ├─> Store in database or AWS Secrets Manager
   └─> Backend retrieves token for API calls
```

**Token Renewal:**
```
Issue: Page Access Tokens expire after 60 days or if user changes password
Solution:
  1. Detect expired token (API returns error code 190)
  2. Prompt admin to reconnect Facebook account
  3. Repeat authorization flow
Alternative (Future):
  - Implement automatic token refresh using long-lived tokens
  - Monitor token expiration and refresh proactively
```

### 8.4 API Endpoints & Implementation

#### 8.4.1 Fetching Page Feed

**Graph API Call:**
```
GET https://graph.facebook.com/v19.0/{page-id}/feed

Query Parameters:
  fields: id,message,created_time,full_picture,attachments{media,url,subattachments},permalink_url
  limit: 50 (max posts per request)
  since: {timestamp} (optional, fetch posts after specific date)

Headers:
  Authorization: Bearer {page_access_token}
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "61582787822940_123456789",
      "message": "Fresh Organic Tomatoes\nPerfectly ripe, straight from Plaine Magnien farm\nMUR 85 per kg\nFree delivery on orders above MUR 1000",
      "created_time": "2026-01-20T08:30:00+0000",
      "full_picture": "https://images.pexels.com/photos/712497/pexels-photo-712497.jpeg",
      "attachments": {
        "data": [
          {
            "media": {
              "image": {
                "src": "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?cs=srgb&dl=pexels-julia-nagy-568948-1327838.jpg&fm=jpg"
              }
            },
            "url": "https://images.pexels.com/photos/1367242/pexels-photo-1367242.jpeg"
          }
        ]
      },
      "permalink_url": "https://www.facebook.com/profile.php?id=61582787822940&post=123"
    }
  ],
  "paging": {
    "next": "https://graph.facebook.com/v19.0/{page-id}/feed?after=..."
  }
}
```

#### 8.4.2 Post Parsing Logic

**Implementation:**
```typescript
interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  full_picture?: string;
  attachments?: any;
  permalink_url: string;
}

interface ParsedListing {
  title: string;
  description: string;
  price: number | null;
  currency: string;
  unit: string | null;
  images: string[];
  facebook_post_id: string;
  facebook_post_url: string;
  raw_message: string; // Store original for review
}

function parsePostToListing(post: FacebookPost): ParsedListing | null {
  const message = post.message || '';
  const lines = message.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return null; // Skip posts without text
  }
  
  // Extract title (first line)
  const title = lines[0].substring(0, 255); // Truncate to DB limit
  
  // Extract price
  const pricePattern = /(MUR|Rs\.?|rupees?)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi;
  const priceMatch = message.match(pricePattern);
  let price: number | null = null;
  let currency = 'MUR';
  
  if (priceMatch) {
    const numericPrice = priceMatch[0].match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (numericPrice) {
      price = parseFloat(numericPrice[0].replace(/,/g, ''));
    }
  }
  
  // Extract unit
  const unitPattern = /per\s+(kg|kilogram|piece|bunch|pack)/gi;
  const unitMatch = message.match(unitPattern);
  let unit: string | null = null;
  
  if (unitMatch) {
    unit = unitMatch[0].replace(/per\s+/i, '').toLowerCase();
    // Normalize units
    if (unit === 'kilogram') unit = 'kg';
  }
  
  // Extract description (remaining lines, exclude price line)
  const description = lines.slice(1).join('\n').substring(0, 5000);
  
  // Extract images
  const images: string[] = [];
  if (post.full_picture) {
    images.push(post.full_picture);
  }
  if (post.attachments?.data) {
    post.attachments.data.forEach(attachment => {
      const imageSrc = attachment.media?.image?.src;
      if (imageSrc && !images.includes(imageSrc)) {
        images.push(imageSrc);
      }
      // Handle multiple images in subattachments
      if (attachment.subattachments?.data) {
        attachment.subattachments.data.forEach(sub => {
          const subSrc = sub.media?.image?.src;
          if (subSrc && !images.includes(subSrc)) {
            images.push(subSrc);
          }
        });
      }
    });
  }
  
  return {
    title,
    description: description || title, // Fallback if no description
    price,
    currency,
    unit,
    images,
    facebook_post_id: post.id,
    facebook_post_url: post.permalink_url,
    raw_message: post.message,
  };
}
```

**Handling Edge Cases:**
```typescript
function validateParsedListing(parsed: ParsedListing): ValidationResult {
  const errors: string[] = [];
  
  if (!parsed.title || parsed.title.length < 3) {
    errors.push('Title too short or missing');
  }
  
  if (!parsed.price || parsed.price <= 0) {
    errors.push('Invalid or missing price');
  }
  
  if (!parsed.unit) {
    // Don't reject, but flag for admin review
    console.warn(`No unit found for: ${parsed.title}`);
  }
  
  if (parsed.images.length === 0) {
    errors.push('No images found');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    requiresReview: !parsed.unit || errors.length > 0
  };
}
```

#### 8.4.3 Saving Draft Listings

**Database Approach:**

**Option 1: Add `status` field to listings table**
```sql
ALTER TABLE listings ADD COLUMN status VARCHAR(20) DEFAULT 'active';
-- Values: 'draft', 'active', 'archived'

CREATE INDEX idx_listings_status ON listings(status);
```

**Option 2: Create separate `draft_listings` table**
```sql
CREATE TABLE draft_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  unit VARCHAR(20),
  images JSONB, -- Array of image URLs
  facebook_post_id VARCHAR(255),
  facebook_post_url TEXT,
  raw_facebook_message TEXT,
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requires_review BOOLEAN DEFAULT FALSE,
  review_notes TEXT,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Recommendation:** Option 1 (status field) for simplicity. MVP can manage all listings in one table.

**Backend Service:**
```typescript
@Injectable()
export class FacebookImportService {
  constructor(
    private httpService: HttpService,
    private listingsService: ListingsService,
    private configService: ConfigService,
  ) {}

  async importPostsFromPage(pageId: string, maxPosts: number = 50): Promise<ImportResult> {
    const pageAccessToken = await this.getPageAccessToken();
    const posts = await this.fetchPageFeed(pageId, pageAccessToken, maxPosts);
    
    const result: ImportResult = {
      postsFetched: posts.length,
      listingsCreated: 0,
      listingsSkipped: 0,
      errors: [],
    };
    
    for (const post of posts) {
      try {
        const parsed = parsePostToListing(post);
        if (!parsed) {
          result.listingsSkipped++;
          continue;
        }
        
        const validation = validateParsedListing(parsed);
        
        // Create draft listing
        const draftListing = await this.listingsService.create({
          ...parsed,
          status: 'draft',
          is_available: false, // Hidden from public until published
          admin_id: null, // Not yet assigned to admin
        });
        
        result.listingsCreated++;
      } catch (error) {
        result.errors.push({
          post_id: post.id,
          error: error.message
        });
        result.listingsSkipped++;
      }
    }
    
    return result;
  }

  private async fetchPageFeed(pageId: string, token: string, limit: number): Promise<FacebookPost[]> {
    const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const params = {
      fields: 'id,message,created_time,full_picture,attachments{media,url,subattachments},permalink_url',
      limit: limit,
      access_token: token,
    };
    
    const response = await this.httpService.get(url, { params }).toPromise();
    return response.data.data || [];
  }

  private async getPageAccessToken(): Promise<string> {
    // Retrieve from secure storage (database or AWS Secrets Manager)
    const token = await this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    if (!token) {
      throw new Error('Facebook Page Access Token not configured');
    }
    return token;
  }
}
```

### 8.5 Admin Review Interface

**Draft Listings Dashboard:**

**Features:**
- Table view of all draft listings
- Columns: Title, Price, Unit, Image thumbnail, Facebook Link, Actions
- Filter by: Requires Review, All Drafts
- Sort by: Parse Date, Title

**Individual Listing Review:**
```
┌─────────────────────────────────────────────────────────┐
│          DRAFT LISTING REVIEW                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Image Gallery: 3 images]                             │
│                                                         │
│  Title: [Editable Input: "Fresh Organic Tomatoes"]     │
│                                                         │
│  Description: [Textarea: "Perfectly ripe..."]          │
│                                                         │
│  Price: [Input: 85.00]  Currency: [MUR ▼]              │
│                                                         │
│  Unit: [Dropdown: kg, piece, bunch, pack]              │
│                                                         │
│  Stock Quantity: [Input: 50]                           │
│                                                         │
│  Location: [Input: "Plaine Magnien"]                   │
│                                                         │
│  Category: [Dropdown: Vegetables, Fruits, Herbs...]    │
│                                                         │
│  Tags: [Multi-select: organic, local, fresh]           │
│                                                         │
│  Facebook Post: [View Original Post ↗]                 │
│                                                         │
│  Actions:                                              │
│  [Publish Listing]  [Save Draft]  [Discard]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Bulk Actions:**
- Select multiple draft listings (checkbox)
- Bulk Publish: Publish all selected (if validation passes)
- Bulk Discard: Delete selected drafts
- Bulk Assign Category: Apply category to selected

### 8.6 Rate Limiting & Best Practices

#### 8.6.1 Facebook Rate Limits

**Business Use Case (BUC) Rate Limits:**
```
Formula: 20,000 + 20,000 * log2(unique_users) calls per hour

For Fresh Roots (initially 1-2 users = admin):
  20,000 + 20,000 * log2(2) = 20,000 + 20,000 * 1 = 40,000 calls/hour

Per-endpoint typical limit: 200 calls per hour per user

Conclusion: MVP usage (manual imports, ~1-2 times/day) is well below limits
```

**Rate Limit Headers:**
```
Response headers from Graph API:
  X-Business-Use-Case: {"61582787822940":{"call_count":5,"total_cputime":10,"total_time":15,"type":"pages"}}

call_count: Number of calls made in current window
total_cputime: CPU time used
total_time: Actual time spent

Monitor these headers to track usage
```

**Rate Limit Handling:**
```typescript
async function fetchWithRateLimitHandling(url: string, options: any): Promise<any> {
  try {
    const response = await axios.get(url, options);
    
    // Log usage for monitoring
    const bucUsage = response.headers['x-business-use-case'];
    if (bucUsage) {
      console.log('Facebook API usage:', JSON.parse(bucUsage));
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 || error.response?.data?.error?.code === 32) {
      // Rate limit exceeded
      const retryAfter = parseInt(error.response.headers['retry-after'] || '3600');
      console.error(`Rate limit hit. Retry after ${retryAfter} seconds`);
      throw new Error(`Facebook rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
    }
    throw error;
  }
}
```

#### 8.6.2 Best Practices

**Minimize API Calls:**
1. **Cache Results:**
   - Cache fetched posts in Redis for 1 hour
   - If admin triggers import again within 1 hour, return cached results
   
2. **Incremental Sync:**
   - Use `since` parameter to fetch only new posts since last import
   - Store last import timestamp in database
   ```typescript
   const lastImportTime = await this.getLastImportTimestamp(pageId);
   const params = {
     ...baseParams,
     since: lastImportTime,
   };
   ```

3. **Pagination:**
   - Respect `paging.next` URL for fetching multiple pages
   - Stop after `maxPosts` or `maxPages` limit to avoid excessive calls

**Error Handling:**
```
Common Errors:
1. Error 190: Expired/Invalid Access Token
   → Re-prompt admin to reconnect Facebook account

2. Error 100: Invalid parameter (e.g., wrong field name)
   → Log error, skip post, continue import

3. Error 4: Too many requests
   → Implement exponential backoff, wait and retry

4. Network timeout
   → Retry up to 3 times with 5-second delay
```

### 8.7 Automated Sync (Future Enhancement)

**Scheduled Import:**
```typescript
@Injectable()
export class FacebookSyncScheduler {
  constructor(private facebookImportService: FacebookImportService) {}

  // Run daily at 2 AM MUT (off-peak)
  @Cron('0 2 * * *', { timeZone: 'Indian/Mauritius' })
  async handleDailySync() {
    console.log('Starting automated Facebook sync...');
    
    try {
      const result = await this.facebookImportService.importPostsFromPage(
        process.env.FACEBOOK_PAGE_ID,
        20 // Fetch max 20 new posts per day
      );
      
      if (result.listingsCreated > 0) {
        // Notify admin of new draft listings
        await this.notificationsService.alertAdminNewDrafts(result.listingsCreated);
      }
      
      console.log(`Facebook sync completed: ${result.listingsCreated} new drafts`);
    } catch (error) {
      console.error('Facebook sync failed:', error);
      // Alert admin of failure
      await this.notificationsService.alertAdminSyncFailed(error.message);
    }
  }
}
```

**Smart Sync:**
- Only run if new posts exist (check post count first)
- Skip if last sync was < 12 hours ago and no manual trigger
- Pause sync if error rate > 50% (likely permission or token issue)

### 8.8 Fallback: Manual Listing Creation

**Always Available:**
- Admin dashboard must have manual listing creation form
- If Facebook integration fails (API access denied, app review rejected), admin can manually create listings
- Manual form is faster than re-typing from Facebook (can copy-paste from FB post)

**Enhanced Manual Creation:**
- **Image Upload from URL:** Admin pastes Facebook image URL, backend downloads and uploads to Cloudinary
- **Import from CSV:** For bulk creation, admin can prepare CSV from Facebook page export
  - Columns: title, description, price, unit, image_url_1, image_url_2, etc.
  - Backend validates and imports all rows

---

## 9. Notification Architecture

This section compiles notification research and defines the complete strategy for push, email, and in-app notifications [12].

### 9.1 Notification Requirements

**User Notifications:**
- Order status updates (approved, out for delivery, delivered)
- Payment confirmations
- Special promotions (future)
- Low stock alerts for favorite items (future)

**Admin Notifications:**
- New purchase requests (high priority)
- New interest expressions
- Low stock alerts
- Facebook import completion
- Payment system issues
- System errors (via Sentry email)

### 9.2 Push Notifications

#### 9.2.1 Phase 1: Expo Push Notifications (MVP)

**Recommendation for MVP (Weeks 1-4)**

**Justification:**
- **Zero Configuration:** Works out-of-box with Expo apps, no native setup required
- **Free:** No cost for unlimited notifications
- **Perfect for Development:** Instant testing with Expo Go
- **Fast Integration:** Can be implemented in 1-2 hours

**How Expo Push Works:**
```
1. Mobile app registers for push notifications
   └─> Returns Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxx]

2. App sends token to backend via API
   └─> POST /api/v1/users/register-push-token
   └─> Store in database: users.expo_push_token

3. Backend triggers notification
   └─> Constructs notification payload
   └─> Sends to Expo Push API
   └─> Expo routes to FCM (Android) or APNs (iOS)

4. Device receives notification
   └─> User taps notification
   └─> App opens to relevant screen (deep linking)
```

**Implementation:**

**Mobile App (React Native):**
```typescript
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission and get token
async function registerForPushNotifications() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    
    console.log('Expo Push Token:', token);
    
    // Send to backend
    await api.post('/users/register-push-token', { token });
  } else {
    alert('Must use physical device for Push Notifications');
  }
}

// Handle notification received while app is foregrounded
Notifications.addNotificationReceivedListener(notification => {
  console.log('Notification received:', notification);
  // Update UI or show in-app banner
});

// Handle notification tap
Notifications.addNotificationResponseReceivedListener(response => {
  const data = response.notification.request.content.data;
  
  // Deep link to relevant screen
  if (data.type === 'order_update') {
    navigation.navigate('OrderDetail', { orderId: data.order_id });
  }
});
```

**Backend (NestJS):**
```typescript
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class ExpoPushService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    // Check that token is valid Expo push token
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
      return;
    }

    const message: ExpoPushMessage = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data || {},
      priority: 'high',
      channelId: 'default', // Android notification channel
    };

    try {
      const tickets = await this.expo.sendPushNotificationsAsync([message]);
      console.log('Push notification sent:', tickets);
      
      // Handle tickets (check for errors)
      for (const ticket of tickets) {
        if (ticket.status === 'error') {
          console.error(`Error sending push: ${ticket.message}`);
          // If token is invalid, mark in database
          if (ticket.details?.error === 'DeviceNotRegistered') {
            await this.usersService.invalidatePushToken(expoPushToken);
          }
        }
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  async sendOrderUpdateNotification(userId: string, order: Order): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user.expo_push_token) {
      console.log(`User ${userId} has no push token registered`);
      return;
    }

    const title = 'Order Update';
    const body = this.getOrderUpdateMessage(order);
    const data = {
      type: 'order_update',
      order_id: order.id,
      order_number: order.order_number,
    };

    await this.sendPushNotification(user.expo_push_token, title, body, data);
  }

  private getOrderUpdateMessage(order: Order): string {
    const statusMessages = {
      'approved': `Your order ${order.order_number} has been approved!`,
      'preparing': `Your order is being prepared for delivery.`,
      'out_for_delivery': `Your order is out for delivery! It should arrive soon.`,
      'delivered': `Your order has been delivered. Enjoy your fresh produce!`,
      'rejected': `Sorry, your order ${order.order_number} could not be processed.`,
    };
    return statusMessages[order.status] || `Order ${order.order_number} status: ${order.status}`;
  }
}
```

**Batch Sending (Admin Broadcast):**
```typescript
async sendBulkNotifications(userIds: string[], title: string, body: string): Promise<void> {
  const users = await this.usersService.findByIds(userIds);
  const messages: ExpoPushMessage[] = [];

  for (const user of users) {
    if (user.expo_push_token && Expo.isExpoPushToken(user.expo_push_token)) {
      messages.push({
        to: user.expo_push_token,
        title,
        body,
        sound: 'default',
      });
    }
  }

  // Send in chunks of 100 (Expo API limit)
  const chunks = this.expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await this.expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error('Error sending chunk:', error);
    }
  }
}
```

**Database Schema Addition:**
```sql
ALTER TABLE users ADD COLUMN expo_push_token VARCHAR(255);
CREATE INDEX idx_users_expo_push_token ON users(expo_push_token);

-- Future: Track multiple devices per user
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20), -- 'ios', 'android'
  expo_push_token VARCHAR(255),
  fcm_token VARCHAR(255), -- Native FCM token for Phase 2
  device_name VARCHAR(255),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 9.2.2 Phase 2: OneSignal (Growth)

**Migration Trigger:**
- User base > 5,000 OR
- Need advanced segmentation (e.g., target users in specific city) OR
- Marketing wants A/B testing for notifications OR
- Need rich media notifications (images, action buttons)

**OneSignal Advantages:**
- **Advanced Targeting:** Segment users by: location, behavior, user properties, tags
- **A/B Testing:** Test notification copy, timing, images for max engagement
- **Rich Notifications:** Include images, action buttons ("View Order", "Reorder")
- **Omnichannel:** Also supports email, SMS, in-app messages from one platform
- **Analytics:** Detailed delivery, open, click rates per campaign
- **Scheduled Campaigns:** Automated drip campaigns (e.g., "Come back!" after 7 days inactive)

**Cost Comparison:**
```
OneSignal Pricing (2026 rates):
- Free: Up to 1,000 users, unlimited notifications
- Growth: $9/month for 1,000-10,000 users
- Professional: $39/month for 10,000-25,000 users
- Enterprise: $309/month for 100,000 users

Expo Push: Always free, but no advanced features

Decision Point: When advanced targeting/analytics value > $39/month cost
```

**Migration Strategy:**
```
1. Week before migration:
   - Integrate OneSignal SDK in React Native app
   - Configure OneSignal dashboard (app settings, notification templates)
   - Test in dev environment

2. Migration week:
   - Deploy app update with OneSignal SDK (both SDKs can coexist temporarily)
   - Backend starts collecting both Expo and OneSignal player IDs
   - Gradual rollout: 10% users → 50% → 100%

3. Post-migration:
   - Monitor delivery rates for both systems for 1 week
   - Once OneSignal proven stable, remove Expo push code
   - Deprecate expo_push_token column (keep for 30 days as backup)

4. Leverage OneSignal features:
   - Set up automated notifications (order updates, abandoned cart)
   - Create user segments (high-value customers, inactive users)
   - Launch first A/B test campaign
```

**OneSignal Integration (Backend):**
```typescript
import axios from 'axios';

@Injectable()
export class OneSignalService {
  private readonly apiUrl = 'https://onesignal.com/api/v1/notifications';
  private readonly appId = process.env.ONESIGNAL_APP_ID;
  private readonly apiKey = process.env.ONESIGNAL_API_KEY;

  async sendNotification(
    userIds: string[],
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
        {
          app_id: this.appId,
          include_external_user_ids: userIds, // Our user IDs
          headings: { en: title },
          contents: { en: body },
          data: data,
          ios_badgeType: 'Increase',
          ios_badgeCount: 1,
        },
        {
          headers: {
            'Authorization': `Basic ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('OneSignal notification sent');
    } catch (error) {
      console.error('OneSignal error:', error.response?.data || error.message);
    }
  }

  async sendToSegment(segment: string, title: string, body: string): Promise<void> {
    // Send to user segment (e.g., "Quatre Bornes Customers")
    await axios.post(
      this.apiUrl,
      {
        app_id: this.appId,
        included_segments: [segment],
        headings: { en: title },
        contents: { en: body },
      },
      {
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
```

### 9.3 Email Notifications

#### 9.3.1 Email Service: AWS SES

**Primary Recommendation:** Amazon Simple Email Service (SES)

**Setup Process:**

**1. AWS Account Setup:**
```
- Sign up for AWS account (free tier eligible)
- Navigate to Amazon SES in AWS Console
- Request production access (approval within 24 hours for legitimate businesses)
- Verify domain (freshroots.mu):
  a) Add DKIM records to DNS (provided by SES)
  b) Add SPF record: v=spf1 include:amazonses.com ~all
  c) Add DMARC record: v=DMARC1; p=none; rua=mailto:admin@freshroots.mu
```

**2. Backend Integration:**
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class SesEmailService {
  private sesClient: SESClient;

  constructor(private configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody?: string
  ): Promise<void> {
    const params = {
      Source: 'Fresh Roots <noreply@freshroots.mu>',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody || this.stripHtml(htmlBody),
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);
      console.log('Email sent:', response.MessageId);
    } catch (error) {
      console.error('SES error:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(order: Order, user: User): Promise<void> {
    const subject = `Order Confirmation - ${order.order_number}`;
    const htmlBody = this.renderOrderConfirmationEmail(order, user);
    
    await this.sendEmail(user.email, subject, htmlBody);
  }

  async sendOrderApprovedEmail(order: Order, user: User): Promise<void> {
    const subject = `Order Approved - ${order.order_number}`;
    const htmlBody = this.renderOrderApprovedEmail(order, user);
    
    await this.sendEmail(user.email, subject, htmlBody);
  }

  async sendAdminNewOrderAlert(order: Order): Promise<void> {
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    const subject = `New Order: ${order.order_number} - MUR ${order.total_amount}`;
    const htmlBody = this.renderAdminOrderAlertEmail(order);
    
    await this.sendEmail(adminEmail, subject, htmlBody);
  }

  private renderOrderConfirmationEmail(order: Order, user: User): string {
    // Use email template (Handlebars, Pug, or plain HTML)
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2E7D32; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for your order! We've received your purchase request and it's being processed.</p>
            
            <div class="order-details">
              <h3>Order ${order.order_number}</h3>
              <p><strong>Total:</strong> MUR ${order.total_amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${this.formatPaymentMethod(order.payment_method)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <p>You'll receive another email once your order is approved and ready for delivery.</p>
            
            <p>Questions? Reply to this email or contact us at support@freshroots.mu</p>
          </div>
          <div class="footer">
            <p>Fresh Roots - Fresh Local Produce Delivered</p>
            <p>Port Louis, Mauritius</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
```

**3. Email Templates:**

**Recommended Approach:** Use a template engine like Handlebars

```typescript
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, '../../templates/emails');
    const templateFiles = fs.readdirSync(templatesDir);

    for (const file of templateFiles) {
      if (file.endsWith('.hbs')) {
        const templateName = file.replace('.hbs', '');
        const templatePath = path.join(templatesDir, file);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        this.templates.set(templateName, Handlebars.compile(templateSource));
      }
    }
  }

  render(templateName: string, context: any): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    return template(context);
  }
}
```

**Email Templates Needed:**

```
/templates/emails/
├── order-confirmation.hbs          # Sent immediately after order created
├── order-approved.hbs              # Admin approves order
├── order-rejected.hbs              # Admin rejects order
├── order-out-for-delivery.hbs      # Order dispatched
├── order-delivered.hbs             # Order completed
├── payment-received.hbs            # Payment confirmation
├── password-reset.hbs              # Password reset link
├── welcome.hbs                     # New user registration
└── admin-new-order-alert.hbs       # Admin alert for new orders
```

**4. Bounce & Complaint Handling:**

AWS SES requires handling bounces and complaints to maintain sender reputation.

```typescript
@Controller('webhooks/ses')
export class SesWebhookController {
  constructor(private emailService: SesEmailService) {}

  @Post('bounce')
  async handleBounce(@Body() notification: any) {
    // SES sends SNS notification to this endpoint
    const message = JSON.parse(notification.Message);
    
    if (message.notificationType === 'Bounce') {
      const bouncedRecipients = message.bounce.bouncedRecipients;
      
      for (const recipient of bouncedRecipients) {
        const email = recipient.emailAddress;
        console.log(`Email bounced: ${email}`);
        
        // Mark email as invalid in database
        await this.usersService.markEmailInvalid(email);
      }
    }
    
    return { success: true };
  }

  @Post('complaint')
  async handleComplaint(@Body() notification: any) {
    const message = JSON.parse(notification.Message);
    
    if (message.notificationType === 'Complaint') {
      const complainedRecipients = message.complaint.complainedRecipients;
      
      for (const recipient of complainedRecipients) {
        const email = recipient.emailAddress;
        console.log(`Complaint received from: ${email}`);
        
        // Unsubscribe user from marketing emails
        await this.usersService.setEmailPreference(email, 'unsubscribed');
      }
    }
    
    return { success: true };
  }
}
```

**Setup in AWS:**
```
1. Create SNS topics:
   - ses-bounce-topic
   - ses-complaint-topic

2. Subscribe topics to Fresh Roots webhook endpoints:
   - https://api.freshroots.mu/v1/webhooks/ses/bounce
   - https://api.freshroots.mu/v1/webhooks/ses/complaint

3. Configure SES to publish to these topics
```

#### 9.3.2 Email Deliverability Best Practices

**1. Proper DNS Configuration:**
```
Essential Records:
- SPF: v=spf1 include:amazonses.com ~all
- DKIM: Multiple TXT records provided by SES (auto-verify sender)
- DMARC: v=DMARC1; p=none; rua=mailto:dmarc@freshroots.mu
  └─> p=none (monitoring mode), upgrade to p=quarantine after 1 month of clean sending

Check with: https://mxtoolbox.com/dmarc.aspx
```

**2. Warm Up Sending Reputation:**
```
Don't send high volume immediately after account approval

Week 1: 50-100 emails/day
Week 2: 200-500 emails/day
Week 3: 1,000-2,000 emails/day
Week 4+: Unlimited (within SES limits)

Rationale: Gradual increase builds sender reputation with ISPs
```

**3. Email Content Best Practices:**
```
✓ Always include plain text alternative (not just HTML)
✓ Avoid spam trigger words: "free", "click here", "act now", excessive caps
✓ Include unsubscribe link for marketing emails (legal requirement)
✓ Personalize with recipient name
✓ Use clear "From" name: "Fresh Roots" not "noreply@freshroots.mu"
✓ Include physical address in footer (legal requirement for commercial email)
✗ Don't send to purchased email lists
✗ Don't send without permission (opt-in)
```

**4. Monitor Metrics:**
```
Key SES Metrics (Monitor in CloudWatch):
- Bounce Rate: Should be < 5% (bounces/sent)
- Complaint Rate: Should be < 0.1% (complaints/sent)
- Delivery Rate: Should be > 95%

If bounce rate > 5% for sustained period:
→ AWS may pause sending ability
→ Clean email list, remove invalid addresses
```

### 9.4 In-App Notifications

**Purpose:** Notification center within the app (separate from push notifications)

**Implementation:**

**Mobile App - Notification Center Screen:**
```typescript
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Badge, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url: string;
  created_at: string;
}

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const response = await api.get('/notifications');
    setNotifications(response.data.data);
    setUnreadCount(response.data.meta.unread_count);
  }

  async function markAsRead(notificationId: string) {
    await api.patch(`/notifications/${notificationId}/read`);
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function handleNotificationPress(notification: Notification) {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to relevant screen based on action_url
    if (notification.action_url) {
      // Parse deep link: freshroots://orders/uuid
      const [, screen, id] = notification.action_url.split('/').slice(-3);
      if (screen === 'orders') {
        navigation.navigate('OrderDetail', { orderId: id });
      }
    }
  }

  function renderNotification({ item }: { item: Notification }) {
    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <Card style={{ margin: 8, opacity: item.read ? 0.6 : 1 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              {!item.read && <Badge>NEW</Badge>}
            </View>
            <Text>{item.message}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notifications</Text>
        {unreadCount > 0 && (
          <Text>{unreadCount} unread</Text>
        )}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
            No notifications yet
          </Text>
        }
      />
    </View>
  );
}
```

**Badge on Tab Icon:**
```typescript
// In bottom tab navigator
<Tab.Screen
  name="Notifications"
  component={NotificationsScreen}
  options={{
    tabBarBadge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    tabBarIcon: ({ color }) => <Icon name="bell" size={24} color={color} />,
  }}
/>
```

**Real-Time Updates (Admin Dashboard):**

For admin dashboard, use WebSocket for real-time notification of new orders.

```typescript
// Backend - WebSocket Gateway
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // Emit to all connected admins
  notifyAdmins(event: string, data: any) {
    this.server.to('admin-room').emit(event, data);
  }

  @SubscribeMessage('join-admin')
  handleAdminJoin(client: Socket, payload: { adminId: string }) {
    // Verify admin JWT from payload
    client.join('admin-room');
    console.log(`Admin ${payload.adminId} joined notifications room`);
  }
}

// Usage in OrdersService
async createOrder(orderData: CreateOrderDto): Promise<Order> {
  const order = await this.ordersRepository.save(orderData);
  
  // Emit real-time event to admin dashboard
  this.notificationsGateway.notifyAdmins('new_order', {
    order_id: order.id,
    order_number: order.order_number,
    total_amount: order.total_amount,
    created_at: order.created_at,
  });
  
  return order;
}
```

### 9.5 Notification Event Schema

**Standardized event structure for PostHog analytics:**

```typescript
enum NotificationType {
  PUSH = 'push',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

interface NotificationEvent {
  event_name: 'notification_sent' | 'notification_opened' | 'notification_clicked';
  notification_type: NotificationType;
  notification_category: 'order_update' | 'payment' | 'promotional' | 'admin_alert';
  user_id: string;
  order_id?: string;
  timestamp: string;
}

// Track when notification is sent
analytics.track('notification_sent', {
  notification_type: NotificationType.PUSH,
  notification_category: 'order_update',
  user_id: user.id,
  order_id: order.id,
});

// Track when user opens notification
analytics.track('notification_opened', {
  notification_type: NotificationType.PUSH,
  notification_category: 'order_update',
  user_id: user.id,
  order_id: order.id,
});
```

**Analytics Queries:**
- Push notification open rate by category
- Email open rate by template
- Most effective notification type for conversions
- Time-to-open by notification category

---

**Document continues...**

Due to length constraints, I'll continue this comprehensive system design document. The remaining sections (10-20) will follow the same level of detail and thoroughness.

Would you like me to continue with the remaining sections:
- Section 10: Analytics Implementation Plan
- Section 11: UI/UX Specification
- Section 12: Performance, Scalability & Reliability Plan
- Section 13: Security Plan
- Section 14: Testing Strategy
- Section 15: CI/CD Pipeline Recommendations
- Section 16: Cost Estimate for 12 Months
- Section 17: Week-by-Week Milestone Plan
- Section 18: Risk Register
- Section 19: Open Questions & Required Items
- Section 20: Next-Phase Roadmap

?

## 14. Testing Strategy

This section defines the complete testing approach for Fresh Roots, ensuring quality and reliability.

### 14.1 Testing Pyramid

```
           /\        E2E Tests (5%)
          /  \       - Critical user journeys
         /────\      Integration Tests (15%)
        /      \     - API endpoint tests
       /────────\    Unit Tests (80%)
      /          \   - Business logic, utilities
     /____________\  
```

### 14.2 Unit Testing

**Framework:** Jest + ts-jest

**Coverage Target:** >80% code coverage

**Backend Unit Tests:**
```typescript
// Example: listing.service.spec.ts
describe('ListingsService', () => {
  let service: ListingsService;
  let mockRepository: MockType<Repository<Listing>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ListingsService);
    mockRepository = module.get(getRepositoryToken(Listing));
  });

  describe('findAll', () => {
    it('should return all available listings', async () => {
      const mockListings = [
        { id: '1', title: 'Tomatoes', is_available: true },
        { id: '2', title: 'Lettuce', is_available: true },
      ];
      
      mockRepository.find.mockReturnValue(mockListings);

      const result = await service.findAll();
      
      expect(result).toEqual(mockListings);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { is_available: true },
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('create', () => {
    it('should create a new listing', async () => {
      const createDto = {
        title: 'Organic Carrots',
        price: 65.00,
        unit: 'kg',
      };
      
      const savedListing = { id: '123', ...createDto };
      mockRepository.save.mockReturnValue(savedListing);

      const result = await service.create(createDto);
      
      expect(result).toEqual(savedListing);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw error if price is negative', async () => {
      const invalidDto = {
        title: 'Bad Listing',
        price: -50,
        unit: 'kg',
      };

      await expect(service.create(invalidDto)).rejects.toThrow('Price must be positive');
    });
  });
});
```

**Frontend Unit Tests:**
```typescript
// Example: ListingCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import ListingCard from './ListingCard';

describe('ListingCard', () => {
  const mockListing = {
    id: '1',
    title: 'Organic Tomatoes',
    price: 85.00,
    unit: 'kg',
    primary_image: 'https://example.com/tomato.jpg',
  };

  it('renders listing information correctly', () => {
    render(<ListingCard listing={mockListing} />);
    
    expect(screen.getByText('Organic Tomatoes')).toBeTruthy();
    expect(screen.getByText('MUR 85.00')).toBeTruthy();
    expect(screen.getByText('per kg')).toBeTruthy();
  });

  it('calls onPress when card is tapped', () => {
    const mockOnPress = jest.fn();
    render(<ListingCard listing={mockListing} onPress={mockOnPress} />);
    
    const card = screen.getByTestId('listing-card');
    fireEvent.press(card);
    
    expect(mockOnPress).toHaveBeenCalledWith(mockListing.id);
  });

  it('displays "Out of Stock" badge when stock is 0', () => {
    const outOfStockListing = { ...mockListing, stock_quantity: 0, is_available: false };
    render(<ListingCard listing={outOfStockListing} />);
    
    expect(screen.getByText('Out of Stock')).toBeTruthy();
  });
});
```

**Test Utilities:**
```typescript
// test/factories.ts - Test data factories
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'customer',
  ...overrides,
});

export const createMockListing = (overrides?: Partial<Listing>): Listing => ({
  id: 'listing-123',
  title: 'Test Product',
  price: 100.00,
  unit: 'kg',
  stock_quantity: 50,
  is_available: true,
  ...overrides,
});
```

### 14.3 Integration Testing

**Backend API Integration Tests:**
```typescript
// test/orders.e2e-spec.ts
describe('Orders (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Create test user and login
    authToken = await getAuthToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders/purchase-request', () => {
    it('should create order with valid data', () => {
      return request(app.getHttpServer())
        .post('/orders/purchase-request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { listing_id: 'valid-listing-id', quantity: 2 },
          ],
          payment_method: 'juice',
          delivery_address: {
            line1: '123 Main St',
            city: 'Quatre Bornes',
            postal_code: '72301',
            phone: '+230 5123 4567',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.order).toHaveProperty('id');
          expect(res.body.data.order).toHaveProperty('order_number');
          expect(res.body.data.order.status).toBe('pending');
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/orders/purchase-request')
        .send({ /* valid data */ })
        .expect(401);
    });

    it('should return 400 with invalid data', () => {
      return request(app.getHttpServer())
        .post('/orders/purchase-request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [], // Empty items array - invalid
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error.message).toContain('items must not be empty');
        });
    });

    it('should return 400 if listing out of stock', async () => {
      // Create listing with 0 stock
      const listing = await createTestListing({ stock_quantity: 0 });

      return request(app.getHttpServer())
        .post('/orders/purchase-request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ listing_id: listing.id, quantity: 1 }],
          payment_method: 'juice',
          delivery_address: validAddress,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error.message).toContain('out of stock');
        });
    });
  });
});
```

### 14.4 End-to-End Testing

**Framework:** Detox (for React Native)

**Critical User Journeys:**

**1. Browse and Purchase Flow:**
```typescript
// e2e/purchase.e2e.ts
describe('Purchase Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full purchase journey', async () => {
    // 1. Browse listings
    await element(by.id('home-tab')).tap();
    await expect(element(by.id('listings-grid'))).toBeVisible();
    
    // 2. Tap on first listing
    await element(by.id('listing-card-0')).tap();
    await expect(element(by.id('listing-detail-screen'))).toBeVisible();
    
    // 3. Tap "Buy Now"
    await element(by.id('buy-now-button')).tap();
    
    // 4. Select quantity
    await element(by.id('quantity-plus-button')).tap();
    await expect(element(by.id('quantity-display'))).toHaveText('2');
    
    // 5. Continue to address
    await element(by.id('continue-button')).tap();
    
    // 6. Fill address
    await element(by.id('address-input')).typeText('123 Main Street');
    await element(by.id('city-dropdown')).tap();
    await element(by.text('Quatre Bornes')).tap();
    await element(by.id('postal-code-input')).typeText('72301');
    await element(by.id('phone-input')).typeText('+230 5123 4567');
    
    // 7. Continue to payment
    await element(by.id('continue-button')).tap();
    
    // 8. Select COD payment
    await element(by.id('payment-cod')).tap();
    
    // 9. Review and confirm
    await element(by.id('review-button')).tap();
    await expect(element(by.text('MUR 220.00'))).toBeVisible();
    
    // 10. Confirm order
    await element(by.id('confirm-order-button')).tap();
    
    // 11. Verify success screen
    await waitFor(element(by.id('order-success-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.text(/Order Placed Successfully/))).toBeVisible();
    await expect(element(by.id('order-number'))).toBeVisible();
  });
});
```

**2. Admin Order Approval Flow:**
```typescript
describe('Admin Order Management', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await loginAsAdmin();
  });

  it('should approve pending order', async () => {
    // 1. Navigate to orders
    await element(by.id('admin-orders-tab')).tap();
    
    // 2. Filter to pending
    await element(by.id('filter-pending')).tap();
    
    // 3. Tap first pending order
    await element(by.id('order-card-0')).tap();
    
    // 4. Verify order details
    await expect(element(by.id('order-status'))).toHaveText('Pending');
    
    // 5. Add admin notes
    await element(by.id('admin-notes-input')).typeText('Order approved for delivery tomorrow');
    
    // 6. Approve order
    await element(by.id('approve-button')).tap();
    
    // 7. Confirm in modal
    await element(by.id('confirm-approve-button')).tap();
    
    // 8. Verify success
    await expect(element(by.id('order-status'))).toHaveText('Approved');
    await expect(element(by.text(/Order approved successfully/))).toBeVisible();
  });
});
```

### 14.5 Performance Testing

**Mobile App Performance:**
```typescript
// measure-performance.ts
import { performance } from 'perf_hooks';

describe('App Performance', () => {
  it('should load home screen within 3 seconds', async () => {
    const startTime = performance.now();
    
    await device.launchApp({ newInstance: true });
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(3000);
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  it('should render 20 listings without lag', async () => {
    await element(by.id('home-tab')).tap();
    
    const startTime = performance.now();
    await element(by.id('listings-grid')).scroll(500, 'down');
    const scrollTime = performance.now() - startTime;
    
    expect(scrollTime).toBeLessThan(100); // 60fps = 16ms per frame, 100ms = smooth
  });
});
```

### 14.6 Security Testing

**Automated Security Scans:**
```bash
# OWASP Dependency Check
npm audit

# Static code analysis for security vulnerabilities
npm install -g @microsoft/eslint-plugin-sdl
eslint . --ext .ts,.tsx --config .eslintrc-security.js

# Container security scanning (if using Docker)
docker scan freshroots-api:latest
```

**Manual Security Testing Checklist:**
□ SQL injection attempts on all input fields
□ XSS payloads in user-generated content
□ CSRF token validation
□ Authentication bypass attempts
□ Authorization escalation (customer accessing admin endpoints)
□ Rate limit effectiveness
□ Session management (logout, concurrent sessions)
□ Sensitive data exposure (API responses, error messages)
□ File upload restrictions (malicious files, size limits)

### 14.7 Test Data Management

**Test Database:**
```
Environment: test
Database: fresh_roots_test
Reset: Before each test suite

Seeding:
- 10 test users (5 customers, 5 admins)
- 50 test listings across categories
- 20 test orders in various states
- Sample payment transactions
```

**Data Factories:**
```typescript
// test/factories/user.factory.ts
export class UserFactory {
  static create(overrides?: Partial<User>): User {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      name: faker.name.fullName(),
      role: 'customer',
      password_hash: 'hashed_password',
      created_at: faker.date.past(),
      ...overrides,
    };
  }

  static createMany(count: number): User[] {
    return Array.from({ length: count }, () => this.create());
  }
}
```

### 14.8 Continuous Testing

**CI/CD Integration:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: fresh_roots_test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Unit Tests
        run: npm run test:unit
      
      - name: Integration Tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/fresh_roots_test
          REDIS_URL: redis://localhost:6379
      
      - name: Coverage Report
        run: npm run test:coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### 14.9 Test Metrics & Reporting

**Coverage Goals:**
```
Overall: >80%
Critical Paths (orders, payments): >95%
Utilities: >90%
UI Components: >70% (harder to test, acceptable lower threshold)
```

**Test Execution Time:**
```
Unit Tests: <30 seconds (run on every commit)
Integration Tests: <2 minutes (run on every PR)
E2E Tests: <10 minutes (run before merge, nightly)
```

**Quality Gates (Block Merge if):**
- Coverage drops below 80%
- Any test fails
- Lint errors exist
- Security vulnerabilities found (high/critical)

---

## 15. CI/CD Pipeline Recommendations

This section defines the continuous integration and deployment strategy for Fresh Roots.

### 15.1 CI/CD Overview

**Goals:**
1. Automated testing on every code change
2. Fast feedback (<5 minutes for CI)
3. Zero-downtime deployments
4. Rollback capability
5. Environment parity (dev, staging, production)

**Platform:** GitHub Actions (native, free for public repos, affordable for private)

### 15.2 Backend Pipeline

**Workflow File:** `.github/workflows/backend-deploy.yml`

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  DOCKER_IMAGE: freshroots/api

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: fresh_roots_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Lint
        working-directory: backend
        run: npm run lint

      - name: Unit Tests
        working-directory: backend
        run: npm run test:unit

      - name: Integration Tests
        working-directory: backend
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@postgres:5432/fresh_roots_test
          REDIS_URL: redis://redis:6379

      - name: Test Coverage
        working-directory: backend
        run: npm run test:coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json

  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.DOCKER_IMAGE }}:latest
            ${{ env.DOCKER_IMAGE }}:${{ github.sha }}
          cache-from: type=registry,ref=${{ env.DOCKER_IMAGE }}:buildcache
          cache-to: type=registry,ref=${{ env.DOCKER_IMAGE }}:buildcache,mode=max

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to DigitalOcean App Platform
        uses: digitalocean/app_action@v1
        with:
          app_name: freshroots-api-staging
          token: ${{ secrets.DIGITALOCEAN_TOKEN }}
          images: '[
            {
              "name": "api",
              "image": {
                "registry_type": "DOCKER_HUB",
                "registry": "freshroots",
                "repository": "api",
                "tag": "${{ github.sha }}"
              }
            }
          ]'

      - name: Run Database Migrations
        run: |
          # SSH into staging server and run migrations
          # Or use DigitalOcean API to execute command
          echo "Running migrations..."

      - name: Smoke Test
        run: |
          curl -f https://api-staging.freshroots.mu/health || exit 1

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to Production
        uses: digitalocean/app_action@v1
        with:
          app_name: freshroots-api-production
          token: ${{ secrets.DIGITALOCEAN_TOKEN }}
          images: '[
            {
              "name": "api",
              "image": {
                "registry_type": "DOCKER_HUB",
                "registry": "freshroots",
                "repository": "api",
                "tag": "${{ github.sha }}"
              }
            }
          ]'

      - name: Run Database Migrations
        run: |
          # Production migrations with extra caution
          echo "Running production migrations..."

      - name: Smoke Test
        run: |
          curl -f https://api.freshroots.mu/health || exit 1

      - name: Notify Team
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "✅ Fresh Roots API deployed to production successfully!\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
            }

      - name: Rollback on Failure
        if: failure()
        run: |
          # Rollback to previous version
          echo "Deployment failed, rolling back..."
          # Implementation depends on hosting platform
```

### 15.3 Mobile App Pipeline

**Workflow File:** `.github/workflows/mobile-deploy.yml`

```yaml
name: Mobile App CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'mobile/**'
      - '.github/workflows/mobile-deploy.yml'
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Lint
        working-directory: mobile
        run: npm run lint

      - name: Unit Tests
        working-directory: mobile
        run: npm test

      - name: TypeScript Check
        working-directory: mobile
        run: npx tsc --noEmit

  build-android:
    name: Build Android APK/AAB
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Build Android (Internal)
        if: github.ref == 'refs/heads/develop'
        working-directory: mobile
        run: eas build --platform android --profile preview --non-interactive

      - name: Build Android (Production)
        if: github.ref == 'refs/heads/main'
        working-directory: mobile
        run: eas build --platform android --profile production --non-interactive

      - name: Submit to Google Play (Internal Track)
        if: github.ref == 'refs/heads/develop'
        working-directory: mobile
        run: eas submit --platform android --latest --track internal

      - name: Submit to Google Play (Production Track)
        if: github.ref == 'refs/heads/main'
        working-directory: mobile
        run: eas submit --platform android --latest --track production

  build-ios:
    name: Build iOS IPA
    runs-on: macos-latest
    needs: test
    if: github.ref == 'refs/heads/main' && false  # Disabled until iOS launch
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Build iOS
        working-directory: mobile
        run: eas build --platform ios --profile production --non-interactive

      - name: Submit to TestFlight
        working-directory: mobile
        run: eas submit --platform ios --latest
```

### 15.4 Database Migration Strategy

**Tools:** TypeORM migrations

**Migration Workflow:**
```typescript
// 1. Create migration
npm run migration:create -- CreateOrdersTable

// 2. Write migration
// migrations/1706009400000-CreateOrdersTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1706009400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'status', type: 'varchar', isNullable: false },
          { name: 'total_amount', type: 'decimal', precision: 10, scale: 2 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}

// 3. Run migration
npm run migration:run

// 4. Rollback if needed
npm run migration:revert
```

**Production Migration Process:**
```bash
# 1. Backup database
pg_dump fresh_roots_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migration on copy of production data
psql fresh_roots_test < backup_20260123_100000.sql
npm run migration:run

# 3. If successful, run on production during maintenance window
npm run migration:run

# 4. If migration fails, rollback
npm run migration:revert
psql fresh_roots_prod < backup_20260123_100000.sql
```

### 15.5 Environment Configuration

**Environment Secrets (GitHub Secrets):**
```
Development:
- DEV_DATABASE_URL
- DEV_REDIS_URL
- DEV_JWT_SECRET

Staging:
- STAGING_DATABASE_URL
- STAGING_REDIS_URL
- STAGING_JWT_SECRET
- STAGING_MIPS_API_KEY

Production:
- PROD_DATABASE_URL
- PROD_REDIS_URL
- PROD_JWT_SECRET
- PROD_MIPS_API_KEY
- PROD_CLOUDINARY_API_KEY
- PROD_AWS_SES_ACCESS_KEY
```

**Environment Files:**
```
.env.development
.env.staging
.env.production

# Not committed to Git, injected during deployment
```

### 15.6 Deployment Strategies

#### 15.6.1 Rolling Deployment (Default)

**Process:**
```
1. Deploy new version to Instance 1
2. Health check Instance 1
3. If healthy, deploy to Instance 2
4. Continue until all instances updated
5. If any instance fails, stop rollout

Downtime: Zero
Rollback: Redeploy previous version
Risk: Low (gradual rollout)
```

#### 15.6.2 Blue-Green Deployment (Future)

**Process:**
```
Blue Environment: Current production (v1.0)
Green Environment: New version (v1.1)

1. Deploy v1.1 to Green
2. Run smoke tests on Green
3. Switch traffic from Blue to Green (DNS or load balancer)
4. Monitor for errors
5. If issues, instant rollback to Blue
6. If stable for 1 hour, decommission Blue

Downtime: Zero
Rollback: Instant (switch back)
Risk: Very low
Cost: 2x infrastructure during deployment
```

#### 15.6.3 Canary Deployment (Future, High Scale)

**Process:**
```
1. Deploy new version to 5% of instances
2. Monitor metrics: error rate, latency, business KPIs
3. If metrics stable for 30 minutes, increase to 25%
4. Repeat: 50% → 75% → 100%
5. At any stage, rollback if metrics degrade

Downtime: Zero
Rollback: Partial (only canary instances)
Risk: Very low (limited blast radius)
Complexity: High
```

### 15.7 Rollback Procedures

**Automated Rollback Triggers:**
```
- Error rate >5% for 2 minutes
- API response time p95 >500ms for 5 minutes
- Health check failures >3 consecutive
```

**Manual Rollback:**
```bash
# Rollback to specific Git commit/Docker tag
./scripts/rollback.sh --version v1.2.3

# Or rollback to previous version
./scripts/rollback.sh --previous

# Steps:
1. Tag current version as "rollback candidate"
2. Deploy previous Docker image
3. Verify health checks
4. Run critical smoke tests
5. Monitor for 15 minutes
6. If stable, mark rollback successful
```

### 15.8 Monitoring Deployments

**Deployment Dashboard:**
```
Metrics to track:
- Deployment duration (target: <10 minutes)
- Success rate (target: >95%)
- Rollback frequency (target: <5%)
- Time to rollback (target: <5 minutes)
- Deployment frequency (target: 3-5x per week)
```

**Post-Deployment Checklist:**
```
□ Health checks passing
□ Error rate <1%
□ API latency within SLO
□ Database connections stable
□ No spike in Sentry errors
□ Key user flows tested manually
□ Admin notified of deployment
```

### 15.9 CI/CD Best Practices

**1. Fast Feedback:**
- Unit tests complete in <30 seconds
- Full CI pipeline <5 minutes
- Developers notified immediately on failure

**2. Fail Fast:**
- Run linting before tests
- Run unit tests before integration tests
- Stop pipeline on first failure

**3. Idempotency:**
- Same input = same output
- Re-running pipeline doesn't cause issues
- Database migrations handle re-runs gracefully

**4. Artifact Versioning:**
```
Docker images tagged with:
- Git commit SHA: freshroots/api:a1b2c3d
- Git branch: freshroots/api:main
- Semantic version: freshroots/api:v1.2.3
- Latest: freshroots/api:latest (auto-updates)
```

**5. Audit Trail:**
```
Every deployment logged with:
- Who deployed (Git author)
- What was deployed (commit SHA, version)
- When deployed (timestamp)
- Where deployed (environment)
- Result (success/failure)
- Rollback history
```

---

## 16. Cost Estimate for 12 Months

This section provides detailed cost projections for the first year of operation across three growth phases.

### 16.1 Cost Assumptions

**Growth Trajectory:**
```
Month 1-3 (MVP):
- Users: 0 → 500
- Monthly Active Users (MAU): 100-300
- Orders: 50-150/month
- API Requests: 50K-200K/month
- Image Storage: 10GB
- Bandwidth: 50GB/month

Month 4-6 (Early Growth):
- Users: 500 → 2,000
- MAU: 500-1,200
- Orders: 300-800/month
- API Requests: 500K-1.5M/month
- Image Storage: 50GB
- Bandwidth: 200GB/month

Month 7-12 (Scale):
- Users: 2,000 → 10,000
- MAU: 1,500-5,000
- Orders: 1,000-3,000/month
- API Requests: 2M-8M/month
- Image Storage: 200GB
- Bandwidth: 1TB/month
```

### 16.2 Infrastructure Costs

#### 16.2.1 Hosting (DigitalOcean)

**Month 1-3 (MVP):**
```
App Platform (PaaS):
- Basic container: $12/month

Managed PostgreSQL:
- Basic plan (1GB RAM, 10GB storage): $15/month

Managed Redis:
- Basic plan: $15/month

Spaces (Object Storage):
- 250GB storage + 1TB bandwidth: $5/month

Subtotal: $47/month
Average: $47/month
```

**Month 4-6 (Early Growth):**
```
App Platform:
- 2 containers: $24/month

Managed PostgreSQL:
- Professional plan (4GB RAM, 80GB storage): $55/month

Managed Redis:
- Professional plan: $30/month

Spaces:
- 250GB storage + 1TB bandwidth: $5/month
- Overage: ~$10/month

Subtotal: $124/month
Average: $100/month (ramp up)
```

**Month 7-12 (Scale):**
```
App Platform:
- 3-4 containers with auto-scaling: $48-60/month

Managed PostgreSQL:
- Professional plan + read replica: $110/month

Managed Redis:
- Clustered (3 nodes): $90/month

Spaces:
- 500GB storage + 2TB bandwidth: $15/month
- Overage: ~$30/month

CDN (Cloudflare Pro):
- $20/month

Subtotal: $283-315/month
Average: $250/month
```

**12-Month Total: $47*3 + $100*3 + $250*6 = $141 + $300 + $1,500 = $1,941**

#### 16.2.2 Alternative: AWS Hosting (For Comparison)

**Month 1-3:**
```
ECS Fargate (2 vCPU, 4GB RAM): $50/month
RDS PostgreSQL (db.t3.small): $30/month
ElastiCache Redis (cache.t3.micro): $15/month
S3 + CloudFront: $10/month
Total: $105/month (2.2x DigitalOcean)
```

**Conclusion:** DigitalOcean is more cost-effective for MVP phase. Consider AWS for enterprise scale (>50K users).

### 16.3 Third-Party Services

#### 16.3.1 Image Storage & CDN

**Month 1-3:**
```
Cloudinary Free Tier:
- 25 credits/month (sufficient)
- Cost: $0/month
```

**Month 4-6:**
```
Cloudinary:
- Usage exceeds free tier slightly
- Plus plan: $0 (free tier still sufficient if optimized)
- Cost: $0/month
```

**Month 7-12:**
```
Option 1 - Cloudinary:
- Advanced plan: $99/month

Option 2 - Migrate to S3 + CloudFront:
- S3 storage (200GB): $5/month
- CloudFront (1TB transfer): $85/month
- Lambda@Edge: $10/month
- Total: $100/month (comparable, more control)

Chosen: S3 + CloudFront from Month 8
Average: $50/month (blended)
```

**12-Month Total: $0*7 + $100*5 = $500**

#### 16.3.2 Email (AWS SES)

**Month 1-3:**
```
Emails sent: ~500/month (order confirmations, admin alerts)
Cost: $0.10/1,000 = $0.05/month
Effective: $0/month (rounds to free)
```

**Month 4-6:**
```
Emails sent: ~2,000/month
Cost: $0.10/1,000 = $0.20/month
Effective: $0/month
```

**Month 7-12:**
```
Emails sent: ~8,000/month
Cost: $0.10/1,000 = $0.80/month
Effective: $1/month (rounds up for simplicity)
```

**12-Month Total: ~$5**

#### 16.3.3 Push Notifications

**Month 1-6:**
```
Expo Push Notifications:
- Free, unlimited
- Cost: $0/month
```

**Month 7-12:**
```
OneSignal (if migrated):
- Free tier: 0-10K subscribers
- Growth plan: $9-39/month (depending on users)
- Average: $20/month

Chosen: Stay on Expo for now
Cost: $0/month
```

**12-Month Total: $0**

#### 16.3.4 Analytics (PostHog)

**Month 1-3:**
```
Events: ~100K/month
PostHog Cloud Free Tier: 1M events/month
Cost: $0/month
```

**Month 4-6:**
```
Events: ~500K/month
Still within free tier
Cost: $0/month
```

**Month 7-12:**
```
Events: ~2M/month
PostHog Cloud Paid:
- $0/month for first 1M events
- $0.00031/event thereafter
- (2M - 1M) * $0.00031 = $310/month

Alternative - Self-Hosted:
- Additional server: $50/month
- No per-event fees

Chosen: Self-hosted from Month 9
Average: $100/month (blended)
```

**12-Month Total: $0*8 + $310*1 + $50*3 = $460**

#### 16.3.5 Error Tracking (Sentry)

**Month 1-12:**
```
Sentry Free Tier:
- 5,000 errors/month (sufficient for MVP and early growth)
- Cost: $0/month

If exceeded (unlikely):
- Developer plan: $26/month

Estimated: $0/month
```

**12-Month Total: $0**

#### 16.3.6 Payment Processing

**Transaction-Based Pricing:**
```
MIPS/Paywise typical fees: 2.5% + MUR 5 per transaction
MCB Juice fees: ~2% (absorbed by aggregator)
Cash on Delivery: No processing fee (MUR 25 COD fee charged to customer)

Month 1-3:
- Orders: 150 total
- Average Order Value (AOV): MUR 300
- Revenue: MUR 45,000
- 60% digital payments: 90 orders * (2.5% + MUR 5) = MUR 675 + MUR 450 = MUR 1,125
- 40% COD: No fees
- Total Fees: MUR 1,125 ($25)

Month 4-6:
- Orders: 1,600 total (cumulative in period)
- AOV: MUR 320
- Revenue: MUR 512,000
- 70% digital payments: 1,120 orders * (2.5% + MUR 5) = MUR 8,960 + MUR 5,600 = MUR 14,560
- Total Fees: MUR 14,560 ($320)

Month 7-12:
- Orders: 12,000 total (cumulative in period)
- AOV: MUR 350
- Revenue: MUR 4,200,000
- 75% digital payments: 9,000 orders * (2.5% + MUR 5) = MUR 78,750 + MUR 45,000 = MUR 123,750
- Total Fees: MUR 123,750 ($2,720)
```

**12-Month Total: $25 + $320 + $2,720 = $3,065**

**Note:** This is variable cost, scales with revenue. Percentage: ~2.8% of gross merchandise value (GMV).

### 16.4 Domain & SSL

**Month 1-12:**
```
Domain (.mu): MUR 1,200/year = $27/year
SSL (Let's Encrypt): $0/year (free)
DNS (Cloudflare Free): $0/year

Total: $27/year
```

### 16.5 Development Tools

**Month 1-12:**
```
GitHub Private Repos:
- Team plan: $4/user/month
- 2 developers: $8/month = $96/year

Expo EAS Build & Submit:
- Production plan: $29/month = $348/year
  (Includes 30 builds/month, priority support)

Total: $96 + $348 = $444/year
```

### 16.6 Miscellaneous

**SMS for COD Verification (Optional):**
```
Twilio or local provider: ~MUR 0.50/SMS
Month 1-3: 100 SMS = MUR 50 ($1)
Month 4-6: 500 SMS = MUR 250 ($5.50)
Month 7-12: 2,000 SMS = MUR 1,000 ($22)

12-Month Total: ~$30
```

**Backup & Monitoring:**
```
Included in managed database (DigitalOcean): $0
Additional off-site backup (optional): $10/month = $120/year
Uptime monitoring (UptimeRobot Free): $0
```

### 16.7 Total Cost Summary

**12-Month Cost Breakdown:**

| Category | Month 1-3 | Month 4-6 | Month 7-12 | 12-Month Total |
|----------|-----------|-----------|------------|----------------|
| **Infrastructure** | $141 | $300 | $1,500 | $1,941 |
| Hosting (DO) | $141 | $300 | $1,500 | $1,941 |
| **Third-Party Services** | $25 | $320 | $2,820 | $3,165 |
| Images (Cloudinary/S3) | $0 | $0 | $500 | $500 |
| Email (SES) | $0 | $0 | $5 | $5 |
| Push (Expo/OneSignal) | $0 | $0 | $0 | $0 |
| Analytics (PostHog) | $0 | $0 | $460 | $460 |
| Error Tracking (Sentry) | $0 | $0 | $0 | $0 |
| Payment Fees | $25 | $320 | $2,720 | $3,065 |
| SMS (optional) | $0 | $6 | $24 | $30 |
| **Fixed Costs** | $139 | $139 | $278 | $556 |
| Domain & SSL | $7 | $7 | $13 | $27 |
| Dev Tools (GitHub, EAS) | $111 | $111 | $222 | $444 |
| Backup (optional) | $30 | $30 | $60 | $120 |
| **Total Monthly** | **$102** | **$253** | **$400** | **$5,662** |

**Average Monthly Cost: $472**

**Cost as % of Revenue:**
```
Month 1-3: $305 / $990 (MUR 45K) = 31%
Month 4-6: $759 / $11,264 (MUR 512K) = 6.7%
Month 7-12: $4,598 / $92,400 (MUR 4.2M) = 5.0%

Trend: Decreasing % as revenue scales (economies of scale)
```

### 16.8 Cost Optimization Opportunities

**Month 4-6:**
- Optimize image sizes (reduce Cloudinary usage)
- Implement aggressive caching (reduce API server load)
- Use database read replicas efficiently

**Month 7-12:**
- Migrate to S3 + CloudFront (save $200-400/month vs. Cloudinary at scale)
- Self-host PostHog (save ~$260/month)
- Negotiate payment processing fees (aim for 2.2% vs. 2.5%)
- Reserved instances for database (save 30-40%)

**Potential Savings: $500-800/month by Month 12**

### 16.9 Cost Scenarios

**Best Case (Low Growth):**
```
Month 12:
- Users: 3,000 (vs. 10,000 projected)
- Orders: 800/month (vs. 3,000)
- Infrastructure: $150/month (vs. $250)
- Payment fees: $800/month (vs. $2,720)
- Total: $1,100/month (vs. $1,200)

12-Month Total: ~$4,500 (vs. $5,662)
```

**Worst Case (High Growth, No Optimization):**
```
Month 12:
- Users: 20,000 (2x projected)
- Orders: 6,000/month (2x projected)
- Infrastructure: $500/month (more servers)
- Cloudinary: $300/month (no migration)
- Payment fees: $5,400/month (2x)
- Total: $6,300/month

12-Month Total: ~$35,000 (6.2x base case)
```

**Recommendation:**
- Plan for base case ($5,662)
- Budget 20% buffer ($6,800)
- Monitor costs monthly
- Implement optimization at Month 6 trigger ($250/month threshold)

---

## 17. Week-by-Week Milestone Plan

This section breaks down the 4-week development timeline with specific deliverables for each week.

### Week 0: Planning & Setup (Pre-Development)

**Duration:** 5 days before Week 1

**Goals:**
- Finalize requirements
- Set up development environment
- Establish partnerships
- Prepare design assets

**Tasks:**

**Days 1-2: Requirements Finalization**
□ Review all system design documents
□ Clarify any ambiguous requirements
□ Define acceptance criteria for MVP
□ Create prioritized backlog in GitHub Projects

**Days 3-4: Environment Setup**
□ Set up Git repository (GitHub)
□ Initialize backend project (NestJS)
□ Initialize mobile project (Expo)
□ Configure local development databases (PostgreSQL, Redis via Docker)
□ Set up development tools (ESLint, Prettier, Husky for pre-commit hooks)
□ Create .env.example files

**Day 5: Partnerships & Design**
□ Initiate contact with MIPS/Paywise (payment aggregator)
□ Request Facebook App review (for page access)
□ Create basic brand assets (logo, color palette)
□ Set up project management board (GitHub Projects or Jira)

**Deliverables:**
- ✅ Development environment ready
- ✅ Git repository initialized with README
- ✅ Project board with backlog
- ✅ Payment aggregator contact initiated

---

### Week 1: Backend Foundation & Database

**Goal:** Build core backend infrastructure and database with authentication

**Day 1 (Monday): Database Schema Implementation**

**Morning:**
□ Create PostgreSQL database
□ Set up TypeORM in NestJS project
□ Define entity models: Users, Listings, ListingImages

**Afternoon:**
□ Write and run initial migrations
□ Seed database with test data (10 users, 20 listings)
□ Test database connections and queries

**Deliverables:**
- Database schema created with core tables
- 20 test listings seeded

**Day 2 (Tuesday): Authentication System**

**Morning:**
□ Implement User entity with password hashing (bcrypt)
□ Create AuthModule with JWT strategy
□ Build registration endpoint (POST /auth/register)
□ Build login endpoint (POST /auth/login)

**Afternoon:**
□ Implement refresh token logic with Redis
□ Create JWT guards for protected routes
□ Write unit tests for auth service

**Deliverables:**
- ✅ Registration and login functional
- ✅ JWT authentication working
- ✅ Postman collection with auth endpoints

**Day 3 (Wednesday): Listings API - Read Operations**

**Morning:**
□ Create ListingsModule
□ Implement GET /listings (with pagination, filtering)
□ Implement GET /listings/:id

**Afternoon:**
□ Add full-text search to GET /listings
□ Implement category filtering
□ Write integration tests

**Deliverables:**
- ✅ Listings API endpoints functional
- ✅ Filtering and search working
- ✅ 15+ listings accessible via API

**Day 4 (Thursday): Listings API - Admin CRUD**

**Morning:**
□ Implement admin role check guard
□ Create POST /admin/listings (create listing)
□ Create PUT /admin/listings/:id (update)

**Afternoon:**
□ Create DELETE /admin/listings/:id
□ Implement multi-image upload to Cloudinary
□ Test full admin workflow

**Deliverables:**
- ✅ Admin can create, update, delete listings
- ✅ Image upload to Cloudinary working

**Day 5 (Friday): Facebook Import Prototype**

**Morning:**
□ Set up Facebook Graph API credentials
□ Create FacebookModule
□ Implement POST /admin/facebook/import endpoint

**Afternoon:**
□ Write post parsing logic (extract title, price, description)
□ Test with Fresh Roots Facebook page
□ Create draft listings from parsed posts

**Deliverables:**
- ✅ Facebook import prototype functional
- ✅ Can parse and create draft listings from FB posts

**Week 1 Summary:**
- **Status:** Backend foundation complete
- **API Endpoints:** 12+ functional
- **Test Coverage:** 60-70% (unit + integration)
- **Database:** Fully seeded with realistic data

---

### Week 2: Mobile App Core

**Goal:** Build React Native app with navigation, listing browse, and authentication

**Day 1 (Monday): Expo Project Setup & Navigation**

**Morning:**
□ Initialize Expo project with TypeScript
□ Install dependencies (React Navigation, Redux Toolkit, React Native Paper)
□ Configure navigation structure (Stack + Bottom Tabs)

**Afternoon:**
□ Create placeholder screens (Home, Search, Orders, Account)
□ Implement navigation between screens
□ Set up Redux store with auth slice

**Deliverables:**
- ✅ Mobile app runs on physical device (Expo Go)
- ✅ Navigation functional

**Day 2 (Tuesday): Authentication Screens**

**Morning:**
□ Create Login screen with form validation
□ Create Registration screen
□ Integrate with backend auth API

**Afternoon:**
□ Implement JWT token storage (SecureStore for refresh token)
□ Implement auto-refresh on 401 errors
□ Create auth flow (redirect to login if unauthenticated)

**Deliverables:**
- ✅ Users can register and login
- ✅ JWT authentication integrated
- ✅ Persistent login across app restarts

**Day 3 (Wednesday): Home Screen & Listing Grid**

**Morning:**
□ Create Home screen layout (categories, listing grid)
□ Implement API call to fetch listings
□ Display listings in grid with images, titles, prices

**Afternoon:**
□ Implement pull-to-refresh
□ Add loading states (skeleton screens)
□ Implement error handling

**Deliverables:**
- ✅ Home screen displays 20+ listings
- ✅ Listings load from API with images from Cloudinary
- ✅ Pull-to-refresh functional

**Day 4 (Thursday): Listing Detail Screen**

**Morning:**
□ Create ListingDetail screen
□ Display full listing info (images carousel, description, price, stock)
□ Implement navigation from listing card to detail

**Afternoon:**
□ Add "Express Interest" button
□ Create Express Interest modal
□ Integrate with backend API

**Deliverables:**
- ✅ Listing detail screen fully functional
- ✅ Users can express interest in products

**Day 5 (Friday): Search Screen**

**Morning:**
□ Create Search screen with input field
□ Implement debounced search API calls
□ Display search results

**Afternoon:**
□ Add category filters (chips)
□ Add sorting options (price, newest)
□ Polish UI/UX

**Deliverables:**
- ✅ Search functional with filtering
- ✅ Mobile app has 5 functional screens

**Week 2 Summary:**
- **Status:** Core mobile app functional
- **Screens:** 6 (Login, Register, Home, Listing Detail, Search, Account)
- **API Integration:** Authentication, Listings fetching, Interest expressions
- **Testing Device:** Samsung J7 Prime (target device)

---

### Week 3: Purchase Flow & Admin Dashboard

**Goal:** Implement complete purchase request flow and admin order management

**Day 1 (Monday): Backend - Orders API**

**Morning:**
□ Create OrdersModule and Order entity
□ Implement POST /orders/purchase-request endpoint
□ Add order creation logic with validation

**Afternoon:**
□ Implement GET /orders/my-orders (user's orders)
□ Implement GET /orders/:id (order details)
□ Write unit and integration tests

**Deliverables:**
- ✅ Users can create purchase requests via API
- ✅ Order history accessible

**Day 2 (Tuesday): Payment Integration**

**Morning:**
□ Research MIPS/Paywise API documentation
□ Create PaymentsModule
□ Implement payment initiation (for digital payments)

**Afternoon:**
□ Implement COD (Cash on Delivery) order flow
□ Create webhook endpoint for payment callbacks
□ Test with payment aggregator sandbox

**Deliverables:**
- ✅ Payment initiation working (test mode)
- ✅ COD orders can be placed
- ✅ Webhook receives payment confirmations

**Day 3 (Wednesday): Mobile - Purchase Flow (Part 1)**

**Morning:**
□ Create quantity selection screen
□ Create delivery address input screen
□ Implement form validation

**Afternoon:**
□ Create payment method selection screen
□ Display order summary
□ Integrate with backend purchase API

**Deliverables:**
- ✅ Users can proceed through purchase flow
- ✅ Order placed successfully

**Day 4 (Thursday): Mobile - Purchase Flow (Part 2) & Orders Screen**

**Morning:**
□ Create order confirmation screen
□ Implement deep linking for payment return
□ Handle payment success/failure

**Afternoon:**
□ Create "My Orders" screen
□ Display order history with status
□ Create order detail screen

**Deliverables:**
- ✅ Complete purchase flow functional
- ✅ Users can view order history and details

**Day 5 (Friday): Admin Order Management**

**Morning:**
□ Backend: Implement GET /admin/orders (with filters)
□ Backend: Implement PUT /admin/orders/:id/approve
□ Backend: Implement PUT /admin/orders/:id/reject

**Afternoon:**
□ Create admin web interface or mobile admin screens
□ Display pending orders
□ Implement approve/reject actions

**Deliverables:**
- ✅ Admin can view pending orders
- ✅ Admin can approve/reject orders
- ✅ Email/push notifications sent on order status change

**Week 3 Summary:**
- **Status:** Core MVP features complete
- **Functionality:** Full user journey from browse to purchase
- **Admin Capabilities:** Order management functional
- **Integration:** Payment flow tested end-to-end

---

### Week 4: Polish, Testing & Deployment

**Goal:** Finalize UI/UX, implement analytics, test thoroughly, deploy to production

**Day 1 (Monday): Notifications Implementation**

**Morning:**
□ Backend: Integrate Expo Push Notifications
□ Backend: Integrate AWS SES for emails
□ Create notification templates (order confirmation, admin alerts)

**Afternoon:**
□ Mobile: Implement push notification handling
□ Mobile: Create in-app notification center
□ Test notifications end-to-end

**Deliverables:**
- ✅ Push notifications working
- ✅ Email notifications sending (order confirmations, admin alerts)

**Day 2 (Tuesday): Analytics & Error Tracking**

**Morning:**
□ Integrate PostHog in mobile app
□ Track key events (listing_viewed, purchase_completed, etc.)
□ Integrate PostHog in backend

**Afternoon:**
□ Integrate Sentry for error tracking (mobile + backend)
□ Set up initial dashboards in PostHog
□ Test event tracking

**Deliverables:**
- ✅ Analytics tracking functional
- ✅ Error tracking active
- ✅ Dashboards configured

**Day 3 (Wednesday): UI/UX Polish & Bug Fixes**

**Full Day:**
□ Review entire app on target device (Samsung J7 Prime)
□ Fix UI inconsistencies
□ Improve loading states and error messages
□ Polish animations and transitions
□ Ensure accessibility (contrast, touch targets)
□ Fix any outstanding bugs from backlog

**Deliverables:**
- ✅ App looks polished and professional
- ✅ All known bugs fixed
- ✅ User experience smooth

**Day 4 (Thursday): Testing & QA**

**Morning:**
□ Run full test suite (unit + integration + e2e)
□ Manual testing of all user flows
□ Test on low-end Android device (performance)

**Afternoon:**
□ Test edge cases (network errors, payment failures)
□ Load test backend API (100 concurrent users)
□ Security review (OWASP checklist)

**Deliverables:**
- ✅ All tests passing
- ✅ Performance acceptable on target device
- ✅ Security vulnerabilities addressed

**Day 5 (Friday): Deployment & Launch**

**Morning:**
□ Deploy backend to production (DigitalOcean or AWS)
□ Run database migrations
□ Configure production environment variables
□ Set up monitoring (Sentry, CloudWatch)

**Afternoon:**
□ Build production APK using EAS Build
□ Test APK on physical device
□ Upload to Google Play Console (Internal Testing track)
□ Send APK to beta testers / stakeholders
□ Update project documentation (README, API docs)

**Deliverables:**
- ✅ Backend deployed to production
- ✅ Mobile app available as APK for testing
- ✅ Beta testing initiated

**Week 4 Summary:**
- **Status:** MVP complete and deployed
- **Backend:** Deployed and stable
- **Mobile App:** Signed APK ready for distribution
- **Monitoring:** Analytics and error tracking active
- **Documentation:** Complete and up-to-date

---

### Post-Launch (Week 5+)

**Week 5: Monitor & Iterate**
- Monitor app performance and errors (Sentry)
- Collect user feedback from beta testers
- Fix critical bugs immediately
- Prioritize feature improvements based on analytics

**Week 6-8: Optimize & Enhance**
- Implement top user-requested features
- Optimize slow API endpoints
- Improve UI based on session replays (PostHog)
- Expand to public release on Google Play Store

**Month 2-3: Scale & Expand**
- Migrate to OneSignal for advanced push notifications
- Implement A/B testing for key flows
- Add iOS support (if demand exists)
- Introduce referral program or loyalty features

---

## 18. Risk Register

This section identifies potential risks and mitigation strategies.

### 18.1 Technical Risks

**Risk 1: Payment Aggregator Integration Delays**
- **Probability:** Medium (40%)
- **Impact:** High (blocks cash collection)
- **Description:** MIPS/Paywise onboarding takes 4-6 weeks; API documentation incomplete
- **Mitigation:**
  - Start onboarding conversations in Week 0
  - Launch with COD-only if necessary (degrades UX but unblocks launch)
  - Have Stripe (via US LLC) as backup plan
- **Contingency:** If both fail by Week 3, launch COD-only MVP, add digital payments in Month 2

**Risk 2: Facebook API Access Denied**
- **Probability:** Low (20%)
- **Impact:** Medium (lose automation advantage)
- **Description:** Facebook app review rejects Fresh Roots' page access request
- **Mitigation:**
  - Provide clear use case description in app review
  - Use admin's personal access token for MVP (limited but functional)
  - Have manual listing creation as primary fallback
- **Contingency:** Admin creates listings manually (slower but viable)

**Risk 3: React Native Performance on Low-End Devices**
- **Probability:** Medium (30%)
- **Impact:** Medium (poor UX for target users)
- **Description:** Samsung J7 Prime (2GB RAM) struggles with image-heavy app
- **Mitigation:**
  - Profile app early (Week 2) on target device
  - Implement aggressive image optimization (lazy loading, lower resolutions)
  - Use FlatList with optimized rendering
  - Limit animations on low-end devices
- **Contingency:** Reduce image sizes further, simplify UI, remove animations

**Risk 4: Database Performance Degradation**
- **Probability:** Low (15%) in MVP phase
- **Impact:** High (slow API, poor UX)
- **Description:** Inadequate indexing or query optimization causes slow responses
- **Mitigation:**
  - Design schema with proper indexes from Day 1
  - Monitor slow query logs
  - Load test in Week 4
  - Add read replicas if needed (Month 2+)
- **Contingency:** Emergency optimization sprint, add Redis caching aggressively

**Risk 5: Third-Party Service Outages**
- **Probability:** Low (10%) but inevitable eventually
- **Impact:** Medium to High (depending on service)
- **Description:** Cloudinary, payment gateway, or PostHog unavailable
- **Mitigation:**
  - Implement graceful degradation (e.g., serve lower-quality images if CDN down)
  - Cache aggressively to reduce external dependencies
  - Have fallback email provider (SES + Mailgun)
  - Monitor third-party status pages
- **Contingency:** Manual workarounds, communicate outage to users

### 18.2 Business Risks

**Risk 6: Low Initial User Adoption**
- **Probability:** Medium (35%)
- **Impact:** Medium (slow growth, delayed break-even)
- **Description:** Users hesitant to try new platform, prefer established competitors
- **Mitigation:**
  - Launch discount: 20% off first order or free delivery
  - Leverage existing Facebook page followers for initial user base
  - Partner with 2-3 popular farmers for exclusive products
  - Invest in targeted Facebook/Instagram ads ($200-500 budget)
- **Contingency:** Extend promotional period, increase ad spend, pivot messaging

**Risk 7: Supply Chain Issues**
- **Probability:** Medium (30%)
- **Impact:** High (unable to fulfill orders)
- **Description:** Farmers can't provide consistent supply; weather impacts harvests
- **Mitigation:**
  - Partner with 5+ diverse suppliers (not single-source)
  - Build buffer stock projections (forecast demand vs. supply)
  - Communicate supply constraints proactively to customers
  - Implement "pre-order" model where farmers commit before harvest
- **Contingency:** Temporary "out of stock" messaging, offer substitutions, refund if necessary

**Risk 8: Cash Flow / Payment Delays**
- **Probability:** Medium (25%)
- **Impact:** High (can't pay farmers, can't operate)
- **Description:** Payment aggregator holds funds for 7-14 days; COD cash not collected promptly
- **Mitigation:**
  - Negotiate faster settlement terms with payment aggregator (T+2 instead of T+7)
  - Maintain cash reserve for 1 month of operations
  - Encourage digital payments (lower COD failure risk)
  - Strict COD collection tracking
- **Contingency:** Short-term loan or personal funds injection, pause new orders until cash recovered

**Risk 9: Competitor Response**
- **Probability:** Medium (40%) if Fresh Roots gains traction
- **Impact:** Medium (price war, feature copying)
- **Description:** Established players (Winners, Votre Pôte Agé) match Fresh Roots' offerings
- **Mitigation:**
  - Focus on differentiation: superior freshness, curated selection, farmer stories
  - Build brand loyalty through excellent customer service
  - Innovate faster (weekly updates vs. competitors' monthly cycles)
  - Secure exclusive partnerships with premium suppliers
- **Contingency:** Find new niche (e.g., organic-only, farm-to-table experiences), double down on UX

### 18.3 Operational Risks

**Risk 10: Key Person Dependency**
- **Probability:** Low (20%)
- **Impact:** High (project halts)
- **Description:** Primary developer unavailable (illness, departure) during critical phase
- **Mitigation:**
  - Comprehensive documentation from Day 1
  - Use standard, well-known technologies (not obscure frameworks)
  - Version control with clear commit messages
  - Have backup developer familiar with codebase
- **Contingency:** Hire freelance developer urgently, reduce scope temporarily

**Risk 11: Data Loss / Security Breach**
- **Probability:** Very Low (5%) with proper precautions
- **Impact:** Critical (loss of trust, legal liability)
- **Description:** Database corrupted, hacked, or deleted; user data exposed
- **Mitigation:**
  - Daily automated backups with 7-day retention
  - Monthly backup restore tests
  - Strong authentication (JWT, bcrypt)
  - Security audit in Week 4
  - PCI compliance via payment aggregator (no card data stored)
- **Contingency:** Restore from backup (RTO 4 hours), notify users, engage security firm

### 18.4 Legal & Regulatory Risks

**Risk 12: Non-Compliance with Data Protection Act 2017**
- **Probability:** Low (15%) if guidelines followed
- **Impact:** High (fines, reputational damage)
- **Description:** Improper handling of personal data, no GDPR-style consent
- **Mitigation:**
  - Privacy policy and terms reviewed by lawyer
  - Explicit consent for data collection
  - Implement data deletion endpoint
  - Minimal data collection (only what's necessary)
  - Self-host analytics after Month 3 (data stays in Mauritius)
- **Contingency:** Immediate compliance fixes, legal consultation, proactive disclosure to authorities

**Risk 13: Food Safety Incident**
- **Probability:** Low (10%)
- **Impact:** High (legal liability, loss of trust)
- **Description:** Customer gets sick from produce; Fresh Roots held liable
- **Mitigation:**
  - Clear terms: Fresh Roots is marketplace, not seller (farmers are sellers)
  - Vet suppliers (only work with registered, compliant farmers)
  - Display clear freshness information and handling instructions
  - Customer service protocol for complaints
  - Liability insurance (business insurance policy)
- **Contingency:** Immediate investigation, remove supplier if at fault, offer refund/medical costs if appropriate, consult lawyer

### 18.5 Risk Monitoring

**Weekly Risk Review:**
- During daily standup, identify new risks
- Update risk register in project management tool
- Escalate high-impact risks immediately

**Risk Dashboard:**
```
High Priority (Probability × Impact > 6):
- Payment aggregator delays
- Database performance
- Supply chain issues

Monitor Weekly:
- User adoption metrics
- Technical debt accumulation
- Competitor activities

Low Priority:
- Data loss (mitigated well)
- Facebook API access (fallback exists)
```

---

## 19. Open Questions & Required Items

This section documents dependencies and outstanding decisions that need resolution before or during development.

### 19.1 Business & Strategic Decisions

**Q1: Business Entity & Legal Structure**
- **Question:** Is Fresh Roots registered as a business entity in Mauritius?
- **Required For:** Tax compliance, payment aggregator onboarding, legal contracts
- **Options:** Sole proprietorship, LLC, private limited company
- **Recommendation:** Register as private limited company for liability protection
- **Action:** Consult lawyer, register with Registrar of Companies
- **Timeline:** Week 0 (urgent, required for payment setup)

**Q2: Delivery Strategy**
- **Question:** Who handles delivery? Fresh Roots directly or third-party?
- **Required For:** Cost modeling, order fulfillment workflow
- **Options:**
  a) Partner with Bongéni/NULivrer (3PL): Lower upfront cost, less control
  b) Own delivery fleet: Higher cost, more control, better UX
  c) Farmer delivers: Lowest cost, inconsistent quality
- **Recommendation:** Start with 3PL (Bongéni) for MVP, build own fleet only if scale justifies (>500 orders/week)
- **Action:** Contact Bongéni for pricing quote
- **Timeline:** Week 0-1

**Q3: Pricing Strategy**
- **Question:** How to price products? Fixed markup on farmer cost? Dynamic pricing?
- **Required For:** Profitability calculations, competitive positioning
- **Options:**
  a) Fixed 20% markup on farmer price
  b) Market-based pricing (match competitor prices)
  c) Premium positioning (10-15% above competitors, emphasize quality)
- **Recommendation:** Start with option C (premium positioning) for differentiation, monitor conversion rates
- **Action:** Survey competitor prices for top 20 products
- **Timeline:** Week 0

**Q4: Return & Refund Policy**
- **Question:** What is the policy for damaged or unsatisfactory produce?
- **Required For:** User trust, customer service workflows
- **Options:**
  a) No returns (too strict, low trust)
  b) Full refund within 24 hours with photo proof (balanced)
  c) Full refund no questions asked (high cost, potential abuse)
- **Recommendation:** Option B (refund with photo proof) for MVP
- **Action:** Draft refund policy document
- **Timeline:** Week 1

### 19.2 Technical Dependencies

**Q5: Facebook Page Access Token**
- **Question:** Can Fresh Roots admin obtain long-lived page access token?
- **Required For:** Facebook listing import automation
- **Options:**
  a) Use admin's personal token (expires periodically)
  b) Create Facebook App and go through app review (takes 3-5 days)
  c) Manual listing creation only (no Facebook integration)
- **Recommendation:** Start with option A for MVP, upgrade to option B post-launch
- **Action:** Admin follows OAuth flow to grant page access
- **Timeline:** Week 1 (for import prototype)

**Q6: Payment Aggregator Selection**
- **Question:** MIPS or Paywise? Or both?
- **Required For:** Payment integration development
- **Decision Criteria:**
  - Transaction fees (lower is better)
  - Settlement speed (faster cash flow)
  - API quality (better docs, easier integration)
  - MCB Juice deep linking support
- **Recommendation:** Contact both, choose faster responder for MVP, can add second later
- **Action:** Email both aggregators with business details, request demo
- **Timeline:** Week 0 (urgent - onboarding takes 2-4 weeks)

**Q7: Domain Name**
- **Question:** Is `freshroots.mu` available? What about alternatives?
- **Required For:** Branding, SSL certificate, email addresses
- **Options:**
  - freshroots.mu (ideal)
  - fresh-roots.mu
  - myfreshroots.mu
  - freshroots.io (international TLD)
- **Action:** Check availability, register immediately if available
- **Timeline:** Week 0

**Q8: Email Addresses**
- **Question:** What email addresses are needed?
- **Required For:** Professional communication, email notifications
- **Needed:**
  - noreply@freshroots.mu (system emails)
  - support@freshroots.mu (customer service)
  - admin@freshroots.mu (admin notifications)
  - security@freshroots.mu (security reports)
- **Action:** Set up email forwarding or mailboxes after domain registration
- **Timeline:** Week 1

### 19.3 Design & UX

**Q9: Logo & Brand Assets**
- **Question:** Does Fresh Roots have a logo? Brand colors?
- **Required For:** App UI, marketing materials, app store listing
- **Options:**
  a) Hire designer (cost: $200-500, timeline: 1 week)
  b) Use AI generator like Looka or Canva (cost: $20-100, instant)
  c) Simple text logo for MVP, upgrade later
- **Recommendation:** Option B for MVP (good enough, fast, cheap)
- **Action:** Generate logo options, choose best
- **Timeline:** Week 0

**Q10: App Name & Tagline**
- **Question:** Confirm final app name and tagline for app stores
- **Options:**
  - "Fresh Roots - Local Produce Delivered"
  - "Fresh Roots - Farm to Your Door"
  - "Fresh Roots Marketplace - Fresh Local Produce"
- **Recommendation:** "Fresh Roots - Fresh Local Produce"
- **Action:** Finalize with stakeholders
- **Timeline:** Week 3 (needed for app store submission)

### 19.4 Operational

**Q11: Customer Service**
- **Question:** Who handles customer support? Email, phone, chat?
- **Required For:** Post-launch operations
- **Options:**
  a) Admin handles manually (MVP approach)
  b) Hire dedicated customer service rep (>100 orders/week)
  c) Use helpdesk software like Zendesk (overkill for MVP)
- **Recommendation:** Option A for MVP, transition to B by Month 3
- **Action:** Set up support@freshroots.mu inbox, define SLA (respond within 24 hours)
- **Timeline:** Week 4

**Q12: Delivery Zones**
- **Question:** Which cities/regions for MVP launch? Island-wide or limited?
- **Required For:** Logistics planning, app messaging
- **Options:**
  a) Island-wide from Day 1 (ambitious, harder to manage)
  b) Start with 2-3 cities (Quatre Bornes, Curepipe, Rose Hill) - manageable
  c) Start with 1 city (Quatre Bornes) - safest
- **Recommendation:** Option B (2-3 cities) for sufficient market size without overextension
- **Action:** Define delivery zones, communicate to farmers
- **Timeline:** Week 0

**Q13: Farmer Onboarding**
- **Question:** How many farmers are committed? How to onboard more?
- **Required For:** Supply availability
- **Minimum Needed:** 5 farmers for diverse product range
- **Onboarding Process:**
  1. Initial meeting (explain platform, benefits)
  2. Verify compliance (registered business, food safety practices)
  3. Negotiate pricing and logistics
  4. Add to supplier database
  5. Create initial listings from their products
- **Action:** Reach out to farmers from Facebook network, local markets
- **Timeline:** Week 0-1 (ongoing)

### 19.5 Post-Launch

**Q14: iOS Support Timeline**
- **Question:** When to launch iOS version?
- **Considerations:**
  - Android: 85%+ market share in Mauritius (priority)
  - iOS: 10-15% (wealthy demographic, higher AOV)
- **Recommendation:** 
  - Month 1-3: Android only
  - Month 4+: iOS if Android validates product-market fit
- **Requirements for iOS:** Apple Developer account ($99/year), MacOS for Xcode
- **Timeline:** Decision at Month 3 based on Android traction

**Q15: Expansion Features**
- **Question:** What features to add after MVP?
- **Candidate Features (prioritize post-launch):**
  - Shopping cart (vs. single-item purchase)
  - Favorites / Wishlists
  - Ratings & reviews
  - Loyalty program / referral bonuses
  - Subscription boxes (weekly produce delivery)
  - Recipe suggestions based on available produce
  - Social features (share favorite items)
- **Action:** User feedback survey post-launch, prioritize top requests
- **Timeline:** Month 2+

### 19.6 Checklist Summary

**Critical (Week 0):**
□ Business entity registered
□ Domain name purchased
□ Payment aggregator contacted
□ Delivery partner contacted
□ Delivery zones defined

**Important (Week 1-2):**
□ Logo created
□ Facebook page access token obtained
□ Email addresses set up
□ Farmer partnerships confirmed
□ Refund policy written

**Nice to Have (Week 3-4):**
□ App name finalized
□ Customer service process defined
□ iOS roadmap decided

---

## 20. Next-Phase Roadmap

This section outlines the evolution of Fresh Roots beyond the MVP, with features and improvements planned for Months 2-12 and beyond.

### 20.1 Month 2-3: Optimization & Enhancements

**Focus:** Improve core experience based on user feedback

**Key Features:**

**1. Shopping Cart**
- **Why:** Users want to order multiple items in one transaction (reduces delivery fees)
- **Complexity:** Medium (backend: cart session management; frontend: cart screen, quantity updates)
- **Priority:** High
- **Estimated Effort:** 2 weeks

**2. Saved Addresses**
- **Why:** Returning customers don't want to re-enter address every time
- **Complexity:** Low
- **Priority:** High
- **Estimated Effort:** 3 days

**3. Order Tracking Enhancements**
- **Why:** Users want real-time status updates
- **Features:**
  - SMS notifications for status changes
  - Estimated delivery time
  - Driver contact info (if own fleet)
- **Complexity:** Medium
- **Priority:** Medium
- **Estimated Effort:** 1 week

**4. Admin Analytics Dashboard**
- **Why:** Admin needs insights to make data-driven decisions
- **Metrics:**
  - Sales by category, time period
  - Top products, low-performing products
  - Customer acquisition funnel
  - Revenue projections
- **Complexity:** Medium (use PostHog + custom queries)
- **Priority:** Medium
- **Estimated Effort:** 1 week

**5. Performance Optimization**
- **Why:** Address any performance bottlenecks identified in Month 1
- **Actions:**
  - Implement more aggressive caching
  - Optimize slow database queries
  - Reduce image sizes further
  - Add database read replicas if needed
- **Complexity:** Varies
- **Priority:** High if performance issues reported
- **Estimated Effort:** Ongoing

**Infrastructure:**
- Scale to 2-3 backend instances
- Add database read replica
- Migrate to AWS S3 + CloudFront for images (if Cloudinary costs increasing)

**Total Dev Time:** 6-8 weeks (1-2 developers)

---

### 20.2 Month 4-6: Growth & Engagement

**Focus:** Drive user acquisition and retention

**Key Features:**

**1. Referral Program**
- **Why:** Incentivize organic growth via word-of-mouth
- **Mechanics:**
  - Refer friend → Friend gets 20% off first order
  - Referrer gets MUR 50 credit after friend's first purchase
- **Complexity:** Medium (referral code generation, tracking, credit system)
- **Priority:** High
- **Estimated Effort:** 2 weeks

**2. Loyalty Program / Points**
- **Why:** Encourage repeat purchases
- **Mechanics:**
  - Earn 1 point per MUR 10 spent
  - Redeem 100 points = MUR 10 discount
  - Tiered benefits (Silver, Gold, Platinum)
- **Complexity:** High (points accounting, redemption logic)
- **Priority:** Medium
- **Estimated Effort:** 3 weeks

**3. Ratings & Reviews**
- **Why:** Build trust, provide social proof
- **Features:**
  - 5-star rating system
  - Text reviews with photos
  - Only verified purchasers can review
- **Complexity:** Medium
- **Priority:** Medium
- **Estimated Effort:** 2 weeks

**4. Subscription Boxes**
- **Why:** Predictable revenue, convenience for customers
- **Mechanics:**
  - Weekly/bi-weekly delivery of curated produce box
  - Customer can skip a week or cancel anytime
  - Different box sizes (Small: MUR 300, Medium: MUR 500, Large: MUR 800)
- **Complexity:** High (recurring billing, box curation algorithm, subscription management)
- **Priority:** High (strong revenue driver)
- **Estimated Effort:** 4 weeks

**5. Wishlist / Favorites**
- **Why:** Users want to save products they like
- **Complexity:** Low
- **Priority:** Low (nice-to-have)
- **Estimated Effort:** 3 days

**Marketing:**
- Launch Facebook/Instagram ad campaigns ($500-1,000/month budget)
- Partner with food bloggers for sponsored posts
- Host virtual "farm tour" events

**Infrastructure:**
- Implement OneSignal for advanced push notification campaigns
- Self-host PostHog to save costs
- Add monitoring alerts for business metrics (orders/hour dropping)

**Total Dev Time:** 11-13 weeks (2 developers)

---

### 20.3 Month 7-12: Scale & Differentiation

**Focus:** Handle growth, expand offerings, build competitive moats

**Key Features:**

**1. iOS App Launch**
- **Why:** Tap into affluent iOS user segment (10-15% of Mauritius market)
- **Complexity:** Low (React Native already cross-platform, mostly config + testing)
- **Priority:** High if Android shows strong traction
- **Estimated Effort:** 2 weeks (+ $99 Apple Developer account)

**2. Multi-Vendor Marketplace**
- **Why:** Scale supply without directly managing all farmers
- **Mechanics:**
  - Farmers can create their own accounts
  - Farmers manage their own listings, inventory, pricing
  - Fresh Roots takes commission (15-20%)
- **Complexity:** Very High (seller onboarding, multi-tenant architecture, commission calculations, payouts)
- **Priority:** Medium (transforms business model)
- **Estimated Effort:** 8-10 weeks

**3. Recipe Suggestions**
- **Why:** Inspire customers, increase basket size
- **Features:**
  - Recipe database linked to products
  - "Add all ingredients to cart" button
  - Seasonal recipe recommendations
- **Complexity:** Medium
- **Priority:** Low (nice-to-have)
- **Estimated Effort:** 2 weeks

**4. Advanced Search & Filters**
- **Why:** Help users find exactly what they want
- **Features:**
  - Filter by: price range, farm location, organic certification, delivery time
  - Sort by: popularity, price, newest, rating
  - Search autocomplete
- **Complexity:** Medium (requires Elasticsearch for advanced search)
- **Priority:** Medium
- **Estimated Effort:** 2-3 weeks

**5. Social Features**
- **Why:** Build community, increase engagement
- **Features:**
  - Share favorite products on social media
  - Create and share custom produce lists (e.g., "My BBQ Shopping List")
  - Follow friends to see what they're buying
- **Complexity:** Medium
- **Priority:** Low
- **Estimated Effort:** 3 weeks

**6. Admin Mobile App**
- **Why:** Admin needs to manage orders on-the-go
- **Features:**
  - View and manage orders from mobile device
  - Push notifications for new orders
  - Quick approve/reject actions
  - Contact customer directly (call/WhatsApp)
- **Complexity:** Medium
- **Priority:** High (improves admin efficiency)
- **Estimated Effort:** 3 weeks

**Marketing & Partnerships:**
- Partner with corporate offices for bulk orders (catering)
- Launch "Fresh Roots Farm Club" membership (premium tier)
- Explore partnerships with health/fitness influencers
- Consider expanding to neighboring islands (Rodrigues, Réunion)

**Infrastructure:**
- Migrate to AWS for better scalability and global CDN
- Implement microservices architecture if monolith becomes bottleneck
- Add Redis cluster for high availability
- Implement blue-green deployments for zero-downtime updates

**Total Dev Time:** 20-25 weeks (2-3 developers)

---

### 20.4 Year 2+: Mature Product & Market Leadership

**Strategic Goals:**
- **Market Share:** Become #1 fresh produce delivery platform in Mauritius (>50% market share)
- **Brand:** Synonymous with "fresh, local, quality"
- **Expansion:** Other product categories (dairy, bakery, pantry staples)
- **Technology:** AI-powered demand forecasting, personalized recommendations

**Major Features:**

**1. AI/ML Personalization Engine**
- Recommend products based on purchase history
- Predict what user will want before they know it
- Optimize delivery routes with ML

**2. B2B Platform**
- Dedicated portal for restaurants, hotels, corporate clients
- Bulk ordering, custom pricing, invoicing
- Subscription contracts

**3. Own Logistics Fleet**
- If order volume justifies (>3,000 orders/week)
- Better control, faster delivery, lower long-term costs
- Branded delivery vehicles (marketing)

**4. Vertical Integration**
- Partner farm ownership (ensure supply, quality control)
- Cold storage facilities
- Packing facilities for subscription boxes

**5. International Expansion**
- Réunion Island (French territory nearby)
- Other Indian Ocean islands (Seychelles, Maldives)
- Franchise model for other countries

**6. Sustainability Initiatives**
- Carbon-neutral delivery
- Zero-waste packaging
- Composting program (collect food waste from customers)
- Educational content on sustainable farming

**Infrastructure:**
- Multi-region deployment (Africa, Europe if expanding)
- Advanced DevOps with Kubernetes
- Real-time analytics with streaming pipelines (Kafka)
- Machine learning infrastructure (model training, serving)

---

### 20.5 Feature Prioritization Framework

**How to decide what to build next:**

**1. RICE Score (Reach × Impact × Confidence / Effort)**
```
Reach: How many users affected? (1-10)
Impact: How much does it improve their experience? (1-10)
Confidence: How sure are we? (1-10)
Effort: How many person-weeks? (divide by this)

Example - Shopping Cart:
Reach: 8 (80% of users will use it)
Impact: 9 (major improvement in UX)
Confidence: 9 (validated by user feedback)
Effort: 2 weeks

RICE = (8 × 9 × 9) / 2 = 648 / 2 = 324

Compare scores across features, build highest first.
```

**2. User Feedback Weighting**
- Survey users monthly: "What feature would you like most?"
- Weight by user segment (high-value customers get 2x weight)
- Feature requested by >30% of users = High Priority

**3. Business Impact**
- Revenue potential (e.g., subscription boxes = recurring revenue)
- Cost savings (e.g., admin mobile app = efficiency)
- Competitive pressure (e.g., competitor launches similar feature)

**4. Technical Debt Balance**
- Alternate between new features and tech debt paydown
- Rule: For every 3 feature weeks, spend 1 week on refactoring/optimization

---

### 20.6 Long-Term Vision

**5-Year Vision (2031):**

Fresh Roots has evolved from a simple marketplace to a **comprehensive food ecosystem platform**, deeply integrated into the daily lives of Mauritians.

**Product Evolution:**
- Mobile app used daily by 100,000+ Mauritian households
- Expanded to all food categories (not just produce)
- AI-powered meal planning ("What should I cook?" → app suggests recipes + auto-orders ingredients)
- Virtual farmer's market (live video shopping with farmers)

**Business Model:**
- Hybrid: Commission-based marketplace + own-brand products
- Subscription revenue: 40% of customers on weekly box subscriptions
- B2B platform generates 30% of revenue

**Social Impact:**
- Supporting 500+ local farmers
- Reduced food waste by 40% through demand forecasting
- Providing nutritious food to underserved communities (partnership with NGOs)

**Brand Position:**
- Most trusted food brand in Mauritius
- Synonymous with fresh, local, sustainable
- Case study in African tech startups

**Team:**
- 20-30 employees (engineering, operations, marketing, customer service)
- Offices in Port Louis and satellite hubs in major cities

**Financials:**
- GMV: MUR 200 million/year ($4.4 million)
- Take rate: 15-20%
- Annual revenue: MUR 30-40 million ($660k-880k)
- Profitable with healthy margins

---

## Conclusion

This comprehensive system design document provides Fresh Roots with a complete blueprint for building a production-ready mobile marketplace in 4 weeks. From detailed API specifications to cost projections, security strategies to post-launch roadmaps, every aspect of development has been carefully planned and documented.

**Key Success Factors:**

1. **Focus on MVP:** Resist feature creep. Launch with core functionality, iterate based on real user feedback.

2. **Data-Driven Decisions:** Use PostHog analytics religiously. Let data guide feature prioritization.

3. **User-Centric Design:** The Samsung J7 Prime user should feel the app is fast, intuitive, and delightful.

4. **Quality Over Speed:** A polished MVP that works flawlessly beats a buggy app with more features.

5. **Build Relationships:** Success depends on strong partnerships with farmers, payment providers, delivery services, and most importantly, customers.

6. **Stay Lean:** Control costs aggressively in MVP phase. Every dollar saved extends runway.

7. **Iterate Fast:** Weekly deployments, rapid A/B testing, quick pivots when needed.

**Next Steps:**

1. **Week 0:** Execute the planning checklist (register business, contact payment aggregators, set up domain)

2. **Week 1-4:** Follow the milestone plan religiously. Daily standups to track progress.

3. **Week 5:** Launch to beta testers. Collect intensive feedback.

4. **Week 6-8:** Iterate based on feedback. Fix critical bugs. Optimize UX.

5. **Month 3:** Public launch on Google Play Store. Marketing push.

6. **Month 4+:** Grow user base. Add features from roadmap based on prioritization framework.

**This is an ambitious but achievable plan. With focus, discipline, and execution excellence, Fresh Roots will revolutionize how Mauritians buy fresh produce.**

---

**Document Version:** 1.0  
**Last Updated:** January 23, 2026  
**Total Pages:** [Auto-calculated based on export]  
**Total Word Count:** ~50,000 words  

**Prepared For:** Fresh Roots Marketplace Development Team  
**Prepared By:** AI System Architect (via DeepAgent)

---

### References

[1] eCommerce - Mauritius | Statista
[2] Expo Documentation | React Native Framework
[3] NestJS Documentation | Progressive Node.js Framework
[4] Node.js Performance Benchmarks vs. Python, Ruby, PHP
[5] PostgreSQL vs. MongoDB for E-Commerce Applications
[6] Cloudinary Pricing and Documentation
[7] AWS S3 + CloudFront vs. Cloudinary Cost Analysis
[8] CDN Performance in Mauritius and Africa
[9] Payment Processing in Mauritius | MIPS, Paywise, MCB Juice
[10] Data Protection Act 2017 Mauritius - Full Text
[11] Facebook Graph API Documentation v19.0
[12] Push Notification Services Comparison: Expo vs. OneSignal vs. FCM
[13] PostHog Documentation | Open-Source Product Analytics

---

**END OF DOCUMENT**
