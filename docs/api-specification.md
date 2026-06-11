# FlightWatch - API Specification

## Overview

This document defines the REST API contract for the FlightWatch application.

The API follows REST principles and uses JSON for all request and response payloads.

Base URL:

```text
/api
```

Authentication is handled using JSON Web Tokens (JWT).

---

# Authentication

## Register User

Creates a new user account.

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Talha",
  "email": "talha@example.com",
  "password": "StrongPassword123"
}
```

### Success Response

**201 Created**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Talha",
    "email": "talha@example.com"
  }
}
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Invalid request data"
}
```

**409 Conflict**

```json
{
  "message": "Email already exists"
}
```

---

## Login User

Authenticates a user and returns a JWT.

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "talha@example.com",
  "password": "StrongPassword123"
}
```

### Success Response

**200 OK**

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Talha",
    "email": "talha@example.com"
  }
}
```

### Error Response

**401 Unauthorized**

```json
{
  "message": "Invalid credentials"
}
```

---

## Get User Profile

Returns the currently authenticated user's profile.

### Endpoint

```http
GET /api/auth/profile
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Success Response

**200 OK**

```json
{
  "id": "uuid",
  "name": "Talha",
  "email": "talha@example.com",
  "createdAt": "2026-06-11T10:00:00Z"
}
```

### Error Response

**401 Unauthorized**

```json
{
  "message": "Token required"
}
```

---

# Sightings

## Create Sighting

Creates a new aircraft sighting.

### Endpoint

```http
POST /api/sightings
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Request Body

```json
{
  "registration": "A6-EQB",
  "airline": "Emirates",
  "aircraftType": "Airbus A380",
  "airport": "COK",
  "notes": "Observed during departure",
  "sightingDate": "2026-06-11T14:30:00Z"
}
```

### Success Response

**201 Created**

```json
{
  "message": "Sighting created successfully",
  "id": "uuid"
}
```

---

## Get All Sightings

Returns all sightings belonging to the authenticated user.

### Endpoint

```http
GET /api/sightings
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Success Response

**200 OK**

```json
[
  {
    "id": "uuid",
    "registration": "A6-EQB",
    "airline": "Emirates",
    "aircraftType": "Airbus A380",
    "airport": "COK",
    "sightingDate": "2026-06-11T14:30:00Z"
  }
]
```

---

## Get Single Sighting

Returns one sighting by ID.

### Endpoint

```http
GET /api/sightings/:id
```

### Example

```http
GET /api/sightings/123
```

### Success Response

**200 OK**

```json
{
  "id": "uuid",
  "registration": "A6-EQB",
  "airline": "Emirates",
  "aircraftType": "Airbus A380",
  "airport": "COK",
  "notes": "Observed during departure",
  "sightingDate": "2026-06-11T14:30:00Z"
}
```

### Error Response

**404 Not Found**

```json
{
  "message": "Sighting not found"
}
```

---

## Update Sighting

Updates an existing sighting.

### Endpoint

```http
PUT /api/sightings/:id
```

### Request Body

```json
{
  "registration": "A6-EQB",
  "airline": "Emirates",
  "aircraftType": "Airbus A380",
  "airport": "DXB",
  "notes": "Updated note"
}
```

### Success Response

**200 OK**

```json
{
  "message": "Sighting updated successfully"
}
```

---

## Delete Sighting

Deletes a sighting.

### Endpoint

```http
DELETE /api/sightings/:id
```

### Success Response

**200 OK**

```json
{
  "message": "Sighting deleted successfully"
}
```

---

# Dashboard

## Get Dashboard Statistics

Returns summary statistics for the authenticated user.

### Endpoint

```http
GET /api/dashboard/stats
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Success Response

**200 OK**

```json
{
  "totalSightings": 48,
  "uniqueAircraft": 32,
  "uniqueAirlines": 11,
  "mostSpottedAirline": "Emirates",
  "mostSpottedAircraft": "Boeing 737"
}
```

---

# Health Check

Used for monitoring and deployment validation.

### Endpoint

```http
GET /api/health
```

### Success Response

**200 OK**

```json
{
  "status": "healthy",
  "service": "flightwatch-api",
  "timestamp": "2026-06-11T12:00:00Z"
}
```

This endpoint will be used by:

* Docker health checks
* GitHub Actions deployment verification
* Future monitoring systems

---

# Authentication Flow

```text
Register
   |
Login
   |
Receive JWT
   |
Store Token
   |
Attach Token to Requests
   |
Access Protected Routes
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# Future Endpoints

Version 2 may include:

```http
POST /api/photos
GET  /api/photos

GET  /api/airports

GET  /api/airlines

GET  /api/analytics/monthly

GET  /api/analytics/top-airlines
```

These endpoints are intentionally excluded from Version 1 to keep the initial release focused and manageable.
