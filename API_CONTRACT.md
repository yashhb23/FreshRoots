# Fresh Roots API Contract (Source of Truth for Frontend)
**Generated**: 2026-01-26  
**Base URL (Dev)**: `http://<YOUR_LOCAL_IP>:3000/api`  
**Base URL (Prod)**: `https://ff700b369.na101.preview.abacusai.app/api`

All endpoints return JSON with structure:
```json
{
  "success": true | false,
  "data": { ... },           // on success
  "error": { ... }           // on failure
}
```

## Authentication Endpoints

### 1. Register User
- **POST** `/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+23054321234"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

### 2. Login
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

### 3. Refresh Token
- **POST** `/auth/refresh`
- **Body**:
```json
{
  "refreshToken": "jwt..."
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt...",
    "refreshToken": "new_refresh_jwt..."
  }
}
```

### 4. Get Current User
- **GET** `/auth/me`
- **Auth**: Bearer Token Required
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+23054321234",
    "role": "user",
    "created_at": "2026-01-23T..."
  }
}
```

## Categories Endpoints

### 5. Get All Categories
- **GET** `/categories`
- **Auth**: None (Public)
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vegetables",
      "slug": "vegetables",
      "description": "Fresh vegetables from local farms",
      "icon": "🥬",
      "created_at": "2026-01-23T..."
    }
  ]
}
```

## Listings (Products) Endpoints

### 6. Browse Listings
- **GET** `/listings`
- **Auth**: None (Public)
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20, max: 100)
  - `search` (optional): Search in title/description
  - `category` (optional): Filter by category slug
  - `sortBy` (optional): `price` | `created_at` | `title`
  - `sortOrder` (optional): `asc` | `desc`
- **Example**: `/listings?page=1&limit=20&search=broccoli&category=vegetables&sortBy=price&sortOrder=asc`
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": "uuid",
        "title": "Fresh Broccoli",
        "description": "Green broccoli, rich in nutrients",
        "price": 95.0,
        "unit": "kg",
        "stock": 20,
        "category": {
          "id": "uuid",
          "name": "Vegetables",
          "slug": "vegetables"
        },
        "location": "Curepipe",
        "tags": ["local", "fresh"],
        "images": [
          {
            "id": "uuid",
            "image_url": "https://...",
            "is_primary": true,
            "order": 0
          }
        ],
        "is_active": true,
        "created_at": "2026-01-23T..."
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

### 7. Get Single Listing (Product Detail)
- **GET** `/listings/:id`
- **Auth**: None (Public)
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fresh Broccoli",
    "description": "Green broccoli, rich in nutrients. Perfect for healthy meals.",
    "price": 95.0,
    "unit": "kg",
    "stock": 20,
    "category": {
      "id": "uuid",
      "name": "Vegetables",
      "slug": "vegetables"
    },
    "location": "Curepipe",
    "tags": ["local", "fresh"],
    "images": [
      {
        "id": "uuid",
        "image_url": "https://...",
        "is_primary": true,
        "order": 0
      }
    ],
    "admin": {
      "name": "Fresh Roots Admin",
      "email": "yashbeeharry363@gmail.com"
    },
    "is_active": true,
    "created_at": "2026-01-23T...",
    "updated_at": "2026-01-23T..."
  }
}
```

## Interest Expressions Endpoints

### 8. Express Interest
- **POST** `/interest`
- **Auth**: Bearer Token Required
- **Body**:
```json
{
  "listing_id": "uuid",
  "message": "I'm interested in bulk order. What's the price for 5kg?"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "listing_id": "uuid",
    "message": "I'm interested in bulk order...",
    "status": "pending",
    "created_at": "2026-01-23T..."
  }
}
```

### 9. Get My Interest Expressions
- **GET** `/interest/my-interests`
- **Auth**: Bearer Token Required
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "listing": {
        "id": "uuid",
        "title": "Fresh Broccoli",
        "price": 95.0,
        "images": [...]
      },
      "message": "I'm interested in bulk order...",
      "status": "contacted",
      "created_at": "2026-01-23T..."
    }
  ]
}
```

## Orders Endpoints

### 10. Create Order
- **POST** `/orders`
- **Auth**: Bearer Token Required
- **Body**:
```json
{
  "items": [
    {
      "listing_id": "uuid",
      "quantity": 2
    },
    {
      "listing_id": "uuid2",
      "quantity": 5
    }
  ],
  "payment_method": "cash_on_delivery" | "juice"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260123-001",
    "total_amount": 450.0,
    "payment_method": "cash_on_delivery",
    "payment_status": "pending",
    "order_status": "pending",
    "items": [
      {
        "id": "uuid",
        "listing": {
          "id": "uuid",
          "title": "Fresh Broccoli",
          "images": [...]
        },
        "quantity": 2,
        "unit_price": 95.0,
        "subtotal": 190.0
      }
    ],
    "created_at": "2026-01-23T..."
  }
}
```

### 11. Get My Orders
- **GET** `/orders/my-orders`
- **Auth**: Bearer Token Required
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20260123-001",
      "total_amount": 450.0,
      "payment_method": "cash_on_delivery",
      "payment_status": "pending",
      "order_status": "pending",
      "items": [
        {
          "listing": {
            "title": "Fresh Broccoli",
            "images": [...]
          },
          "quantity": 2,
          "unit_price": 95.0,
          "subtotal": 190.0
        }
      ],
      "created_at": "2026-01-23T..."
    }
  ]
}
```

### 12. Get Single Order
- **GET** `/orders/:id`
- **Auth**: Bearer Token Required
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260123-001",
    "total_amount": 450.0,
    "payment_method": "cash_on_delivery",
    "payment_status": "pending",
    "order_status": "pending",
    "items": [
      {
        "listing": {
          "id": "uuid",
          "title": "Fresh Broccoli",
          "price": 95.0,
          "images": [...]
        },
        "quantity": 2,
        "unit_price": 95.0,
        "subtotal": 190.0
      }
    ],
    "created_at": "2026-01-23T...",
    "updated_at": "2026-01-23T..."
  }
}
```

## Payments Endpoints (Optional - Juice Integration)

### 13. Initiate Payment
- **POST** `/payments/initiate`
- **Auth**: Bearer Token Required
- **Body**:
```json
{
  "orderId": "uuid",
  "amount": 450.0,
  "currency": "MUR",
  "customerEmail": "john@example.com",
  "customerPhone": "+23054321234",
  "returnUrl": "freshroots://payment/success",
  "cancelUrl": "freshroots://payment/cancel"
}
```
- **Response** (200):
```json
{
  "success": true,
  "transaction_id": "TXN-123456",
  "paymentUrl": "https://juice.mu/pay/...", 
  "message": "Redirect user to paymentUrl"
}
```
**Note**: In dev mode without MIPS credentials, returns simulated response.

### 14. Get Payment Status
- **GET** `/payments/status/:transactionId`
- **Auth**: Bearer Token Required
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN-123456",
    "status": "completed" | "pending" | "failed",
    "amount": 450.0,
    "currency": "MUR"
  }
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400,
    "details": {}
  }
}
```

**Common Status Codes**:
- `200` OK
- `201` Created
- `400` Bad Request (validation error)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (insufficient permissions)
- `404` Not Found
- `409` Conflict (e.g., email already exists)
- `500` Internal Server Error

## Authentication Flow

1. User registers or logs in → receives `accessToken` + `refreshToken`
2. Store both tokens securely (Keychain/Keystore)
3. Include `Authorization: Bearer <accessToken>` in all protected requests
4. Access token expires in **15 minutes**
5. When receiving **401**, call `/auth/refresh` with `refreshToken`
6. Update stored tokens and retry original request
7. If refresh fails (401), redirect to login

## Enums Reference

### OrderStatus
- `pending` - Order created, awaiting approval
- `payment_pending` - Payment not yet received
- `payment_confirmed` - Payment received
- `approved` - Admin approved order
- `rejected` - Admin rejected order
- `preparing` - Order being prepared
- `out_for_delivery` - Out for delivery
- `delivered` - Successfully delivered
- `cancelled` - Order cancelled

### PaymentMethod
- `juice` - Juice payment (MCB)
- `myt_money` - My.T Money
- `card` - Card payment
- `cash_on_delivery` - Cash on delivery

### PaymentStatus
- `pending` - Payment not yet received
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### InterestStatus
- `pending` - Interest submitted, awaiting contact
- `contacted` - Admin has contacted customer
- `closed` - Interest closed

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Auth endpoints**: 5 requests per minute per IP
- **Payment endpoints**: 10 requests per minute per user

## CORS

- Enabled for all origins in development
- Production: Configure allowed origins

## Testing Endpoints

### Health Check
- **GET** `/health`
- **Auth**: None
- **Response**: 
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-26T...",
    "service": "Fresh Roots API",
    "version": "1.0.0"
  }
}
```

### Test Email (Dev Only)
- **GET** `/test-email?to=your@email.com`
- **Auth**: None
- **Response**: Confirmation message if SMTP configured

## Admin Endpoints (For Future Admin Panel)

These are **NOT** needed for the customer mobile app but documented for completeness:

- `POST /listings` - Create listing (admin only)
- `PATCH /listings/:id` - Update listing (admin only)
- `DELETE /listings/:id` - Deactivate listing (admin only)
- `GET /listings/admin/my-listings` - Get admin's listings (admin only)
- `GET /orders/admin/all` - Get all orders (admin only)
- `PATCH /orders/:id/status` - Update order status (admin only)
- `GET /interest/admin/all` - Get all interests (admin only)
- `PATCH /interest/:id` - Update interest status (admin only)
- `GET /admin/dashboard/overview` - Dashboard metrics
- `GET /admin/dashboard/stats` - Statistics
- `GET /admin/analytics/sales` - Sales analytics
- `GET /admin/analytics/products` - Product analytics
- `GET /admin/users` - List users
- `GET /admin/reports/revenue` - Revenue report
- `GET /admin/reports/inventory` - Inventory report

## Notes for Frontend Implementation

1. **Image URLs**: All image URLs in responses are absolute URLs, ready to use in `<Image source={{ uri: ... }}>`
2. **Pagination**: Always respect `pagination` object in list responses
3. **Search debouncing**: Debounce search queries (300-500ms) to avoid excessive API calls
4. **Token refresh**: Implement automatic token refresh on 401 with single retry
5. **Error handling**: Display user-friendly messages from `error.message`
6. **Loading states**: Show loading indicators for all async operations
7. **Offline mode**: Cache listings data and show stale data with banner when offline
8. **PostHog events**: Track key user actions (view product, add to cart, order placed, etc.)
