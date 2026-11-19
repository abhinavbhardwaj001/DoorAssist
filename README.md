# DoorAssist

DoorAssist is a full-stack local service marketplace built on the MERN stack (`React 19`, `Tailwind CSS v4`, `Node.js`, `Express 5`, and `MongoDB`). It connects customers with verified local service providers for everyday home maintenance, repairs, and professional assistance through role-based access control (`customer`, `provider`, `admin`), OTP-verified authentication, booking lifecycle management, simulated payments, verified reviews, and Google Gemini AI integrations.

**Live Frontend:** [door-assist.vercel.app](https://door-assist.vercel.app/)  
**Live Backend API:** [doorassist.onrender.com](https://doorassist.onrender.com)

---

## Features

### Authentication & Security
- **JWT Dual-Token Auth:** Access and refresh token architecture (`JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`) with HTTP-only cookie parsing and in-memory token storage (`tokenStore.js`).
- **Email & OTP Verification:** Automated transactional emails and OTP verification powered by **Nodemailer** and **Brevo SMTP**.
- **Request Validation & Rate Limiting:** Schema validation with **Zod v4**, password hashing via **bcrypt**, and API protection with **express-rate-limit**.

### Customer Experience
- **Service & Category Discovery:** Browse categories, search services by keyword, and filter listings by city and category.
- **Provider Profiles & Ratings:** View verified provider details, experience, service catalogs, and customer review breakdowns.
- **Booking & Simulated Payments:** Schedule services (`fixed`, `starting_from`, or `on_request`), track booking status updates, and test checkout flows using the built-in simulated payment module.
- **Verified Reviews:** Submit 1–5 star ratings and written reviews after service completion.
- **Provider Onboarding:** Apply to become a service provider and monitor application review status from the customer dashboard.
- **Smart Service Assistant:** Embedded AI assistant on public discovery pages powered by `@google/genai` (Gemini) to help users find relevant services and providers.

### Service Provider Portal
- **Service Management:** Create, update, and manage service offerings with custom pricing types, duration estimates, and **Cloudinary**-backed image uploads (`Multer` + `Cloudinary`).
- **AI Service Copy Generator:** Auto-generate clear, professional service descriptions from a service title, category, and rough notes using Gemini AI.
- **Booking & Availability Controls:** Manage customer bookings, configure availability schedules, and maintain business profile details.
- **Reputation Dashboard:** Track overall average rating, star distribution bars, and filterable customer feedback.

### Administrator Portal
- **Platform Management:** Manage registered users, review and approve/reject provider applications, and administer service categories.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, React Router v7, Tailwind CSS v4 (`@tailwindcss/vite`), Axios, Lucide React, Vite 8, Oxlint |
| **Backend** | Node.js (ES Modules), Express v5, Mongoose v9, Zod v4, Morgan, Cookie-Parser, CORS |
| **Database** | MongoDB |
| **AI Integration** | Google GenAI SDK (`@google/genai` / Gemini API) |
| **Media & Email** | Cloudinary v2, Multer v2, Nodemailer + Brevo SMTP |
| **Deployment** | Vercel (Client with SPA routing via `vercel.json`), Render (Server) |

---

## Architecture & Design System

- **Modular Backend Structure:** Organized into feature-based modules (`ai`, `auth`, `bookings`, `categories`, `payments`, `providers`, `reviews`, `services`, `users`) with centralized config, middleware, and utility helpers.
- **Lightweight Frontend State:** Uses React Context (`AuthContext`, `NotificationContext`) and custom hooks (`useAuth`) without external state libraries.
- **UI Design System:** High-contrast, flat surface architecture built around **Prussian Blue (`#0a1128`)**, **Deep Navy (`#001f54`)**, **Yale Blue (`#034078`)**, **Cerulean (`#1282a2`)**, and **Alabaster (`#fefcfb`)**.

---

## Project Structure

```text
DoorAssist/
├── client/                         # React + Vite + Tailwind CSS v4 frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icon.svg
│   ├── src/
│   │   ├── components/             # Feature UI & layout components
│   │   │   ├── admin/
│   │   │   ├── ai/                 # SmartServiceAssistant
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   ├── categories/
│   │   │   ├── common/
│   │   │   ├── layout/             # Navbar, Footer, PublicLayout, Sidebar
│   │   │   ├── payments/           # BookingPayment
│   │   │   ├── providers/          # ProviderHeader, ProviderRating, ProviderServiceForm
│   │   │   ├── reviews/            # ReviewCard, ReviewForm, ReviewList
│   │   │   └── services/           # ServiceCard, ServiceFilters, ServiceGrid, ServiceImage
│   │   ├── context/                # AuthContext.jsx, NotificationContext.jsx
│   │   ├── hooks/                  # useAuth.js
│   │   ├── pages/                  # admin, auth, customer, provider, public views
│   │   ├── routes/                 # AppRoutes.jsx
│   │   ├── services/               # Axios API modules & tokenStore.js
│   │   ├── utils/                  # authRedirect.js, formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── server/                         # Node.js + Express v5 REST API
    ├── src/
    │   ├── config/                 # cloudinary.js, db.js, env.js
    │   ├── middlewares/            # error.middleware.js, rateLimit.middleware.js, upload.middleware.js
    │   ├── modules/                # ai, auth, bookings, categories, payments, providers, reviews, services, users
    │   ├── utils/                  # email.js, otp.js, token.js, upload-image.js, validation.js
    │   └── app.js
    ├── package.json
    └── server.js
```

---

## Getting Started

### Prerequisites
- **Node.js** (v20+ recommended for Vite 8 & Express 5)
- **MongoDB** connection string (MongoDB Atlas or local instance)
- **Cloudinary**, **Brevo SMTP**, and **Google Gemini** API credentials

### 1. Clone the Repository
```bash
git clone [https://github.com/AbhinavBhardwaj-dev/DoorAssist.git](https://github.com/AbhinavBhardwaj-dev/DoorAssist.git)
cd DoorAssist
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

BREVO_SMTP_USER=your_brevo_smtp_user
BREVO_SMTP_KEY=your_brevo_smtp_key
BREVO_SENDER_EMAIL=your_verified_sender_email

GEMINI_API_KEY=your_google_gemini_api_key
```

Create a `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Verify the exact `import.meta.env.VITE_*` key name in `client/src/services/api.js`.)*

### 4. Run Locally
```bash
# Start backend development server (from /server)
npm run dev

# Start frontend development server (from /client)
npm run dev
```

### Available Scripts
- **Client (`/client`):** `npm run dev` (Vite dev server), `npm run build` (production bundle), `npm run lint` (Oxlint), `npm run preview` (preview build)
- **Server (`/server`):** `npm run dev` (Nodemon), `npm start` (Node production server)

---

## Author

Designed, Developed & Secured by **Abhinav Bhardwaj**