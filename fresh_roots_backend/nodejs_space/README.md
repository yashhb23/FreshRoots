# 🥬 Fresh Roots API

**Marketplace API for fresh vegetables and food items in Mauritius**

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Set up database
npx prisma db push
npx prisma db seed

# Start development server
yarn start:dev
```

Server runs on: `http://localhost:3000`  
API Docs: `http://localhost:3000/api-docs`

## 📚 Documentation

See **FRESH_ROOTS_DEVELOPER_GUIDE.md** in project root for complete documentation.

## 🔑 Admin Credentials

- Email: yashbeeharry363@gmail.com
- Password: Admin@123

## 🎯 Key Features

- ✅ JWT Authentication
- ✅ Product Listings & Categories
- ✅ Interest Expressions
- ✅ Order Management
- ✅ Payment Integration (MIPS/Juice)
- ✅ PostHog Analytics
- ✅ Email Notifications

## 📖 API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

**Listings:**
- `GET /api/listings` - Browse products
- `GET /api/listings/:id` - Product details
- `POST /api/admin/listings` - Create (admin)

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - My orders
- `GET /api/admin/orders` - All orders (admin)

**Interest:**
- `POST /api/interest` - Express interest
- `GET /api/interest/my-interests` - My interests

[Full API documentation at `/api-docs`]

## 🛠️ Tech Stack

- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- PostHog Analytics
- MIPS Payment Gateway
- Email Notifications (SMTP)

## 📧 Contact

- Admin: yashbeeharry363@gmail.com
- API: https://ff700b369.na101.preview.abacusai.app

## 📄 License

Proprietary - Fresh Roots Mauritius © 2026
