# JWT Token Revocation with Redis Blacklist

## 📌 Project Description

This project demonstrates how to securely revoke JWT (JSON Web Token) access tokens using a Redis-based blacklist mechanism.

JWT is stateless by design, meaning that once a token is issued, it remains valid until its expiration time. This creates a security risk because a user who logs out or a stolen token can still be used.

In this project, Redis is used to store revoked tokens and deny access immediately after logout.

---

## 🎯 Objective

The main goal of this project is to:

- Understand the limitations of stateless JWT authentication
- Implement a secure logout mechanism
- Prevent reuse of revoked tokens
- Use Redis as a fast in-memory blacklist system

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- jsonwebtoken (JWT)
- Redis
- Docker (for running Redis)
- dotenv
- uuid

---

## ⚙️ How It Works

### 1. Login
- User sends credentials to `/auth/login`
- Server verifies credentials
- JWT token is generated with a unique `jti`

### 2. Access Protected Route
- User sends token to `/auth/profile`
- Server verifies token
- Checks Redis blacklist
- If not revoked → access granted

### 3. Logout
- User sends token to `/auth/logout`
- Server extracts `jti`
- Stores it in Redis as `bl:<jti>`
- TTL is set to remaining token lifetime

### 4. Revoked Token Usage
- Same token is used again
- Server finds it in Redis
- Access is denied

---

## 🧪 Test Result

After testing:

1. Login was successful and a valid JWT token was received  
2. Access to `/auth/profile` worked correctly  
3. After logout, the token was stored in Redis  
4. When the same token was used again:

```json
{
  "error": "Token has been revoked"
}
