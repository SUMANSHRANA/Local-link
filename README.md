# VeeServe — MERN Stack

A full-stack home services platform (like UrbanClap) built with **MongoDB, Express, React, Node.js**.

## Features

**Customer:**
- Register / Login / Forgot Password
- Browse services by category or search
- Add to cart, select date & time slot per service
- Auto-assigns an available service agent on checkout
- View / cancel orders
- Submit feedback & ratings

**Admin Panel:**
- Dashboard with live stats (orders, revenue, customers, cities)
- Full CRUD for Services (with image upload)
- Manage Service Agents (add/delete with image)
- Manage Cities
- View all bookings with status filters

**Service Agent Portal:**
- Login with username/password
- View assigned bookings (with customer details)
- Update booking status: Yet To Serve → Serving → Served

---

## Project Structure

```
veeserve/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express REST API routes
│   ├── middleware/       # JWT auth middleware
│   ├── uploads/         # Uploaded images (auto-created)
│   ├── server.js        # Entry point
│   ├── seed.js          # DB seeder
│   └── .env.example     # Environment template
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Navbar, Footer
        ├── context/     # AuthContext (JWT)
        ├── pages/
        │   ├── customer/
        │   ├── admin/
        │   └── serviceAgent/
        └── utils/       # Axios API instance
```

---

## Setup & Run

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
node seed.js        # Create admin + sample data
npm run dev         # Starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm start           # Starts on http://localhost:3000
```

---

## Default Credentials (after running seed.js)

| Role    | Login                          | Password   |
|---------|--------------------------------|------------|
| Admin   | admin@veeserve.com             | admin123   |
| Agent   | Set via Admin → Service Agents | (you set)  |
| Customer| Register via /register          | (you set)  |

---

## API Endpoints

| Method | Route                          | Auth       | Description                |
|--------|--------------------------------|------------|----------------------------|
| POST   | /api/auth/register             | Public     | Customer register           |
| POST   | /api/auth/login                | Public     | Customer login              |
| POST   | /api/auth/admin/login          | Public     | Admin login                 |
| POST   | /api/auth/agent/login          | Public     | Agent login                 |
| GET    | /api/services                  | Public     | List all services           |
| GET    | /api/categories                | Public     | List active categories      |
| GET    | /api/cart                      | Customer   | Get cart                    |
| POST   | /api/cart/add                  | Customer   | Add to cart                 |
| POST   | /api/bookings/checkout         | Customer   | Checkout (auto-assign agent)|
| GET    | /api/bookings/my-orders        | Customer   | Customer's bookings         |
| GET    | /api/bookings/agent            | Agent      | Agent's assigned bookings   |
| PUT    | /api/bookings/:id/status       | Agent      | Update booking status       |
| GET    | /api/admin/dashboard           | Admin      | Dashboard stats             |
| POST   | /api/services                  | Admin      | Add service                 |
| POST   | /api/service-agents            | Admin      | Add service agent           |

---

## Tech Stack

- **MongoDB** — Database
- **Express.js** — REST API
- **React.js** — Frontend (React Router v6, Context API)
- **Node.js** — Runtime
- **JWT** — Authentication
- **Multer** — Image uploads
- **Nodemailer** — Password reset emails
- **React Toastify** — Notifications
