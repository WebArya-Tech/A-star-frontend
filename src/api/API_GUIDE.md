# Frontend API Guide — Student Reviews & Running Classes

This document covers all endpoints for the two modules added to the backend.
**Base URL:** https://api.astarclasses.com

## 1. Authentication Quick Reference
User login uses OTP or password. The JWT token returned must be sent in every protected request.

### OTP Login (2-step)
1. **Send OTP**: `POST /api/auth/start` (Body: `{ "email": "..." }`)
2. **Verify OTP**: `POST /api/auth/verify` (Body: `{ "email": "...", "otp": "..." }`)

### Password Login
- `POST /api/auth/login-password` (Body: `{ "email": "...", "password": "..." }`)

---

## 2. Student Reviews (`/src/api/api/reviewApi.js`)
### Public
- **List Published Reviews**: `GET /api/reviews` (Paginated)
- **Get a Single Review**: `GET /api/reviews/{id}`

### User (Login Required)
- **Submit a Review**: `POST /api/reviews`
- **My Reviews**: `GET /api/reviews/me`

### Admin
- **List All Reviews**: `GET /admin/api/reviews`
- **Approve Review**: `POST /admin/api/reviews/{id}/approve`
- **Reject Review**: `POST /admin/api/reviews/{id}/reject`
- **Delete Review**: `DELETE /admin/api/reviews/{id}`

---

## 3. Running Classes & Enrollments (`/src/api/api/runningClassesApi.js`)
### Public
- **List Active Classes**: `GET /api/classes` (Paginated)
- **Get a Single Class**: `GET /api/classes/{id}`

### User (Login Required)
- **Enroll in a Class**: `POST /api/classes/{id}/enroll`
- **My Enrollments**: `GET /api/classes/my-enrollments`
- **Cancel Enrollment**: `POST /api/classes/enrollments/{id}/cancel`

### Admin
- **List All Classes**: `GET /admin/api/classes`
- **Create Class**: `POST /admin/api/classes`
- **Update Class**: `PUT /admin/api/classes/{id}`
- **Delete Class**: `DELETE /admin/api/classes/{id}`
- **List All Enrollments**: `GET /admin/api/classes/enrollments`
- **Confirm Enrollment**: `POST /admin/api/classes/enrollments/{id}/confirm`
- **Reject Enrollment**: `POST /admin/api/classes/enrollments/{id}/reject`
- **Delete Enrollment**: `DELETE /admin/api/classes/enrollments/{id}`

---

## 4. Status Enums

### Review Status
- `PENDING`, `PUBLISHED`, `REJECTED`

### Class Category
- `UNDERGRADUATE`, `POST_GRADUATE`, `PROFESSIONAL`

### Class Status
- `ACTIVE`, `INACTIVE`, `COMPLETED`, `CANCELLED`

### Enrollment Status
- `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`
