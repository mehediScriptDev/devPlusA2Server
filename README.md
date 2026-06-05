 # DevPulse API

 A deployed issue tracking backend with JWT auth, role-based permissions, and PostgreSQL persistence.

 ## Live URL

 https://dev-plus-a2-server.vercel.app

 ## Features

 - User registration and login with JWT authentication
 - Contributor and maintainer roles
 - Create, read, update, and delete issues
 - Role-based update permissions for contributors and maintainers
 - Raw SQL handling with `pg` and direct `pool.query()` calls
 - Centralized error handling and consistent JSON responses

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

 3. Create a `.env` file with the following variables

 ```env
 PORT=4000
 DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=verify-full
 JWT_SECRET=your_secret_key
 ```

 4. Start the development server

 ```bash
 npm run dev
 ```

 5. Visit the live API at the URL above or use the local port configured in `.env`

 ## API Endpoints

 ### Authentication

 - `POST /api/auth/signup`
   - Request body: `name`, `email`, `password`, `role`
   - Creates a new user with `contributor` or `maintainer` role

 - `POST /api/auth/login`
   - Request body: `email`, `password`
   - Returns `token` and user details

 ### Issues

 - `POST /api/issues`
   - Requires `Authorization` header with JWT
   - Request body: `title`, `description`, `type`
   - Creates a new issue

 - `GET /api/issues`
   - Public endpoint
   - Optional query params: `sort=newest|oldest`, `type=bug|feature_request`, `status=open|in_progress|resolved`
   - Returns issue list with reporter details

 - `GET /api/issues/:id`
   - Public endpoint
   - Returns issue details with nested reporter info

 - `PATCH /api/issues/:id`
   - Requires JWT
   - Contributors can update their own open issues
   - Maintainers can update any issue

 - `DELETE /api/issues/:id`
   - Requires maintainer role
   - Deletes the specified issue

 ## Database Schema Summary

 ### `users`
 - `id`: SERIAL PRIMARY KEY
 - `name`: TEXT NOT NULL
 - `email`: TEXT NOT NULL UNIQUE
 - `password`: TEXT NOT NULL
 - `role`: TEXT NOT NULL DEFAULT `contributor`
 - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
 - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

 ### `issues`
 - `id`: SERIAL PRIMARY KEY
 - `title`: TEXT NOT NULL
 - `description`: TEXT NOT NULL
 - `type`: TEXT NOT NULL
 - `status`: TEXT NOT NULL DEFAULT `open`
 - `reporter_id`: INTEGER NOT NULL
 - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
 - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
