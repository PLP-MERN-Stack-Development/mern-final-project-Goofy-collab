# RecipeShare — MERN Final Project 

A full-stack MERN (MongoDB, Express, React, Node) recipe-sharing application with authentication, user profiles, recipe creation, comments, search & filters, and basic image upload support.

This repository contains both the frontend (Vite + React) and backend (Express + MongoDB) for the RecipeShare app. It was developed as a capstone-style MERN project for the PLP MERN Stack course.

---

## 🚀 Quick summary

- Frontend: React (Vite) — modern UI, client-side routing, contexts for state
- Backend: Node.js + Express — REST API with authentication and robust middleware
- Database: MongoDB via Mongoose
- Features: user authentication (JWT), recipe CRUD, comments & ratings, saved recipes, image uploads (Cloudinary optional), pagination & filtering

---

## 🧭 Repository structure

- `src/` — frontend source (React + Vite)
  - `src/pages/` — page-level components (Home, Auth, Recipe detail, Create recipe, Profile)
  - `src/components/` — UI components (cards, inputs, navbar, recipe list, filters)
  - `src/context/` — React Context providers for auth & recipes
  - `src/services/` — API request utilities and services
- `server/` — backend API
  - `server.js` — express entrypoint
  - `config/database.js` — MongoDB connection
  - `routes/` — API route handlers (auth, recipes, users, comments)
  - `models/` — Mongoose schemas (User, Recipe, Comment)
  - `middleware/` — auth and error middlewares
  - `scripts/seedData.js` — data seeding helper (dev)

---

## 🧩 What you'll need

- Node.js (recommended 18.x or later)
- npm (or yarn)
- MongoDB connection (Atlas or local)
- Optional: Cloudinary account for image uploads

---

## ⚙️ Environment variables

There are two environment areas:

- Frontend (root) — copy `.env.example` to `.env` in the repo root and set values.
- Backend (server) — copy `server/.env.example` to `server/.env` and set values.

Example backend env variables (server/.env — DO NOT commit secrets):

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
# Optional third-party keys
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...
```

Frontend env (root/.env.example):

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=RecipeShare
VITE_APP_URL=http://localhost:3000
```

---

## 🛠️ Install & run (development)

Open two terminals — one for the frontend and one for the backend.

Windows PowerShell (example):

Frontend (project root):
```powershell
cd C:\Users\USER\desktop\mern-final-project-Goofy-collab
npm install
npm run dev
```

Backend (server folder):
```powershell
cd C:\Users\USER\desktop\mern-final-project-Goofy-collab\server
npm install
npm run dev   # uses nodemon
```

Once both servers are running:

- Frontend: typically served by Vite at http://localhost:5173
- Backend API: http://localhost:5000 (API root: `/api`)

---

## 📦 Build & production

Frontend build (root):
```powershell
npm run build
npm run preview   # preview the built site
```

Backend production:
```powershell
cd server
npm run start    # runs node server.js
```

Tip: For production deployment, make sure to set secure environment variables on your host and configure your production `MONGODB_URI`, `JWT_SECRET`, and any third-party credentials.

---

## 🎯 API overview

The server exposes a REST API under `/api`.

Useful endpoints (high-level):

- GET `/api/health` — health check
- Auth — `/api/auth`
  - (POST) `/api/auth/register` — register new user
  - (POST) `/api/auth/login` — authenticate (returns JWTs)
- Recipes — `/api/recipes`
  - (GET) `/` — fetch recipes (supports pagination, filters, search)
  - (GET) `/:id` — fetch a single recipe
  - (POST) `/` — create recipe (auth required)
  - (PUT) `/:id` — update recipe (author or admin)
  - (DELETE) `/:id` — delete recipe (author or admin)
- Comments — `/api/comments`
  - (POST) — add comment to recipe (auth required)
  - (DELETE) — delete comment (author or admin)
- Users — `/api/users`
  - (GET) `/:id/recipes` — fetch user's recipes
  - (GET) `/:id` — fetch user's profile

For a deeper dive, consult the backend `routes/` directory for exact request/response shapes and middleware.

---

## 🔁 Seeding the DB (dev)

The backend includes a simple script to seed sample data (if present):

```powershell
cd server
npm run seed
```

This helps populate development data — avoid running in production.

---

## ✅ Notable features & implementation details

- JWT-based authentication (access & refresh token expiration config)
- Robust Mongoose schemas: `User`, `Recipe`, `Comment` with virtuals and indexes
- Validation via `express-validator`
- Image uploading support with Cloudinary (optional, configured via env)
- Search & filter support on recipes, plus pagination
- Error handling and standardized API error responses

---

## ⚠️ Troubleshooting: "PayloadTooLargeError: request entity too large"

If you see an error like this in the server logs:

```
Error: PayloadTooLargeError: request entity too large
    expected: 1336077,
    length: 1336077,
    limit: 102400,
    type: 'entity.too.large'
```

Cause
- A client sent a request body larger than the server's configured body parser limit. This commonly happens when the frontend embeds a base64 data URL (large image) into JSON.

Quick fixes
- Increase the JSON/body parser max size (short-term). The backend uses express.json() and express.urlencoded() — increasing the `limit` prevents the server crash. Example in `server/server.js`:

```js
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ extended: true, limit: '6mb' }));
```

Recommended long-term solutions
- Don't send large base64 blobs in JSON. Instead:
  1. Upload images using multipart/form-data (FormData) to a dedicated upload endpoint on the server (use multer), or
  2. Upload directly to an image host (Cloudinary) from the client and send only the returned image URL in the JSON body when creating/updating recipes.

---

## 👨‍💻 Contributing

Contributions, bug reports, and improvements are welcome. Typical workflow:

1. Fork the repo
2. Create a feature branch (feature/xyz)
3. Add tests (if relevant), update docs
4. Create a PR describing the change

Please ensure you do NOT commit secrets (database URIs, API keys, JWT secrets) into the repository.

---



