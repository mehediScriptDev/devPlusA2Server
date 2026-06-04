# DevPulse API

A TypeScript Express backend for issue tracking with authentication, role-based access control, and PostgreSQL persistence.

## Features

- User registration and login with JWT authentication
- Contributor and maintainer roles
- Create/read/update/delete issue workflow
- Role-based permissions for issue updates and deletion
- Raw SQL queries using `pg` and direct pool interactions
- Centralized error handling and consistent response format

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- `pg` driver
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT auth
- `cors` for cross-origin requests

## Setup

1. Clone the repository
2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Start the server

   ```bash
   npm run dev
   ```

The server initializes the required `users` and `issues` tables on startup if they do not exist.

## Environment Variables

- `PORT` - server port (defaults to `4000`)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - secret for signing JWT tokens

## API Endpoints

### Auth

#### POST `/api/auth/signup`

Request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

#### POST `/api/auth/login`

Request body:

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Issues

#### POST `/api/issues`

Requires `Authorization` header with JWT.

Request body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}```

#### PATCH `/api/issues/:id`

Requires JWT. Contributors can update their own open issues. Maintainers can update any issue.

#### DELETE `/api/issues/:id`

Requires JWT and maintainer role.

## Database Schema

- `users` table
  - `id` SERIAL PRIMARY KEY
  - `name` TEXT NOT NULL
  - `email` TEXT NOT NULL UNIQUE
  - `password` TEXT NOT NULL
  - `role` TEXT NOT NULL DEFAULT `contributor`
  - `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  - `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

- `issues` table
  - `id` SERIAL PRIMARY KEY
  - `title` TEXT NOT NULL
  - `description` TEXT NOT NULL
  - `type` TEXT NOT NULL
  - `status` TEXT NOT NULL DEFAULT `open`
  - `reporter_id` INTEGER NOT NULL
  - `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  - `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
