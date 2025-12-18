# Student Dashboard Backend

Backend API for the **Student Dashboard** application, built with **NestJS**, focused on **production-grade foundations**: authentication, users, security, caching, validation, and CI enforcement.

---

## 🚀 Tech Stack

* **Node.js / TypeScript**
* **NestJS**
* **MongoDB (Mongoose)**
* **Redis (ioredis)**
* **JWT Authentication** (Access + Refresh tokens with rotation)
* **Passport.js**
* **Rate Limiting** (`@nestjs/throttler`)
* **ESLint + Prettier** (strict, CI-enforced)
* **Husky + lint-staged**
* **GitHub Actions (CI)**

---

## 📦 Features (Current Phase)

* ✅ User registration & login
* ✅ JWT access tokens
* ✅ Refresh token rotation (hashed, secure)
* ✅ Role-based authorization
* ✅ Global validation & exception handling
* ✅ Redis caching layer
* ✅ Rate limiting (per-route & global)
* ✅ Strict linting (no `any`, no floating promises)
* ✅ CI/CD ready

> ⚠️ Domain modules (students, courses, etc.) are intentionally **excluded** for now.
> This repo focuses on **foundational correctness and security first**.

---

## 📂 Project Structure

```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── app.config.ts
│   ├── jwt.config.ts
│   ├── mongo.config.ts
│   ├── redis.config.ts
│   └── validation.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── modules/
│   ├── auth/
│   ├── users/
│   └── cache/
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`.

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/student-dashboard
MONGODB_MAX_POOL_SIZE=50

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600

# JWT
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=change-this-too
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
CORS_ORIGIN=http://localhost:3001
```

---

## 🛠️ Installation

```bash
npm install
```

---

## ▶️ Running the App

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

---

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

---

## 🧹 Linting & Formatting

This project uses **strict lint rules** enforced locally and in CI.

```bash
# lint
npm run lint

# format
npm run format
```

Rules enforced:

* ❌ no `any`
* ❌ no unused vars
* ❌ no floating promises
* ❌ no unformatted code

---

## 🔒 Git Hooks (Husky)

Before every commit:

* ESLint runs
* Prettier runs
* Commit is blocked on errors or warnings

```bash
npm run prepare
```

---

## 🔁 CI/CD (GitHub Actions)

CI runs on:

* `pull_request`
* `push` to main branches

Pipeline includes:

1. Install dependencies
2. Type check
3. Lint (`--max-warnings=0`)
4. Test

> Deployment is intentionally **not included** in this repo yet.

---

## 🛡️ Security Notes

* Passwords are hashed (bcrypt)
* Refresh tokens are:

  * Rotated
  * Hashed
  * Invalidated on reuse
* Rate limiting protects auth endpoints
* Validation whitelist enabled globally
* No sensitive config committed

---

## 📌 Roadmap

* [ ] Email verification
* [ ] Password reset flow
* [ ] Audit logs
* [ ] Domain modules (students, courses)
* [ ] OpenAPI hardening
* [ ] Deployment automation

---

## 👨‍💻 Maintainers

Built and maintained as a **production-grade reference backend**.

---

## 📄 License

GPLv3

---
