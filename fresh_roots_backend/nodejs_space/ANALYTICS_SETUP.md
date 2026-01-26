# Analytics & Email Configuration

## PostHog Analytics (Optional)

PostHog is configured to be **optional** and will not crash if missing.

### Status
- ✅ **Graceful degradation**: If `POSTHOG_API_KEY` is not set, analytics are automatically disabled
- ✅ **No crashes**: All tracking calls return early if disabled
- ✅ **Console warnings**: Clear warning shown on startup when disabled

### Configuration

1. Sign up for PostHog (free tier): https://posthog.com/
2. Get your API key from the PostHog dashboard
3. Add to your `.env`:

```env
POSTHOG_API_KEY="phc_your_actual_key_here"
POSTHOG_HOST="https://app.posthog.com"  # Default, can be self-hosted
```

### What Gets Tracked

When enabled, PostHog tracks:
- **User Registration** (`user_registered` event)
- **User Login** (`user_logged_in` event)
- **User Identification** (email, name, phone, role)

### Testing Without PostHog

Simply leave `POSTHOG_API_KEY` unset in your `.env`. You'll see:
```
⚠️  PostHog API key not found. Analytics disabled.
```

The app will function normally.

---

## Gmail SMTP Email Notifications (Optional)

Email notifications are also **optional** and configured for graceful degradation.

### Status
- ✅ **Graceful degradation**: If SMTP not configured, emails are not sent
- ✅ **No crashes**: Email failures are caught and logged
- ✅ **Console warnings**: Clear message shown when SMTP is disabled

### What Emails Are Sent

When **SMTP is configured**:
1. **Registration**: Welcome email to user + notification to admin
2. **Login**: Security alert to user + activity notification to admin
3. **Interest Expressed**: Notification to admin
4. **Order Placed**: Confirmation to user + notification to admin

### Configuration

See [`ENV_SETUP.md`](ENV_SETUP.md) for complete Gmail SMTP setup instructions.

Quick summary:
```env
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-char-app-password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
EMAIL_FROM="FreshRoots <your-gmail@gmail.com>"
ADMIN_EMAIL="admin@example.com"
```

---

## Production Readiness Checklist

### Before Deploying to Production (Mauritius Users)

- [ ] **Backend URL**: Deploy backend with **HTTPS** (use Railway, Render, or Vercel)
- [ ] **Update Mobile App**: Change `PROD_API_URL` in `fresh_roots_mobile/src/utils/config.ts`
- [ ] **Environment Variables**: Set all production env vars on hosting platform
- [ ] **PostHog** (Optional): Add API key for production analytics
- [ ] **Gmail SMTP** (Recommended): Configure for transactional emails
- [ ] **Firebase**:
  - [ ] Enable Anonymous + Google authentication
  - [ ] Create Firestore database
  - [ ] Set Firestore security rules
- [ ] **Test**: Verify register/login/guest/checkout flow end-to-end

### Current Setup (Development)

- ✅ Backend runs on local PC (HTTP)
- ✅ Mobile connects via Wi-Fi LAN IP
- ✅ Firebase configured (Auth + Firestore)
- ⚠️  PostHog: Optional (disabled by default)
- ⚠️  SMTP: Optional (disabled by default)

### For Mauritian Users (Production)

Users in Mauritius won't be on your LAN, so:
1. Deploy backend to a cloud service with HTTPS
2. Update `PROD_API_URL` in mobile app
3. Rebuild APK with production configuration
4. Set `ENVIRONMENT = 'production'` in `config.ts`

---

## FAQ

**Q: Will my app crash without PostHog?**  
A: No, PostHog is optional and gracefully degrades.

**Q: Will my app crash without SMTP configured?**  
A: No, emails simply won't be sent. The app functions normally.

**Q: How do I know if PostHog is working?**  
A: Check the backend console for `✅ PostHog analytics initialized` on startup.

**Q: How do I test email sending?**  
A: Use the test endpoint: `GET /api/test-email?to=your@email.com`

**Q: What happens if Firebase is not configured?**  
A: Firebase is required for the mobile app. Ensure `google-services.json` is in place and Firebase console has Auth + Firestore enabled.
