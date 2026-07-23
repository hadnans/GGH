# GGH — Gomla Go Home | جملة لحد البيت

Number 1 Source for Your Home Supply with Trusted Reliability and Best Prices.

المصدر رقم 1 لمستلزمات منزلك بأفضل الأسعار وموثوقية لا مثيل لها.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/hadnans/GGH.git
cd GGH

# 2. One-command setup (installs deps, generates Prisma client, creates DB)
bun run setup

# 3. Copy environment config (defaults work for local dev)
cp .env.example .env

# 4. Start dev server
bun run dev
```

Open http://localhost:3000 — the database seeds automatically on first visit with sample products, categories, deals, and a default admin account.

## Default Admin Account

| Field    | Value          |
|----------|----------------|
| Email    | admin@ggh.com  |
| Username | admin          |
| Password | admin          |
| Role     | super_admin    |

Click the admin icon in the header to access the admin dashboard.

## Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Framework      | Next.js 16 (App Router)                        |
| Language       | TypeScript 5 (strict)                          |
| Styling        | Tailwind CSS 4 + shadcn/ui                     |
| Database       | Prisma ORM + SQLite (portable to PostgreSQL)   |
| State          | Zustand (client) + TanStack Query (server)     |
| Validation     | Zod                                             |
| i18n           | Built-in bilingual EN/AR with RTL support       |
| Money          | Integer piastres (EGP 14.50 → 1450)            |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Single-page app entry point
│   ├── layout.tsx          # Root layout (fonts, providers)
│   └── api/                # API routes (BFF pattern)
│       ├── admin/          # Admin CRUD, auth, RBAC, analytics
│       ├── auth/           # Customer OTP auth
│       ├── cart/           # Cart operations
│       ├── categories/     # Category CRUD
│       ├── checkout/       # Order placement
│       ├── delivery/       # Delivery tracking, dispatch, warehouse
│       ├── deals/          # Deals API
│       ├── erp/            # ERPNext integration (optional)
│       ├── health/         # Health check
│       ├── location/       # Geocoding, routing, geofences
│       ├── orders/         # Order CRUD
│       ├── products/       # Product CRUD
│       ├── search/         # Search API
│       └── seed/           # Auto-seed on first load
│       └── admin/seed-admin/ # Admin roles/permissions seed
├── features/               # Feature-based components
│   ├── admin/              # Admin dashboard, login, RBAC manager
│   ├── auth/               # Customer login, OTP
│   ├── cart/               # Cart slide-out
│   ├── checkout/           # Checkout flow
│   ├── delivery/           # Tracking, dispatcher, warehouse
│   ├── order/              # Order list, detail, timeline
│   ├── product/            # Product cards, grids, deals
│   ├── search/             # Search overlay
│   └── shop/               # Shop view (main storefront)
├── components/
│   ├── ggh/                # App-specific UI (Header, Footer, etc.)
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Business logic & infrastructure
│   ├── cache.ts            # MemoryCache
│   ├── db.ts               # Prisma client singleton
│   ├── errors.ts           # AppError hierarchy + apiHandler
│   ├── env.ts              # Zod-validated env config
│   ├── logger.ts           # Structured logger
│   ├── rate-limit.ts       # Rate limiter
│   ├── validation.ts       # Zod schemas
│   ├── delivery/           # 13-step state machine, dispatcher, ETA
│   ├── erp/                # ERPNext domain modules, sync, webhooks
│   ├── fulfillment/        # Picking, packing, shipment, returns
│   ├── ggh/                # Auth, i18n, data
│   ├── location/           # GPS tracking, geocoding, geofencing
│   ├── loyalty/            # Loyalty tiers & service
│   ├── payment/            # Paymob, Fawry, Stripe, COD providers
│   ├── sms/                # OTP via Vonage/Twilio/MessageBird
│   └ analytics/            # Revenue, product, customer analytics
├── stores/                 # Zustand stores
│   ├── auth-store.ts       # Customer auth state
│   ├── admin-session-store.ts # Admin session state
│   ├── cart-store.ts       # Cart state
│   └── lang-store.ts       # Language/RTL toggle
├── services/               # API client wrappers
├── types/                  # Shared TypeScript types
├── utils/                  # Money formatting, thumbnail generation
└── hooks/                  # Custom React hooks

prisma/
├── schema.prisma           # Full database schema (30+ models)
```

## Environment Variables

See `.env.example` for all available configuration. Key variables:

| Variable                    | Default                | Description                          |
|----------------------------|------------------------|--------------------------------------|
| DATABASE_URL               | file:./db/custom.db   | Prisma database connection           |
| NEXT_PUBLIC_APP_URL        | http://localhost:3000  | App URL for client-side references   |
| NODE_ENV                   | development           | Environment mode                     |
| MAP_PROVIDER               | osm                   | Map provider (osm/free, google, etc) |
| ADMIN_SESSION_DURATION_HOURS | 24                  | Admin session expiry                 |
| ADMIN_SESSION_COOKIE       | ggh-admin-session     | Cookie name for admin auth           |
| ADMIN_DEFAULT_ROLE         | admin                 | Default role for new admins          |

Optional integrations (commented out in .env.example):
- **ERPNext**: ERP_NEXT_URL, ERP_NEXT_API_KEY, ERP_NEXT_API_SECRET
- **Map APIs**: GOOGLE_MAPS_API_KEY, MAPBOX_API_KEY, HERE_MAPS_API_KEY

## Key Architectural Decisions

1. **Single Route**: Everything runs on `/` using client-side view routing — no Next.js page navigation
2. **BFF Pattern**: Frontend never calls backend directly; all data flows through `/api/` routes
3. **Money as Integers**: All prices stored as integer piastres (EGP 14.50 = 1450) — no float precision issues
4. **Bilingual by Default**: Every entity has `nameEn` + `nameAr`; RTL layout toggles instantly
5. **Auto-Seeding**: First visit triggers `/api/seed` + `/api/admin/seed-admin` — no manual DB setup
6. **Session Auth**: Admin uses httpOnly cookie sessions (not JWT); Customer uses OTP + sessions
7. **RBAC**: Full role-permission system with 5 default roles and 48 granular permissions

## Development Commands

```bash
bun run dev          # Start development server (port 3000)
bun run lint         # Run ESLint checks
bun run setup        # Full setup (install + DB + seed)
bun run db:push      # Push Prisma schema to database
bun run db:generate  # Generate Prisma client
bun run db:reset     # Reset database (re-seed on next visit)
```

## Admin Dashboard Features

- **Products**: Create, edit, manage products with categories and pricing
- **Categories**: Full category CRUD with icons and colors
- **Orders**: View, edit status, track, complete orders
- **Customers**: Customer management with wholesale status
- **Deals**: Time-limited promotional deals with discount tracking
- **Inventory**: Stock levels, adjustments, low-stock alerts
- **Price Rules**: Dynamic pricing rules for wholesale/retail
- **Analytics**: Revenue, product performance, customer stats
- **Delivery**: Dispatcher dashboard, driver assignment, warehouse ops
- **RBAC**: Role and permission management, admin user CRUD
- **Loyalty**: Loyalty programs and transaction history
- **Settings**: Platform configuration, SMS provider setup

## Customer Features

- **OTP Authentication**: Phone-based login (development mode auto-verifies)
- **Shop View**: Category browsing, product search, featured products
- **Cart**: Add/remove items, quantity management
- **Checkout**: Address selection, delivery zone matching, order placement
- **Order Tracking**: Real-time delivery status with timeline
- **Account**: Profile management, order history

## License

Private — All rights reserved.
