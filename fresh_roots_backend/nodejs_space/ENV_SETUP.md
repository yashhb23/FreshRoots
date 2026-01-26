# Environment Variables Setup Guide

## Quick Start

1. Copy the `.env.template` file to `.env`:
   ```bash
   cp .env.template .env
   ```

2. Update the values in `.env` with your actual credentials.

## Gmail SMTP Configuration (for Email Notifications)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable it

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Type: "Fresh Roots Backend"
5. Click **Generate**
6. Copy the 16-character password (shown without spaces)

### Step 3: Update .env File

```env
SMTP_USER="your-gmail-address@gmail.com"
SMTP_PASS="abcd efgh ijkl mnop"  # The 16-char app password (spaces don't matter)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"

EMAIL_FROM="FreshRoots <your-gmail-address@gmail.com>"
ADMIN_EMAIL="your-admin-email@gmail.com"
```

### Step 4: Test Email Configuration

After starting the backend server, test email sending:

```bash
curl "http://localhost:3000/api/test-email?to=your-email@example.com"
```

You should receive a test email within seconds.

## What Emails Are Sent?

### 1. Login Notifications (NEW)
- **To User**: Security alert when they log in
- **To Admin**: Notification about user login activity

### 2. Interest Expressions
- **To Admin**: When a customer expresses interest in a product

### 3. Orders
- **To Customer**: Order confirmation
- **To Admin**: New order notification

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/fresh_roots` |
| `JWT_SECRET` | ✅ Yes | Secret for access tokens | Any strong random string |
| `JWT_REFRESH_SECRET` | ✅ Yes | Secret for refresh tokens | Any strong random string |
| `SMTP_USER` | ⚠️ Optional | Gmail address for sending emails | `yourname@gmail.com` |
| `SMTP_PASS` | ⚠️ Optional | Gmail app password | 16-character password |
| `ADMIN_EMAIL` | ⚠️ Optional | Email to receive admin notifications | `admin@yourcompany.com` |
| `POSTHOG_API_KEY` | ⚠️ Optional | PostHog analytics key | Get from PostHog dashboard |

## Security Notes

- **Never commit `.env` to version control** (it's in `.gitignore`)
- Use strong, unique secrets for JWT tokens
- Gmail App Passwords are safer than your account password
- Rotate credentials periodically

## Troubleshooting

### "Email service is not configured"
- Make sure `SMTP_USER` and `SMTP_PASS` are set in `.env`
- Restart the backend server after updating `.env`

### "Failed to send email"
- Verify 2-Step Verification is enabled in your Google Account
- Double-check the app password is correct (16 characters)
- Ensure `SMTP_PORT` is `465` and `SMTP_SECURE` is `true`

### Emails not received
- Check spam/junk folder
- Verify `ADMIN_EMAIL` is set correctly
- Test with the `/api/test-email` endpoint first
