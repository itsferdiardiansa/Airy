# @airy

HR data management API built with NX Monorepo. Employs Express, TypeScript, and Prisma for a scalable and maintainable backend solution. Consists of modular services, JWT authentication, role-based access control, and S3-compatible storage integration.

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL
- MinIO (for local S3-compatible storage)
- PNPM
- Docker

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up environment variables:
   Create a `.env` file in the root directory based on the provided.

   ```bash
   POSTGRES_USER=airy
   POSTGRES_PASSWORD=secure123
   POSTGRES_DB=airy_db

   MINIO_ROOT_USER=minioadmin
   MINIO_ROOT_PASSWORD=minioadmin
   ```

3. Start PostgreSQL and MinIO using Docker:
   ```bash
   docker-compose up -d
   ```
4. Start the `api-dashboard` application:
   ```bash
   npx nx dev @airy/api-dashboard
   ```
5. The API server should now be running at `http://localhost:4000`.
6. Test by using postman or curl to access the endpoints.
7. Import collection to Postman (see my message for the link).

## Troubleshooting

- Ensure PostgreSQL and MinIO services are running and accessible.
- Verify environment variables are correctly set in the `.env` file.
