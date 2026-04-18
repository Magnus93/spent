# Plan

## Phase 0 - Foundation (no features)

### 0.1 - /app
- github repo
- Set up cloudflare worker + hono app
  - GET /health

### 0.2 - /api
- /api/accounts/list.ts 
  - service.accounts.list() // hard-coded list (mock data)
  - Add type core.Account in /core/Account

### 0.3 - /repository
- /repository/accounts.ts // Mock data
  - repository.accounts.list()

### 0.4 - local postgres
- Set up drizzle ORM + schema
- Connect local Postgres (Docker)
- Run migrations successfully
  - Add accounts-table

### 0.5 - Real accounts 
- POST /accounts
- GET /accounts

## Phase 1 - Other tables
- Create tables
  - batches
  - transactions

## Phase 2 - batches
- POST /batches
  - Only post with JSON
  - Create in batches-table
  - Upsert in transactions-table

- POST /batches/ica
  - ica-CSV -> core-type
- POST /batches/swedbank

## Phase 3 - list/search transactions
- GET /transactions
- GET /transactions?query=...
  - search/filter
  - sort and continuation-token (paginate)
    - drizzle-cursor

## Phase 4 - Duplicate tx matching
- UNIQUE index on (account_id, fingerprint)

## Phase 5 - User and authentication
### 5.1 - Add user
- Add user
  - table/schema
  - core-type
  - service
  - endpoints


### 5.2 - Basic Authentication
- Choose crypto library for hashing passwords
    - argon2
    - bcrypt
- Save hashed password
- How to salt and pepper
    - Salt handled by argin2/bcrypt
    - Pepper is extra not needed (but could save in env.pepper)

### 5.3 - register user
- POST /users/register

### 5.4 - login jwt
- POST /users/login
- private key in ENV + Public available key
- jwt 
    - library: jose
- protect/verify jwt in middleware for most endpoints.

### 5.5 - Reset password
- Reset password with Email
  - api services 
    - Resend or Postmark or SendGrid

### 5.6 - sessions
Create session for every jwt issued
- Add sessions table
    - Extra: save endpoints called during session

## Phase 6 - Deploying on Prod DB online 6 deploy

### 6.1 - Choose DB hosting
- Move DB-local to prod (Google Cloud SQL or Neon or Supabase).
    - Neon is cheapest and easiest?

### 6.2 - Point drizzle to remote
- Add connection string
- run migrations against remote DB
- verify schema matches local

### 6.3 - Deploy worker to PROD
- Deploy worker in prod environment
- env vars.
- confirm api works in prod

### 6.3 test
- create account
- create batch txs
- list transactions


