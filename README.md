# FundForge — React Frontend

A clean, production-grade React frontend for the FundForge crowdfunding platform.

## Tech Stack

- **React 18** with functional components & hooks
- **React Router v6** for client-side routing
- **Vite** for fast dev server and build
- **CSS custom properties** (no UI library, fully custom design system)
- **Razorpay Checkout.js** for payment integration

---

## Project Structure

```
src/
├── pages/
│   ├── HomePage.jsx          # Landing page with hero, stats, how-it-works
│   ├── AuthPage.jsx          # Login + Register (tabbed)
│   ├── DashboardPage.jsx     # Campaign listing with search/filter/sort/pagination
│   ├── CampaignDetailPage.jsx# Campaign detail + donate modal + donations list
│   ├── CreateCampaignPage.jsx# Create campaign form
│   └── AdminPage.jsx         # Admin approve/reject/delete panel
│
├── components/
│   ├── Navbar.jsx            # Sticky navbar with auth state
│   ├── CampaignCard.jsx      # Campaign grid card
│   └── ProtectedRoute.jsx    # Auth + role guard
│
├── context/
│   └── AuthContext.jsx       # JWT auth state (localStorage)
│
├── services/
│   └── api.js                # All API calls to Spring Boot backend
│
├── hooks/
│   └── useToast.js           # Toast notification hook
│
└── styles/
    ├── globals.css           # Design tokens, buttons, cards, modals
    ├── home.css
    ├── auth.css
    └── dashboard.css
```

---

## Getting Started

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`  
Backend expected at `http://localhost:8080`

The Vite dev server proxies `/api/*` requests to the backend automatically.

---

## Pages & Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Homepage | No |
| `/auth` | Login / Register | No |
| `/campaigns` | Campaign Listing | Yes |
| `/campaigns/:id` | Campaign Detail + Donate | Yes |
| `/create-campaign` | Create Campaign | Yes |
| `/admin` | Admin Panel | Yes (ADMIN role) |

---

## Key Features

### Auth Flow
- JWT stored in `localStorage`
- Auto-redirect if token missing
- Role-based route protection (`ADMIN` only for `/admin`)

### Campaign Listing
- Search by keyword
- Filter by category
- Sort by target amount (asc/desc)
- Pagination

### Donation + Payment
- Donate button on approved campaigns
- Quick-select amounts (₹100, ₹500, ₹1000, ₹5000)
- Razorpay Checkout integration
- Webhook-based verification handled by backend

### Admin Panel
- View campaigns by status (PENDING / APPROVED / REJECTED)
- Approve / Reject / Delete campaigns
- Live status updates without page reload

---

## API Endpoints Used

All calls go to `http://localhost:8080/api/v1/`

```
POST  /auth/login
POST  /auth/register
GET   /campaigns?keyword=&category=&sortDir=&page=&size=
GET   /campaigns/:id
POST  /campaigns
PUT   /campaigns/:id
DELETE /campaigns/:id
PUT   /admin/campaigns/:id/approve
PUT   /admin/campaigns/:id/reject
POST  /campaigns/:id/donate
GET   /campaigns/:id/donations
POST  /payments/order/:donationId
POST  /payments/verify
```

---

## Environment

No `.env` file needed for dev. The Vite proxy handles CORS.  
For production, update `BASE_URL` in `src/services/api.js`.
