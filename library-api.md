# Library Back — API Documentation

**Base URL:** `https://library-tan-eta.vercel.app`  
**Version:** 1.0.0  
**Auth:** Bearer JWT token required on protected endpoints

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Books](#books)
- [Transactions](#transactions)
- [Quick Test — cURL](#quick-test--curl)
- [Error Reference](#error-reference)

---

## Authentication

Protected endpoints require a `Bearer` token in the `Authorization` header. Obtain a token by calling the [Login](#login) endpoint.

```
Authorization: Bearer <your_jwt_token>
```

---

## Users

### Register User

```
POST /api/users/register
```

Creates a new user account.

**Request Body**

| Field             | Type     | Required | Description                    |
|-------------------|----------|----------|--------------------------------|
| `name`            | `string` | ✅       | Full name of the user          |
| `email`           | `string` | ✅       | Valid email address            |
| `password`        | `string` | ✅       | Minimum 6 characters           |
| `confirmPassword` | `string` | ✅       | Must match `password`          |
| `role`            | `string` | ❌       | `member` (default) or `admin`  |

**Example Request**

```http
POST https://library-tan-eta.vercel.app/api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "member"
}
```

---

### Login

```
POST /api/users/login
```

Authenticates a user and returns a JWT token.

**Request Body**

| Field      | Type     | Required | Description         |
|------------|----------|----------|---------------------|
| `email`    | `string` | ✅       | Registered email    |
| `password` | `string` | ✅       | Account password    |

**Example Request**

```http
POST https://library-tan-eta.vercel.app/api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Example Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get All Users

```
GET /api/users/users
```

🔒 **Auth Required**

Returns a list of all registered users. Admin access recommended.

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/users/users
Authorization: Bearer <token>
```

---

### Ban User

```
PUT /api/users/ban-user/:id
```

🔒 **Auth Required**

Bans a user by their ID, preventing them from borrowing books.

**Path Parameters**

| Parameter | Type     | Description       |
|-----------|----------|-------------------|
| `id`      | `string` | Target user's ID  |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/users/ban-user/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

### Unban User

```
PUT /api/users/unban-user/:id
```

🔒 **Auth Required**

Lifts a ban from a previously banned user.

**Path Parameters**

| Parameter | Type     | Description       |
|-----------|----------|-------------------|
| `id`      | `string` | Target user's ID  |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/users/unban-user/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

## Books

### Get All Books

```
GET /api/books
```

🌐 **Public** — No authentication required.

Returns all available books in the library.

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/books
```

---

### Search Books

```
GET /api/books/search?query=<searchterm>
```

🌐 **Public** — No authentication required.

Searches books by title, author, or ISBN.

**Query Parameters**

| Parameter | Type     | Required | Description               |
|-----------|----------|----------|---------------------------|
| `query`   | `string` | ✅       | Search term to match against |

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/books/search?query=clean+code
```

---

### Get Book by ID

```
GET /api/books/:id
```

🔒 **Auth Required**

Retrieves full details of a single book by its ID.

**Path Parameters**

| Parameter | Type     | Description  |
|-----------|----------|--------------|
| `id`      | `string` | Book's ID    |

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/books/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

### Create Book

```
POST /api/books
```

🔒 **Auth Required**

Adds a new book to the library catalog.

**Request Body**

| Field       | Type     | Required | Description                      |
|-------------|----------|----------|----------------------------------|
| `title`     | `string` | ✅       | Book title                       |
| `author`    | `string` | ✅       | Author name                      |
| `isbn`      | `string` | ✅       | ISBN identifier                  |
| `quantity`  | `number` | ✅       | Total copies in library          |
| `available` | `number` | ✅       | Copies currently available       |

**Example Request**

```http
POST https://library-tan-eta.vercel.app/api/books
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 10,
  "available": 10
}
```

---

### Edit Book

```
PUT /api/books/:id
```

🔒 **Auth Required**

Updates one or more fields of an existing book.

**Path Parameters**

| Parameter | Type     | Description  |
|-----------|----------|--------------|
| `id`      | `string` | Book's ID    |

**Request Body** *(all fields optional)*

| Field      | Type     | Description                 |
|------------|----------|-----------------------------|
| `title`    | `string` | Updated book title          |
| `author`   | `string` | Updated author name         |
| `quantity` | `number` | Updated total copy count    |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/books/64a7f3b2c1e4d5f6a7b8c9d0
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Clean Code: A Handbook",
  "author": "Robert C. Martin",
  "quantity": 15
}
```

---

### Delete Book

```
DELETE /api/books/:id
```

🔒 **Auth Required**

Permanently removes a book from the catalog.

**Path Parameters**

| Parameter | Type     | Description  |
|-----------|----------|--------------|
| `id`      | `string` | Book's ID    |

**Example Request**

```http
DELETE https://library-tan-eta.vercel.app/api/books/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

### Ban Book

```
PUT /api/books/ban-book/:id
```

🔒 **Auth Required**

Marks a book as banned, making it unavailable for borrowing.

**Path Parameters**

| Parameter | Type     | Description  |
|-----------|----------|--------------|
| `id`      | `string` | Book's ID    |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/books/ban-book/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

### Unban Book

```
PUT /api/books/unban-book/:id
```

🔒 **Auth Required**

Restores a banned book to available status.

**Path Parameters**

| Parameter | Type     | Description  |
|-----------|----------|--------------|
| `id`      | `string` | Book's ID    |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/books/unban-book/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

## Transactions

### Borrow Book

```
POST /api/transactions/borrow/:userId/:bookId
```

🔒 **Auth Required**

Creates a borrow transaction, decrementing the book's available count.

**Path Parameters**

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `userId`  | `string` | ID of the borrowing user |
| `bookId`  | `string` | ID of the book to borrow |

**Example Request**

```http
POST https://library-tan-eta.vercel.app/api/transactions/borrow/64a7f3b2c1e4/64a7f3b2c1e5
Authorization: Bearer <token>
```

---

### Return Book

```
PUT /api/transactions/return/:transactionId
```

🔒 **Auth Required**

Closes a borrow transaction and increments the book's available count.

**Path Parameters**

| Parameter       | Type     | Description               |
|-----------------|----------|---------------------------|
| `transactionId` | `string` | ID of the open transaction |

**Example Request**

```http
PUT https://library-tan-eta.vercel.app/api/transactions/return/64a7f3b2c1e4d5f6a7b8c9d0
Authorization: Bearer <token>
```

---

### Get My Transactions

```
GET /api/transactions/user
```

🔒 **Auth Required**

Returns all borrow/return transactions belonging to the authenticated user.

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/transactions/user
Authorization: Bearer <token>
```

---

### Get All Transactions — Admin

```
GET /api/transactions/admin
```

🔒 **Auth Required**

Returns all transactions across all users. Intended for admin use.

**Example Request**

```http
GET https://library-tan-eta.vercel.app/api/transactions/admin
Authorization: Bearer <token>
```

---

## Quick Test — cURL

```bash
# 1. Register
curl -X POST https://library-tan-eta.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123","confirmPassword":"password123"}'

# 2. Login — copy the token from the response
curl -X POST https://library-tan-eta.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 3. Get All Books (public)
curl https://library-tan-eta.vercel.app/api/books

# 4. Search Books (public)
curl "https://library-tan-eta.vercel.app/api/books/search?query=clean+code"

# 5. Create a Book (replace TOKEN)
curl -X POST https://library-tan-eta.vercel.app/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Clean Code","author":"Robert C. Martin","isbn":"9780132350884","quantity":5,"available":5}'

# 6. Borrow a Book (replace TOKEN, USER_ID, BOOK_ID)
curl -X POST https://library-tan-eta.vercel.app/api/transactions/borrow/USER_ID/BOOK_ID \
  -H "Authorization: Bearer TOKEN"

# 7. Return a Book (replace TOKEN, TRANSACTION_ID)
curl -X PUT https://library-tan-eta.vercel.app/api/transactions/return/TRANSACTION_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Error Reference

| Status | Meaning               | Common Cause                                      |
|--------|-----------------------|---------------------------------------------------|
| `400`  | Bad Request           | Missing or invalid request body fields            |
| `401`  | Unauthorized          | Missing, expired, or malformed Bearer token       |
| `403`  | Forbidden             | Authenticated but insufficient role/permissions  |
| `404`  | Not Found             | Resource ID does not exist                        |
| `409`  | Conflict              | Duplicate email on register, or book unavailable |
| `500`  | Internal Server Error | Unexpected server-side failure                    |

---

> 🔒 = Auth Required &nbsp;&nbsp; 🌐 = Public
