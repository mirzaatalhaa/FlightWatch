# FlightWatch — Requirements Specification

---

## Functional Requirements

### Authentication

#### FR-001 — User Registration
The system shall allow users to create an account using:
- Name
- Email address
- Password

#### FR-002 — User Login
The system shall allow registered users to authenticate using their credentials.

#### FR-003 — Session Security
The system shall issue JSON Web Tokens (JWT) for authenticated sessions.

---

### Aircraft Sighting Management

#### FR-004 — Create Sighting
The system shall allow authenticated users to create a new aircraft sighting.

| Field | Required |
|---|---|
| Aircraft Registration | ✅ |
| Airline | ✅ |
| Aircraft Type | ✅ |
| Airport | ✅ |
| Sighting Date | ✅ |
| Notes | Optional |

#### FR-005 — View Sightings
The system shall allow users to view all of their previously recorded sightings.

#### FR-006 — Edit Sighting
The system shall allow users to modify existing sighting records.

#### FR-007 — Delete Sighting
The system shall allow users to remove sighting records.

#### FR-008 — Search Sightings
The system shall allow users to search sightings by:
- Registration
- Airline
- Aircraft Type
- Airport

---

### Dashboard

#### FR-009 — Statistics Dashboard
The system shall display:
- Total sightings
- Unique aircraft count
- Unique airline count
- Most frequently spotted airline
- Most frequently spotted aircraft type

---

### User Data Protection

#### FR-010 — User Isolation
Users shall only be able to access their own records.

---

## Non-Functional Requirements

### Performance

#### NFR-001 — Response Time
API requests should respond within two seconds under normal load.

### Availability

#### NFR-002 — Service Availability
The application should remain operational while the EC2 instance is running.

### Security

#### NFR-003 — Password Security
Passwords must be stored using bcrypt hashing.

#### NFR-004 — Protected Routes
Authenticated endpoints must require a valid JWT token.

### Scalability

#### NFR-005 — Modular Architecture
Application layers must remain independent to support future scaling.

### Maintainability

#### NFR-006 — Source Control
All code shall be maintained in Git.

#### NFR-007 — Infrastructure as Code
Infrastructure must be defined using Terraform.

### Reliability

#### NFR-008 — Containerized Deployment
Application services must run inside Docker containers.

#### NFR-009 — Persistent Data Storage
PostgreSQL data must persist through Docker volumes.

### Deployment

#### NFR-010 — Automated Deployment
Code changes merged to the main branch should trigger automated deployment through GitHub Actions.

---

## Assumptions

- Users have internet connectivity.
- AWS infrastructure is operational.
- Docker is installed on the deployment server.
- GitHub Actions runners are available.

---

## Constraints

- AWS Free Tier resources will be used whenever possible.
- Single EC2 instance deployment.
- Single PostgreSQL instance.
- Budget-conscious infrastructure design.
