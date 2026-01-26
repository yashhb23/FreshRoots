# Gmail SMTP Setup Guide for Fresh Roots

## 🎯 Quick Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication on Your Gmail Account

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Complete the verification setup

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter: **Fresh Roots Backend**
5. Click **Generate**
6. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yashbeeharry363@gmail.com
SMTP_PASS=<your-16-character-app-password>
EMAIL_FROM="Fresh Roots <yashbeeharry363@gmail.com>"

# Admin email for notifications
ADMIN_EMAIL=yashbeeharry363@gmail.com
```

### Step 4: Test the Email Setup

I'll create a test endpoint you can call to verify email is working.

---

## 📊 Gmail SMTP Limits

- **Free Gmail Account**: 500 emails per day
- **Google Workspace**: 2,000 emails per day

**For production with higher volume**, consider:
- **SendGrid**: 100 emails/day free, then paid plans
- **AWS SES**: $0.10 per 1,000 emails (requires domain)
- **Mailgun**: 5,000 emails/month free

---

## 🔒 Security Notes

1. **Never commit `.env` file** to git
2. The App Password is **specific to this app** and can be revoked anytime
3. If compromised, just delete the App Password from Google and generate a new one

---

## 🐛 Troubleshooting

### "Invalid credentials" error:
- Make sure 2FA is enabled
- Use App Password, not your regular Gmail password
- Remove any spaces from the App Password

### "Less secure app access" error:
- This is old - use App Passwords instead (Step 2 above)

### "Daily sending quota exceeded":
- You've hit Gmail's 500 email/day limit
- Upgrade to Google Workspace or use SendGrid/AWS SES

---

## ✅ After Configuration

Once you've added the environment variables:

1. Restart the backend server
2. Test by creating an order (you'll receive email notifications)
3. Check admin email (yashbeeharry363@gmail.com) for order notifications
4. Check customer emails for order confirmations
