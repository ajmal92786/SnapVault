# 📸 SnapVault – Photo Storage & Search Backend

SnapVault is a backend service that allows users to search and save images from the Unsplash API, tag them, and retrieve personalized search history. Built with Node.js, Express, PostgreSQL, and Sequelize ORM, this project demonstrates solid RESTful API design, validation, and test coverage.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Postman Collection](#-postman-collection)
- [Installation & Setup](#-installation--setup)
- [Testing](#-testing)
- [Live API Deployment](#-live-api-deployment)
- [Folder Structure](#-folder-structure)
- [Credits](#-credits)

---

## 🚀 Features

- 🔍 Search images from Unsplash API by keyword
- 👤 Create users (username & email)
- 💾 Save selected photos with descriptions and tags
- 🏷️ Tagging system (max 5 tags per photo)
- 🗂️ Search saved photos by tag with sorting by date
- 🕵️‍♂️ Track and retrieve user's search history
- ✅ Comprehensive validations and error handling
- 🧪 Unit and integration tests with Jest & Supertest

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Sequelize
- **API Integration**: Unsplash API
- **Testing**: Jest, Supertest
- **Deployment**: Vercel

---

## 📬 API Endpoints

### 👤 Create User

`POST /api/users`

#### ➡️ Sample Request

```json
{
  "username": "johndoe",
  "email": "johndoe@example.com"
}
```

#### ✅ Sample Response

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 🔍 Search Images (Unsplash)

`GET /api/photos/search?query=nature`

#### ✅ Sample Response

```json
{
  "results": [
    {
      "imageUrl": "https://images.unsplash.com/photo-1",
      "description": "Beautiful sunshine"
      "altDescription": "Beautiful nature scene"
    },
    ...
  ]
}
```

### 💾 Save Photo

`POST /api/photos`

#### ➡️ Sample Request

```json
{
  "imageUrl": "https://images.unsplash.com/photo-abc",
  "description": "Sunset by the beach",
  "altDescription": "sunset beach view",
  "tags": ["sunset", "beach"],
  "userId": 1
}
```

#### ✅ Sample Response

```json
{
  "message": "Photo saved successfully"
}
```

### ➕ Add Tags to Photo

`POST /api/photos/:photoId/tags`

#### ➡️ Sample Request

```json
{
  "tags": ["newTag", "ocean"]
}
```

#### ✅ Sample Response

```json
{
  "message": "Tags added successfully"
}
```

### 🏷️ Search by Tag

`GET /api/photos/tag/search?tags=sunset&sort=ASC&userId=1`

#### ✅ Sample Response

```json
{
  "photos": [
    {
      "imageUrl": "https://images.unsplash.com/photo-xyz",
      "description": "Sunset from rooftop",
      "dateSaved": "2025-05-28T17:41:33.903Z",
      "tags": ["sunset", "sky"]
    },
    ...
  ]
}
```

### 📜 Get Search History

`GET /api/search-history?userId=1`

#### ✅ Sample Response

```json
{
  "searchHistory": [
    { "query": "sunset", "timestamp": "2025-05-26T12:31:00Z" },
    { "query": "mountain", "timestamp": "2025-05-26T14:05:00Z" },
    ...
  ]
}
```

---

### 📬 Postman Collection

You can test all SnapVault API endpoints using the Postman collection:

## 👉 [Download SnapVault Postman Collection](./postman/Snapvault-Backend.postman_collection.json)

---

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ajmal92786/SnapVault-Backend.git
   cd SnapVault-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up `.env` file**  
   Create a `.env` file in the root directory with the following credentials:

   ```env
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db
   DB_HOST=your_host.supabase.co
   DB_PORT=5432
   PORT=3000
   UNSPLASH_ACCESS_KEY=your_unsplash_api_key
   ```

4. **Run migrations (if using sequelize-cli)**

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server**
   ```bash
   npm start
   ```

---

## 🧪 Testing

SnapVault uses **Jest** and **Supertest** for unit and integration testing.

### ➕ Setup `.env.test`

`.env.test` is **not committed** to GitHub. Create one using the provided template:

```env
# .env.test
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db
   DB_HOST=your_host.supabase.co
   DB_PORT=5432
   PORT=3000
   UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

Make sure `package.json` contains:

```json
"scripts": {
  "test": "cross-env NODE_ENV=test jest --runInBand"
}
```

### ✅ Run tests

```bash
npm run test
```

Test coverage includes:

- ✅ Validation logic
- ✅ Service methods
- ✅ Controller behavior
- ✅ API route integration

---

### 🚀 Live API Deployment

All APIs are live and can be accessed at:

👉 **Base URL**: `https://snap-vault-backend-ajmal-razas-projects.vercel.app`

---

## 📁 Folder Structure

```
├── __tests__/             # Test files (controllers, routes, services, validations)
├── config/                # Sequelize & environment config
├── migrations/            # Sequelize CLI migration files
├── models/                # Sequelize models (User, Photo, Tag, SearchHistory)
├── src/                   # Source code
│   ├── controllers/       # Handles request logic
│   ├── services/          # Contains reusable business logic
│   ├── routes/            # API route definitions
│   └── validations/       # Input validation functions
├── .env                   # Secrets and environment variables
├── .env.test              # Secrets and environment variables for testing
├── .gitignore             # Prevents sensitive or bulky files from being tracked
├── index.js
├── package-lock.json      # Exact versions of installed packages
├── package.json           # Project dependencies and scripts
├── README.md
└── server.js              # App entry point
```

---

## 🙌 Credits

- Made with ❤️ by MOHD AJMAL RAZA
- GitHub: [github.com/ajmal92786](https://github.com/ajmal92786)

---

## 📄 License

This project is for educational purposes. You can reuse parts freely.
