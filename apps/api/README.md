# @airy/api-dashboard

Dashboard REST API built with Express, TypeScript, and Prisma. Features a modular architecture, JWT-based authentication with role management, S3-compatible storage integration (MinIO/AWS), and a robust service layer.

## Features

- **Architecture:** Modular, Service-Repository pattern with clear separation of concerns.
- **Authentication:** Secure JWT Access & Refresh token rotation strategies with Argon2 hashing.
- **Authorization:** Role-Based Access Control (RBAC) middleware (Admin, User, Manager, HR).
- **Database:** PostgreSQL with Prisma ORM, featuring complex schemas for organizational hierarchy.
- **Storage:** Abstracted Storage Service supporting AWS S3 and MinIO (local development).

## Tech Stack

- Runtime: Node.js (v20+)
- Language: TypeScript
- Framework: Express.js (v5)
- Database: PostgreSQL
- ORM: Prisma
- Storage: MinIO / AWS S3 SDK

## Getting Started

## 1. Environment Setup

Create a .env file in the `apps/api` directory:

```bash
NODE_ENV=development
PORT=4000

JWT_ACCESS_SECRET="9sT7qW2eF5hJ1kL4zX8cBnM3vP6yR0dG2aO5iU9wV1x="
JWT_REFRESH_SECRET="4zX8cBnM3vP6yR0dG2aO5iU9wV1x9sT7qW2eF5hJ1kL="

DATABASE_URL="postgresql://airy:airy_password@localhost:5432/airy_db?schema=public"

S3_ENDPOINT=http://127.0.0.1:9000
S3_REGION=us-east-1
S3_BUCKET=airy-uploads
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
```

## 2. Database Migration & Seeding

Apply database schema and populate with initial seed data (Admin user, Departments, Job Titles):

### Run migrations

```bash
npx prisma:migrate dev
```

### Seed database

```bash
npx prisma:seed
```

## 3. Run Development Server

```bash
npx nx dev @airy/api-dashboard
```

The server will start at http://localhost:4000.

## Project Structure

```bash
src/
├── config/
├── middlewares/
├── modules/
│   └── v1/
│       ├── auth/
│       ├── employees/
│       └── users/
├── routes/
├── services/
└── utils/
```
