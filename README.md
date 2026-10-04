# Charms Café — Full-Stack Order Management System

A complete React + Express + SQLite application with real-time order tracking, admin dashboard, and secure authentication.

## 🚀 Features

- **Customer Ordering**: Browse menu, customize items, place orders with payment simulation
- **Real-Time Tracking**: Live order status updates via Server-Sent Events (SSE)
- **Admin Dashboard**: Kitchen management interface with live order pipeline (Pending → Preparing → Ready → Completed)
- **Secure Authentication**: JWT-based admin auth with HttpOnly cookies, rate limiting, and RBAC
- **Payment Handling**: COD (amber badge) vs. Online/Card/UPI (green badge) differentiation
- **IDOR Protection**: Customer order lookup via UUID tracking tokens, never sequential IDs
- **Input Validation**: Zod schemas on all API endpoints
- **Security Hardening**: Helmet CSP, CORS, bcrypt (cost 12), XSS prevention

## 📁 Architecture

```
├── src/                       # React frontend (Vite + TypeScript + Tailwind v4)
│   ├── components/
│   │   ├── admin/            # Admin-specific components (OrderCard, PaymentBadge)
│   │   └── layout/           # AdminRoute guard
│   ├── hooks/                # useSSE, useAdminSSE
│   ├── pages/
│   │   ├── admin/            # AdminLoginPage, AdminDashboard
│   │   ├── TrackOrderPage.tsx
│   │   └── CheckoutPage.tsx  # Modified to POST to API
│   ├── store/                # Zustand: cartStore, orderStore, adminStore
│   └── types/                # Extended with AdminOrder, KitchenOrderStatus, TrackingOrder
│
└── server/                    # Express backend (Node.js + TypeScript + Prisma + SQLite)
    ├── src/
    │   ├── middleware/       # JWT verification, rate limiting
    │   ├── routes/           # auth, orders, admin, sse
    │   ├── schemas/          # Zod validation schemas
    │   ├── seeds/            # Admin user seeding
    │   ├── sseManager.ts     # SSE connection manager
    │   ├── env.ts            # Environment validation
    │   └── index.ts          # Express app setup
    └── prisma/
        └── schema.prisma     # Order, OrderItem, AdminUser models
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

The `.env` file is already created in `server/.env` with a generated JWT secret and default admin password.

**Default Admin Credentials:**
- Email: `admin@charmscafe.in`
- Password: `CharmsAdmin@2024`

**⚠️ For production**: Change `ADMIN_SEED_PASSWORD` in `server/.env` before running the seed script.

### 3. Initialize Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Create SQLite database and tables
npx prisma db push

# Seed the admin user
npm run seed:admin

cd ..
```

### 4. Run Development Servers

**Terminal 1 (Backend):**
```bash
npm run server:dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 (Frontend):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🧪 Verification Tests

### Build & Lint
```bash
npm run build    # ✓ TypeScript compilation
npm run lint     # ✓ oxlint checks (warnings only, no errors)
```

### Security Tests

1. **Unauthorized Access**
   - Visit `http://localhost:5173/admin/dashboard` without login → Redirected to `/admin/login`
   - Call `GET /api/admin/orders` without cookie → `401 Unauthorized`

2. **Rate Limiting**
   - Try logging in with wrong password 6 times → 6th attempt returns `429 Too Many Requests` with `Retry-After` header

3. **IDOR Prevention**
   - Order tracking uses UUID `trackingToken`, not sequential `displayId`
   - Try `GET /api/orders/<random-uuid>` → `404 Order not found`

### Order Flow Test

1. **Customer places order:**
   - Visit `/menu`, add items, go to `/checkout`
   - Fill customer details, select payment method
   - Click "Pay" → Order created, receives tracking URL

2. **Real-time tracking:**
   - Navigate to `/track/CH-XXXX?token=<uuid>`
   - Progress bar shows: Received → Preparing → Ready → Collected

3. **Admin marks ready:**
   - Login at `/admin/login`
   - Dashboard shows order in "Pending" column
   - Click "Accept Order" → moves to "Preparing"
   - Click "Mark Ready" → moves to "Ready"
   - **Customer page automatically updates** (SSE push)
   - Customer sees animated "🎉 Order Ready!" modal

4. **Payment Badge:**
   - Cash orders: Amber badge "🟡 COD · Collect ₹XXX"
   - Online orders: Green badge "🟢 PAID · UPI · #txn123"

## 🔐 Security Features

- **Authentication**: JWT in HttpOnly, SameSite=Strict, Secure cookies (8h expiry)
- **Password Hashing**: bcrypt with cost factor 12
- **Rate Limiting**: 5 login attempts per 15 minutes per IP (in-memory)
- **Input Validation**: Zod schemas on all endpoints (max lengths, regex patterns)
- **IDOR Protection**: UUIDs for customer-facing lookups, not sequential IDs
- **CSP**: Helmet with restrictive Content-Security-Policy
- **CORS**: Whitelisted frontend origin with credentials support
- **Secrets**: `.env` in `.gitignore`, never committed

## 📊 Database Schema

**Order** (UUID primary key)
- `id`, `displayId` (CH-XXXX), `trackingToken` (UUID)
- Customer details (name, email, phone, notes)
- Fulfillment (type, tableNumber, pickupTime)
- Financials (subtotal, tax, serviceCharge, tip, total in paise)
- Payment (method, status, transactionId)
- Kitchen status (pending/preparing/ready/completed/cancelled)

**OrderItem** (linked to Order)
- `menuItemId`, `menuItemName`, `quantity`, `unitPrice`, `lineTotal`
- `selectedAddons` (JSON string)

**AdminUser**
- `email` (unique), `passwordHash`, `role` (admin/staff)

## 🎨 Design Tokens Preserved

- **Colors**: Espresso `#2D1E18`, Cream `#FDFBF7`, Terracotta `#C86D51`, Sage `#7A8B7B`
- **Typography**: Playfair Display (serif headings), Inter (body text)
- **Animations**: Framer Motion with spring physics (stiffness 300–380, damping 30–32)

## 🚀 Production Deployment

1. **Environment Variables**: Update `server/.env` with production values:
   - Strong `JWT_SECRET` (64+ chars)
   - Strong `ADMIN_SEED_PASSWORD`
   - Set `NODE_ENV=production`
   - Update `FRONTEND_ORIGIN` to production URL

2. **Database**: SQLite is fine for small-scale. For production, consider migrating to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **HTTPS**: Enable `secure: true` in cookie options (auto-enabled when `NODE_ENV=production`)

4. **Rate Limiting**: For multi-instance deployments, replace in-memory rate limiter with Redis

5. **Payments**: Replace mock Razorpay flow in `CheckoutPage.tsx` with real Razorpay SDK integration

## 📝 License

Private project for Charms Café.

---

**Built with:**
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + Framer Motion
- Express + Prisma + SQLite
- JWT + bcrypt + Zod + Helmet
- Server-Sent Events (SSE) for real-time updates
