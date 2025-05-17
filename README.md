# 📸 SnapVault

A backend project where users can search for photos via the Unsplash API, save them to collections, add tags, and track their search history. Built with **Node.js**, **Express**, **Sequelize**, and **Supabase (PostgreSQL)**.

---

## 🚀 Features

- Search photos using the Unsplash API
- Save photos with metadata
- Add tags to images
- Track user search history
- RESTful API structure
- Sequelize ORM with Supabase PostgreSQL

---

## 📦 Tech Stack

- Node.js + Express
- Sequelize ORM
- Supabase (PostgreSQL)
- dotenv
- axios

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ajmal92786/Pic-Storage.git
cd Pic-Storage
```

### ✅ Prerequisites

- Node.js (v18 or above)
- npm
- Supabase PostgreSQL project with credentials

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file at the root with your Supabase/Postgres credentials:

```
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_NAME=your_db
DB_HOST=your_host.supabase.co
DB_PORT=5432
```

Also add:

```
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

### 4. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start the server

```bash
npm start
```

Server will run on:
📍 `http://localhost:4040`

---

## 🧪 API: Create New User

**Endpoint:** `POST /api/users`
**Description:** Create a new user with username and email

### ✅ Sample Request:

```json
{
  "username": "newUser",
  "email": "newuser@example.com"
}
```

### ✅ Sample Response:

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "newUser",
    "email": "newuser@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 📂 Project Structure

```
├── config/               # Sequelize DB config
├── migrations/           # Sequelize migration files
├── models/               # Sequelize models
├── src/
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic and DB operations
│   ├── validations/      # Input validation functions
│   └── routes/           # Express route definitions
├── .env                  # Environment variables
└── index.js              # Entry point

```

---

## 📮 API Testing (via Postman)

You can test the API locally with Postman by sending HTTP requests.

### ✅ 1. Start the Server

Make sure your backend is running:

```bash
npm start
```

Default server URL:
`http://localhost:4040`

---

### 🧪 2. Create New User (POST `/api/users`)

**Endpoint:**

```
POST http://localhost:4040/api/users
```

**Headers:**

```
Content-Type: application/json
```

**Request Body (JSON):**

```json
{
  "username": "newUser",
  "email": "newuser@example.com"
}
```

**Expected Success Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "newUser",
    "email": "newuser@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### ❌ Possible Errors:

- **400 Bad Request** if:

  - `username` or `email` is missing
  - Email format is invalid
  - Email already exists in DB

---

---

## 🧑‍💻 Author

Made by [Mohd Ajmal Raza](https://github.com/ajmal92786)

---

## 📄 License

This project is for educational purposes. You can reuse parts freely.
