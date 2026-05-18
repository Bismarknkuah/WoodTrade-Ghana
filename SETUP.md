# WoodTrade Ghana — Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Backend Setup
```bash
cd WoodTrade-Ghana/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

### 2. Frontend Setup
```bash
cd WoodTrade-Ghana/frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if your backend is not on localhost:5000
npm run dev
```

### 3. Seed the Database (optional but recommended)
```bash
cd WoodTrade-Ghana/backend
npm run seed
```

### 4. Open in browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

---

## Test Accounts (after seeding)

| Role         | Email                      | Password      |
|--------------|----------------------------|---------------|
| Admin        | admin@woodtrade.gh         | Admin@1234    |
| Seller       | kofi@ashantiforest.gh      | Seller@1234   |
| Manufacturer | ama@kumasaw.gh             | Seller@1234   |
| Buyer (USA)  | buyer@timberusa.com        | Buyer@1234    |
| Buyer (DE)   | hans@eurowood.de           | Buyer@1234    |

---

## Pages

| URL                          | Description                          |
|------------------------------|--------------------------------------|
| /                            | Homepage with product showcase       |
| /catalog                     | Wood & carpentry product catalog     |
| /catalog?tab=carpentry       | Carpentry marketplace                |
| /carpentry                   | Carpentry landing page               |
| /carpentry/request           | Post a custom carpentry request      |
| /catalog/[id]                | Product detail with traceability     |
| /sell                        | Become a seller page                 |
| /dashboard                   | Seller dashboard                     |
| /admin                       | Admin panel                          |
| /auth/login                  | Login                                |
| /auth/register               | Registration (4 steps)               |
| /passport/[id]               | Digital product passport (QR scan)   |
| /track/[orderNumber]         | Order tracking page                  |

---

## Key Features
- 🪵 Raw wood catalog (timber, bamboo, plywood, engineered wood)
- 🪑 Carpentry marketplace with custom order requests
- 📋 Full export compliance (FLEGT, Lacey Act, EUDR, FSC)
- 🛡️ Admin dashboard with fraud detection & security alerts
- 💰 Dual currency (GHS ₵ for local, USD $ for international)
- 📸 Product photo upload with drag & drop
- 👤 Profile photo upload on registration
- 📍 All 16 Ghana regions + 255 districts in dropdowns
- 🔒 JWT auth, rate limiting, CORS, helmet, NoSQL injection protection
- 📧 Email notifications (license expiry, order updates)
- ⏰ Daily cron job for license expiry checks

---

## Technology Stack
| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 15, React 19, TypeScript, Tailwind CSS  |
| Backend   | Node.js, Express, TypeScript                    |
| Database  | MongoDB + Mongoose                              |
| Auth      | JWT (jsonwebtoken)                              |
| Files     | Cloudinary (images & documents)                 |
| Email     | Nodemailer                                      |
| PDF       | PDFKit (Lacey Act, EUDR, invoices)             |
| Security  | Helmet, express-rate-limit, express-mongo-sanitize |
