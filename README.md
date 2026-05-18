# 🌲 WoodTrade Ghana

**Ghana's Premium Wood Marketplace & Export Platform**

A modern, compliant digital marketplace connecting Ghanaian wood suppliers with local and international buyers — with full traceability, Lacey Act compliance, FLEGT support, and automated export documentation.

---

## 🏗️ Project Structure

```
WoodTrade-Ghana/
├── backend/                  # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── server.ts         # Entry point
│   │   ├── config/
│   │   │   └── database.ts   # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts       # Users, roles, licenses
│   │   │   ├── Product.ts    # Products with traceability
│   │   │   └── Order.ts      # Orders with export compliance
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   ├── orderController.ts
│   │   │   └── exportController.ts  # Lacey Act PDFs, invoices
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── export.ts
│   │   │   ├── licenses.ts
│   │   │   └── admin.ts
│   │   └── middleware/
│   │       └── auth.ts       # JWT + RBAC
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                 # Next.js 15 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout with Navbar + Footer
│   │   │   ├── page.tsx      # Homepage (matches design)
│   │   │   ├── catalog/      # Product catalog with filters
│   │   │   ├── dashboard/    # Seller dashboard
│   │   │   ├── sell/         # Become a seller page
│   │   │   └── auth/         # Login & Register (3-step)
│   │   ├── components/
│   │   │   └── ui/
│   │   │       └── Navbar.tsx
│   │   └── lib/
│   │       └── api.ts        # Full API client
│   ├── tailwind.config.ts
│   └── next.config.ts
│
└── shared/
    └── types/
        └── index.ts          # Shared TypeScript types
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- npm / yarn

### 1. Clone and install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local
```

### 2. Run development servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

### 3. Open in browser
- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api/health

---

## 🔑 Key Features

| Feature | Status | Notes |
|---|---|---|
| User registration (Buyer/Seller/Manufacturer/Reseller/Admin) | ✅ | Role-based |
| JWT Authentication | ✅ | 7-day tokens |
| License upload & admin review | ✅ | TIDD, FC, GEPC, FLEGT |
| Product listing with traceability | ✅ | Blockchain-style log |
| QR Code Product Passport | ✅ | Unique ID per product |
| Advanced catalog filtering | ✅ | Species, cert, price, region |
| Order management | ✅ | Full lifecycle tracking |
| Lacey Act PDF generation | ✅ | Auto APHIS PPQ 505 |
| Commercial Invoice PDF | ✅ | Auto-generated |
| Export compliance checklist | ✅ | USA, EU, Ghana |
| Seller Dashboard | ✅ | Analytics, orders, licenses |
| License expiry alerts | ✅ | 60-day warnings |
| Sustainability scoring | ✅ | 0-100 score |
| Multi-currency (GHS/USD/EUR) | ✅ | |
| Mobile-responsive | ✅ | Tailwind CSS |

---

## 🛡️ Compliance Coverage

### Ghana
- **TIDD** — Timber Industry Development Division
- **Forestry Commission** permits
- **GEPC** export license
- **Ghana Revenue Authority** tax clearance

### International
- **🇺🇸 Lacey Act** — Auto-generates APHIS PPQ 505 declarations
- **🇪🇺 EUDR** — EU Deforestation Regulation compliance checklist
- **FLEGT** — Forest Law Enforcement, Governance and Trade

---

## 🗺️ API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/change-password
```

### Products
```
GET    /api/products                    (public catalog)
GET    /api/products/:id
GET    /api/products/passport/:id       (QR scan)
GET    /api/products/seller/mine
POST   /api/products                    (seller only)
PUT    /api/products/:id
POST   /api/products/:id/trace          (add traceability event)
```

### Orders
```
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/seller
GET    /api/orders/:id
PATCH  /api/orders/:id/status
```

### Export Compliance
```
GET    /api/export/lacey-act/:orderId           (PDF download)
GET    /api/export/commercial-invoice/:orderId  (PDF download)
GET    /api/export/compliance-status/:orderId
PATCH  /api/export/compliance/:orderId/checklist
```

### Licenses
```
POST   /api/licenses
GET    /api/licenses/mine
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/pending-licenses
PATCH  /api/admin/users/:id/licenses/:licenseId
PATCH  /api/admin/users/:id/suspend
PATCH  /api/admin/products/:id/approve
```

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (RS256) + Role-based access |
| PDFs | PDFKit |
| File Storage | Cloudinary |
| Payments | Stripe, PayPal, Mobile Money |
| Hosting | Vercel (FE) + Render/Railway (BE) |

---

## 🌿 Sustainability

WoodTrade Ghana promotes FSC/PEFC-aligned sourcing and rewards suppliers with high sustainability scores. Every product includes a digital passport with its harvest origin, chain of custody, and certifications.

---

*Built for Ghana's wood trade. Compliant with international law. Transparent from forest to final destination.*
