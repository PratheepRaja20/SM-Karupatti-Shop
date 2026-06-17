# SM Original Karupatti — Full-Stack E-Commerce Platform

> World's Best Karupatti from the Land of Tradition

A premium, fully-animated e-commerce website for SM Original Karupatti.

---

## 🚀 Quick Start

### 1. Start Frontend
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

### 2. Start Backend
```bash
cd backend
# First time: copy .env.example to .env and fill in your credentials
copy .env.example .env

npm run dev
# API at http://localhost:5000/api
```

### 3. Seed Database (first time)
```bash
cd backend
npm run seed
```

---

## 🔐 Admin Login
- **Email:** `smkarupattishop@gmail.com`
- **Password:** `Admin@123`
- **URL:** http://localhost:5173/admin

---

## ⚙️ Configuration

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any strong random string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASS` | Gmail App Password |
| `ADMIN_EMAIL` | Admin email to receive contact messages |

---

## 📁 Project Structure
```
SM Karupatti shop/
├── frontend/          ← React.js + Vite + MUI + Framer Motion
│   └── src/
│       ├── assets/   (logo + product images)
│       ├── components/ (Navbar, Footer, ProductCard, etc.)
│       ├── context/  (AuthContext, CartContext)
│       ├── pages/    (Home, Products, Cart, Admin, etc.)
│       ├── services/ (Axios API layer)
│       └── theme/    (MUI Custom Theme)
│
└── backend/           ← Node.js + Express + MongoDB
    ├── config/       (db.js, cloudinary.js)
    ├── controllers/  (auth, product, review, order, contact, admin)
    ├── middleware/   (auth, admin, upload)
    ├── models/       (User, Product, Review, Order, Contact)
    ├── routes/
    └── utils/        (sendEmail, generateToken)
```

---

## 📞 Business Info
- **Brand:** SM Original Karupatti
- **Phone/WhatsApp:** +91 9976941156
- **Address:** Tisayanvilai - Udangudi Road, Thisayanvilai, Tamil Nadu - 627657

---

## 🛠️ Tech Stack

**Frontend:** React.js · Vite · MUI · Framer Motion · React Router · Axios · React Hook Form  
**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT · Cloudinary · Nodemailer · Multer

## ✨ Features
- 🎨 Premium glassmorphism UI with brown/gold/green theme
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌟 Framer Motion scroll reveal & page transitions
- 🛒 Persistent cart with price calculator
- 💬 WhatsApp order integration with auto-generated message
- 🔐 JWT authentication (user + admin roles)
- 📸 Cloudinary image upload (multiple images per product)
- 📧 Nodemailer email notifications
- ⭐ 5-star review system with admin approval
- 🎛️ Full admin dashboard (products, orders, users, reviews, messages)
- 🔍 SEO optimized with React Helmet
