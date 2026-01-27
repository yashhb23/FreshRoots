# Fresh Roots - Data Sources and Email Configuration Guide

## Data Sources: What's Real vs Placeholder

### Backend Data (PostgreSQL via Prisma)

The app fetches **real data** from your deployed backend at:
- **Abacus AI**: `https://freshroots.abacusai.app/api`
- **Swagger Docs**: `https://freshroots.abacusai.app/api-docs`

**Endpoints returning real DB data:**

| Endpoint | Data |
|----------|------|
| `GET /listings` | All product listings (title, price, stock, location, images) |
| `GET /listings/:id` | Single listing details |
| `GET /categories` | All categories |
| `POST /auth/login` | Authenticates user and returns JWT + user info |
| `POST /auth/register` | Creates new user in DB |
| `GET /orders/my-orders` | User's order history |

**User profile shown after login** (name, email, phone) comes directly from the backend DB, not placeholder data.

### Firebase Data (Firestore)

Firebase stores **supplementary user data** synced from the mobile app:

| Collection | Purpose |
|------------|---------|
| `users/{backendUserId}` | Profile sync (email, name, phone, role) |
| `favorites` | User's favorite listing IDs |
| `cartSummary` | Cart metadata (item count, total) |
| `events` | Analytics events (views, clicks) |

### What IS Placeholder

1. **Listing images**: Many listings share a seed Unsplash image because actual product images aren't uploaded yet.
2. **Ratings**: The `⭐ 4.8 (191)` badge on ProductDetailScreen is hardcoded (no ratings table in backend yet).

---

## Email Configuration

### How Emails Work

Emails are sent by the **NestJS backend** using `nodemailer` + Gmail SMTP (or any SMTP provider).

**Email triggers:**
- `POST /auth/register` → welcome email to user + new user notification to admin
- `POST /auth/login` → login activity email to user + login notification to admin
- `POST /orders` → order confirmation to user + order notification to admin
- `POST /interest` → interest notification to admin

### Required Environment Variables

Set these on your deployed backend (Abacus/Railway/etc.):

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# Email Recipients
EMAIL_FROM="Fresh Roots <your-gmail@gmail.com>"
ADMIN_EMAIL=admin@yourfreshroots.com

# Optional
APP_URL=https://freshroots.abacusai.app
```

### Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate a new app password for "Mail" on "Other (Custom name)" → call it "Fresh Roots"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
6. Use this as `SMTP_PASS` (remove spaces)

### Why You're Not Receiving Emails

If emails aren't arriving:

1. **SMTP not configured**: Check backend logs for `⚠️ SMTP credentials not configured`
2. **Wrong credentials**: Check for `❌ Failed to send...` errors
3. **Spam folder**: Gmail may filter the emails
4. **Abacus env vars**: Ensure the Abacus AI deployment has the SMTP env vars set

### Testing Email

From your PC (with backend running locally):

```bash
curl -X POST http://localhost:3000/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}'
```

Or check the Swagger UI at `/api-docs` for the test endpoint.

---

## Where User Data Is Stored

| Data | Location |
|------|----------|
| Account credentials (email, password hash) | PostgreSQL (backend) |
| User profile (name, phone, role) | PostgreSQL (backend) |
| Favorites | AsyncStorage (local) + Firestore (synced) |
| Cart | AsyncStorage (local) + Firestore (synced) |
| Orders | PostgreSQL (backend) |
| Auth tokens (access, refresh) | AsyncStorage (local) |

---

## Summary

- **Product listings, categories, orders, users** = real backend DB data
- **Profile shown after login** = real backend DB data (not placeholder)
- **Listing images** = mostly placeholder Unsplash images
- **Emails** = sent by backend (requires SMTP env vars)
- **No emails received** = SMTP not configured on deployed backend

To enable emails on Abacus AI deployment, add the SMTP environment variables listed above.
