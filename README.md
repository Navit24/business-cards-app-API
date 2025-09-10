## Business Cards App API

### Overview

A REST server for a "Business Cards" application built with Node.js, Express, and MongoDB (Mongoose). The server provides user management (register, login, manage) and cards (CRUD, likes, business number management), including JWT-based authorization and data validation using Joi.

- **Stack**: Node.js, Express 5, MongoDB + Mongoose, JWT, Joi, Morgan, CORS
- **Configuration management**: `node-config` per environment (development/production)
- **Authentication**: `x-auth-token` header with JWT
- **Authorization**: user fields such as `isAdmin` and `isBusiness`

---

### Table of Contents

- Installation & Run
- Configuration (Config)
- Project Structure
- API Routes (Users, Cards)
- Auth & Authorization
- Logging & Errors
- Seed Data (seeding)
- Request Examples (cURL)

---

## Installation & Run

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode (Windows PowerShell/CMD):
   ```bash
   npm run dev
   ```
   - Default listener: `http://localhost:8181`
3. Run in production mode (Windows):
   ```bash
   npm start
   ```
   - Default listener: `http://localhost:9191`

> Note: The scripts use `set NODE_ENV=...` (Windows-friendly).

---

## Configuration (Config)

Configuration is managed using the `config` library through files under `config/`.

- `config/development.json` (default for `npm run dev`):

  - `NODE_ENV`: "development"
  - `PORT`: 8181
  - `TOKEN_GENERATOR`: "jwt"
  - `DB_USERNAME`, `DB_PASSWORD`: typically `null` in development
  - `LOGGER`: "morgan"
  - `DB`: "MONGODB"

- `config/production.json` (default for `npm start`):

  - `NODE_ENV`: "production"
  - `PORT`: 9191
  - `TOKEN_GENERATOR`: "jwt"
  - `DB_USERNAME`, `DB_PASSWORD`: Atlas credentials
  - `LOGGER`: "morgan"
  - `DB`: "MONGODB"

- `config/default.json` (applies to all environments):
  - `JWT_KEY`: JWT signing key
  - `JWT_EXPIRES_IN`: e.g. `4h`
  - `BCRYPT_SALT_ROUNDS`: e.g. `10`

### Database Connection

The file `src/db/db-service.js` selects the connector based on `NODE_ENV`:

- `development` → `src/db/connect-local.js`
- `production` → `src/db/connect-atlas.js`

Ensure MongoDB connections are properly configured in these files.

---

## Project Structure

```
src/
  controllers/        # Express routers (users, cards, root router)
  dal/                # Data access layer (Mongo/Mongoose)
  db/                 # DB connections (local/atlas) and selection service
  helpers/            # Helpers for validation/normalization/passwords/token
  middlewares/        # CORS, auth, logger, error handler
  mocks/              # Seed data (seeding)
  models/             # Mongoose schemas (User, Card, etc.)
  services/           # Domain logic (users/cards)
  utils/              # Loggers and error utilities
  validation/         # Joi schemas and validators
```

Entry point: `server.js`.

---

## API Routes

Routes are mounted at the server root, without an extra prefix (e.g., `/users`, `/cards`). Some routes require a valid `x-auth-token` header.

### Users

Base: `/users`

- POST `/users` — Register
  - Body: user details (see `validation/register.validation.js`/`validators.js`)
  - Response: user with token/fields as provided by the DAL
- POST `/users/login` — Login
  - Body: `{ email, password }`
  - Response: user object including token (per DAL)
- GET `/users` — List users (Admin only)
  - Header: `x-auth-token`
- GET `/users/:id` — Get user (Owner or Admin)
  - Header: `x-auth-token`
- PUT `/users/:id` — Update user (Owner or Admin)
  - Header: `x-auth-token`
  - Body: user fields to update (validated by Joi)
- PATCH `/users/:id` — Toggle business status `isBusiness` (Owner or Admin)
  - Header: `x-auth-token`
- DELETE `/users/:id` — Delete user (Owner or Admin)
  - Header: `x-auth-token`

Authorization policy: the code uses `req.user._id`, `req.user.isAdmin` to enforce access.

### Cards

Base: `/cards`

- GET `/cards` — All cards (public)
- GET `/cards/my-cards` — Authenticated user's cards (Business only)
  - Header: `x-auth-token` (requires `isBusiness=true`)
- GET `/cards/liked-cards` — Cards liked by the authenticated user
  - Header: `x-auth-token`
- GET `/cards/:id` — Card by id (public)
- POST `/cards` — Create card (Business only)
  - Header: `x-auth-token`
  - Body: card details (validated by `validateCard`)
- PUT `/cards/:id` — Update card (Business owner or Admin)
  - Header: `x-auth-token`
- PATCH `/cards/:id` — Like/Unlike by the authenticated user
  - Header: `x-auth-token`
- PATCH `/cards/:id/number` — Change business number (Admin only)
  - Header: `x-auth-token`
  - Body: `{ bizNumber: number }` (validated by `validateCardNumber`)
- DELETE `/cards/:id` — Delete card (Business owner or Admin)
  - Header: `x-auth-token`

Authorization policy: ownership/role checks are performed in the controller (`card.controller.js`) against `req.user` and the existing card.

---

## Auth & Authorization

- The `x-auth-token` header must contain a JWT signed with `JWT_KEY`.
- The middleware `auth.middleware.js` reads the token, validates it, and places the user on `req.user`.
- Key fields: `_id`, `isAdmin`, `isBusiness`.

---

## Logging & Errors

- HTTP logs: `src/utils/http-logger.js` (Morgan-based) is wired in `server.js`.
- Errors: `errorHandler(res, status, message)` returns a consistent response from controllers/middlewares.
- 404: root router (`src/controllers/router.js`) returns 404 for unknown routes.

Typical error format:

```json
{
  "status": 403,
  "message": "Access denied. Admins only."
}
```

---

## Seed Data (Seeding)

On server startup (`server.js`):

- `generateInitialCards()`
- `generateInitialUsers()`

These functions are loaded from `src/mocks/initial-data-service.js` and seed sample data into the database.

> If you do not want automatic seeding, you can remove/conditionalize these calls in `server.js`.

---

## cURL Examples

- Login and get a token:

```bash
curl -X POST http://localhost:8181/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

- Create a card (Business only):

```bash
curl -X POST http://localhost:8181/cards \
  -H "Content-Type: application/json" \
  -H "x-auth-token: <JWT>" \
  -d '{
    "title":"My Biz Card",
    "subtitle":"Awesome services",
    "description":"Full stack services",
    "phone":"050-0000000",
    "email":"biz@example.com",
    "web":"https://example.com",
    "image": {"url":"https://...","alt":"logo"},
    "address": {"state":"","country":"IL","city":"Tel Aviv","street":"Herzl","houseNumber":1,"zip":"12345"}
  }'
```

- Change business number (Admin only):

```bash
curl -X PATCH http://localhost:8181/cards/<CARD_ID>/number \
  -H "Content-Type: application/json" \
  -H "x-auth-token: <ADMIN_JWT>" \
  -d '{"bizNumber": 1234567}'
```

---

## Security & Ops Tips

- Do not commit `JWT_KEY`/sensitive passwords to a public repo. Prefer environment variables or a vault.
- Ensure CORS is configured to your needs in `src/middlewares/cors.middlewares.js`.
- In production, enable HTTPS behind a proxy/load balancer.

---

## Useful Scripts

- `npm run dev` — Development server with Nodemon
- `npm start` — Production server

---

## License

MIT 
