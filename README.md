# NutriAI Diet Planner

Medical-condition-aware personalised diet planner built with React, Node.js, Express, MongoDB, OTP authentication, AI meal generation, nutrition APIs, and progress tracking.

## Project Structure

```text
client/   React + Vite + Tailwind frontend
server/   Express + MongoDB API
```

## Phase 1 Setup

1. Install frontend dependencies:

   ```bash
   cd client
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Copy backend environment variables:

   ```bash
   cd server
   cp .env.example .env
   ```

4. Start development servers:

   ```bash
   cd server
   npm run dev
   ```

   ```bash
   cd client
   npm run dev
   ```

## Phase 2 Authentication

Authentication uses:

- bcrypt password hashing
- email OTP verification through Gmail/Nodemailer
- optional SMS OTP login through Twilio
- JWT-protected API routes
- OTP expiry, attempt limits, validation, and request rate limiting

Create `server/.env` from `server/.env.example` and add a Gmail app password. Twilio values are required only when SMS 2FA is enabled for a user.

### Auth API

```text
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/resend-email-otp
POST /api/auth/login
POST /api/auth/verify-sms
GET  /api/auth/me
```

The frontend reads its API address from `client/.env`:

```text
VITE_API_URL=http://localhost:5000/api
```
