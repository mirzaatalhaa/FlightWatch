# FlightWatch - Database Schema

## Overview

The FlightWatch database is designed to support user authentication, aircraft sighting management, analytics, and future feature expansion. The schema follows normalization principles to reduce redundancy while maintaining simplicity for a production-style web application.

---

# Database Engine

**Database:** PostgreSQL

**Version:** PostgreSQL 15+

**Character Set:** UTF-8

---

# Entity Relationship Diagram (ERD)

```text
┌─────────────┐
│    users    │
└──────┬──────┘
       │ 1
       │
       │
       │ N
┌──────▼────────┐
│  sightings    │
└───────────────┘
```

A single user can create multiple aircraft sightings.

Each sighting belongs to exactly one user.

---

# Table: users

Stores user account information and authentication data.

## Schema

| Column        | Type         | Constraints               |
| ------------- | ------------ | ------------------------- |
| id            | UUID         | PRIMARY KEY               |
| name          | VARCHAR(100) | NOT NULL                  |
| email         | VARCHAR(255) | UNIQUE, NOT NULL          |
| password_hash | TEXT         | NOT NULL                  |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

---

## SQL Definition

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Table: sightings

Stores aircraft sightings recorded by users.

## Schema

| Column        | Type         | Constraints               |
| ------------- | ------------ | ------------------------- |
| id            | UUID         | PRIMARY KEY               |
| user_id       | UUID         | FOREIGN KEY               |
| registration  | VARCHAR(20)  | NOT NULL                  |
| airline       | VARCHAR(100) | NOT NULL                  |
| aircraft_type | VARCHAR(100) | NOT NULL                  |
| airport       | VARCHAR(100) | NOT NULL                  |
| notes         | TEXT         | NULL                      |
| sighting_date | TIMESTAMP    | NOT NULL                  |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

---

## SQL Definition

```sql
CREATE TABLE sightings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    registration VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(100) NOT NULL,
    airport VARCHAR(100) NOT NULL,
    notes TEXT,
    sighting_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

---

# Relationship Design

## User → Sightings

Relationship Type:

```text
One-to-Many
```

Meaning:

```text
One User
      |
      ├── Sighting 1
      ├── Sighting 2
      ├── Sighting 3
      └── Sighting N
```

If a user account is deleted, all associated sightings should also be removed automatically.

---

# Indexing Strategy

To improve query performance, the following indexes will be created.

## Email Lookup

```sql
CREATE INDEX idx_users_email
ON users(email);
```

Used during:

* Login
* Registration validation

---

## User Sighting Queries

```sql
CREATE INDEX idx_sightings_user_id
ON sightings(user_id);
```

Used when retrieving all sightings for a user.

---

## Registration Search

```sql
CREATE INDEX idx_sightings_registration
ON sightings(registration);
```

Used for aircraft registration searches.

---

## Airline Search

```sql
CREATE INDEX idx_sightings_airline
ON sightings(airline);
```

Used for airline filtering.

---

# Example Data

## User

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Talha",
  "email": "talha@example.com"
}
```

---

## Sighting

```json
{
  "id": "e74f0eb5-fb16-4f72-9e98-111111111111",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "registration": "A6-EQB",
  "airline": "Emirates",
  "aircraft_type": "Airbus A380",
  "airport": "COK",
  "notes": "Observed during departure.",
  "sighting_date": "2026-06-11T14:30:00Z"
}
```

---

# Future Enhancements

The schema is intentionally simple for Version 1.

Future versions may introduce:

## airports

```text
id
icao_code
iata_code
name
country
```

## airlines

```text
id
name
icao_code
iata_code
country
```

## aircraft

```text
id
registration
manufacturer
model
operator
```

## photos

```text
id
sighting_id
image_url
uploaded_at
```

Images could be stored in AWS S3 while metadata remains in PostgreSQL.

---

# Design Decisions

1. UUIDs are used as primary keys to improve scalability and avoid predictable identifiers.
2. Passwords are never stored in plain text and will be hashed using bcrypt.
3. PostgreSQL serves as the single source of truth for application data.
4. The schema prioritizes simplicity and maintainability for a production-style learning project.
5. Additional normalization can be introduced in future versions without major schema redesign.
