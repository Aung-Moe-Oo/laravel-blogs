# Blog System (REST API & Frontend Dashboard)

A modern full-stack Blog System built with **Laravel 13**, **React 19**, **Inertia.js v3**, **Laravel Sanctum**, and interactive **Swagger / OpenAPI 3.1** documentation.

---

## 🚀 Features

### 1. RESTful API & Documentation
- **Sanctum Token Authentication:** Token-based API authentication (`Bearer <token>`) for protected operations.
- **Classic Swagger UI:** Interactive API explorer with "Try it out" and Bearer Authorization at `/api/documentation` (and `/swagger`).
- **Scramble Elements UI:** Modern OpenAPI 3.1 documentation viewer at `/docs/api`.
- **Raw OpenAPI Specification:** JSON schema available at `/docs/api.json`.
- **Policy-Based Authorization:** Strict policies ensure only authors can modify/delete their posts and comments.

### 2. Full-Stack Web Frontend (React + Inertia.js)
- **Home Landing Page (`/`):** Clean, responsive overview with quick links to blog articles, Swagger UI, and dashboard.
- **Blog Articles Directory (`/posts`):**
  - Card grid displaying all published articles with author, date, and comment counts.
  - Real-time search filter by title and keywords.
  - Pagination support.
- **Article Reader & Discussion (`/posts/{id}`):**
  - Full article content reading view.
  - Interactive commenting section.
  - Comment deletion for comment authors or post owners.
  - Direct link to raw REST API JSON endpoint.
- **Management Dashboard (`/dashboard`):**
  - Platform statistics cards (Total Posts, Comments, Users, and My Posts).
  - **API Token Generator:** Generate and copy Sanctum tokens with one click for testing in Swagger UI or Postman.
  - **Create Post Form:** Quick creation with title, content, and status (Published/Draft).
  - **My Articles Manager:** View, delete, and **Edit posts via a modal dialog**.
  - **Recent Community Posts:** Overview of articles from other platform authors.

---

## 📋 REST API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | Public | Register a new user and receive a Bearer API token |
| `POST` | `/api/login` | Public | Log in with email & password and receive an API token |
| `POST` | `/api/logout` | `auth:sanctum` | Revoke the current access token |
| `GET` | `/api/me` | `auth:sanctum` | Retrieve current authenticated user profile |

### Posts Management
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts` | Public | List published posts (supports `search`, `user_id`, `status`, `per_page`) |
| `POST` | `/api/posts` | `auth:sanctum` | Create a new post (generates unique slug automatically) |
| `GET` | `/api/posts/{post}` | Public | Retrieve a post with author and comments |
| `PUT/PATCH` | `/api/posts/{post}` | `auth:sanctum` | Update a post (*author only*) |
| `DELETE` | `/api/posts/{post}` | `auth:sanctum` | Delete a post (*author only*) |

### Comments Management
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts/{post}/comments` | Public | List comments on a specific post (paginated) |
| `POST` | `/api/posts/{post}/comments` | `auth:sanctum` | Post a comment under an article |
| `PUT/PATCH` | `/api/comments/{comment}` | `auth:sanctum` | Update comment content (*author only*) |
| `DELETE` | `/api/comments/{comment}` | `auth:sanctum` | Delete comment (*commenter or post owner*) |

---

## 🛠️ Tech Stack

- **Backend Framework:** [Laravel 13](https://laravel.com) (PHP 8.3+)
- **API Authentication:** [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **API Documentation:** [Dedoc Scramble](https://scramble.dedoc.co/) & [Swagger UI](https://swagger.io/tools/swagger-ui/)
- **Frontend Framework:** [React 19](https://react.dev) with [Inertia.js v3](https://inertiajs.com)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev)
- **Database:** SQLite (default) / MySQL / MariaDB
- **Testing:** [Pest PHP](https://pestphp.com/) (Feature & API test suite)
- **Code Formatter:** [Laravel Pint](https://laravel.com/docs/pint)

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- PHP >= 8.3 (with `pdo_sqlite` or `pdo_mysql`, `curl`, `mbstring` extensions enabled)
- Composer
- Node.js >= 18 and npm

### 2. Clone and Setup Environment
```bash
# Copy example environment configuration
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Migration & Seeding
```bash
# Run database migrations and seed realistic sample users, posts, and comments
php artisan migrate --seed
```

*Default test credentials seeded:*
- **Email:** `test@example.com`
- **Password:** `password`

### 4. Build Frontend Assets
```bash
# Install frontend dependencies (if not installed)
npm install

# Build production assets
npm run build

# Or start the local Vite development server
npm run dev
```

### 5. Start the Server
```bash
php artisan serve
```

---

## 📖 Accessing Application & Documentation

Once the server is running (`http://127.0.0.1:8000` or `http://localhost:8000`):

| Page | URL | Description |
|---|---|---|
| **Home Landing Page** | `http://localhost:8000` | Welcome screen & feature overview |
| **Blog Articles** | `http://localhost:8000/posts` | Public blog reader and search |
| **Dashboard** | `http://localhost:8000/dashboard` | Post management, editing dialog & token generator |
| **Swagger UI** | `http://localhost:8000/api/documentation` | Interactive OpenAPI 3.1 Swagger explorer |
| **Scramble Docs** | `http://localhost:8000/docs/api` | Modern interactive API reference |
| **OpenAPI JSON** | `http://localhost:8000/docs/api.json` | Raw OpenAPI 3.1 specification schema |

---

## 🔑 How to Test the REST API with Swagger

1. Log in or create an account at `http://localhost:8000/login` (or register at `/register`).
2. Navigate to `http://localhost:8000/dashboard`.
3. In the **REST API & Swagger Authorization** card, enter a token name and click **Generate Token**.
4. Click **Copy** to copy your new Bearer token.
5. Click **Open Swagger** (or go to `http://localhost:8000/api/documentation`).
6. Click the green **Authorize** button in Swagger UI, enter your token, and click **Authorize**.
7. You can now use the **Try it out** button on any protected endpoints (`POST /api/posts`, `PUT /api/posts/{id}`, `DELETE /api/posts/{id}`, etc.) directly in the browser!

---

## 🧪 Testing

To run the automated Pest test suite covering Authentication, Posts API, Comments API, and Swagger routes:

```bash
php artisan test
```

To format code style according to Laravel standards:

```bash
vendor/bin/pint
```

---

## 📄 License
This project is open-source software licensed under the [MIT license](LICENSE).
