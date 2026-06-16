# FlightWatch — Requirements Specification

---

## Functional Requirements

### Authentication

#### FR-001 — User Registration

The system shall allow users to create an account using:

* Name
* Email address
* Password

#### FR-002 — User Login

The system shall allow registered users to authenticate using their credentials.

#### FR-003 — Session Security

The system shall issue JSON Web Tokens (JWT) for authenticated sessions.

---

### Aircraft Sighting Management

#### FR-004 — Create Sighting

The system shall allow authenticated users to create a new aircraft sighting.

| Field                 | Required |
| --------------------- | -------- |
| Aircraft Registration | ✅        |
| Airline               | ✅        |
| Aircraft Type         | ✅        |
| Airport               | ✅        |
| Sighting Date         | ✅        |
| Notes                 | Optional |

#### FR-005 — View Sightings

The system shall allow users to view all previously recorded sightings.

#### FR-006 — Edit Sighting

The system shall allow users to modify existing sighting records.

#### FR-007 — Delete Sighting

The system shall allow users to remove sighting records.

#### FR-008 — Search Sightings

The system shall allow users to search sightings by:

* Registration
* Airline
* Aircraft Type
* Airport

---

### Dashboard & Analytics

#### FR-009 — Statistics Dashboard

The system shall display:

* Total sightings
* Unique aircraft count
* Unique airline count
* Most frequently spotted airline
* Most frequently spotted aircraft type

---

### User Data Protection

#### FR-010 — User Isolation

Users shall only be able to access their own records.

---

## Non-Functional Requirements

### Performance

#### NFR-001 — Response Time

API requests should respond within two seconds under normal load.

#### NFR-002 — Frontend Performance

Static assets should be delivered through Amazon CloudFront to minimize latency and improve page load times.

---

### Availability

#### NFR-003 — Service Availability

The frontend application should remain available through CloudFront and Amazon S3 website hosting.

---

### Security

#### NFR-004 — Password Security

Passwords must be stored using bcrypt hashing.

#### NFR-005 — Protected Routes

Authenticated API endpoints must require a valid JWT token.

#### NFR-006 — HTTPS Encryption

All public traffic must be encrypted using SSL/TLS certificates managed through AWS Certificate Manager (ACM).

#### NFR-007 — DNS Security

DNS records shall be managed through Amazon Route 53.

---

### Scalability

#### NFR-008 — Layer Separation

Frontend, backend, and database components shall remain logically separated to support future scaling.

#### NFR-009 — Cloud-Native Architecture

Application services shall be designed to support migration to managed AWS services and distributed deployments.

---

### Maintainability

#### NFR-010 — Source Control

All source code shall be maintained in Git repositories.

#### NFR-011 — Infrastructure as Code

Infrastructure must be provisioned and managed using Terraform.

#### NFR-012 — Modular Infrastructure

Terraform configurations should be organized to support future infrastructure expansion.

---

### Reliability

#### NFR-013 — Persistent Data Storage

Application data shall be stored in PostgreSQL and persist independently of application deployments.

#### NFR-014 — Managed DNS

Domain resolution shall be managed through Route 53 hosted zones.

#### NFR-015 — Global Content Delivery

Frontend assets shall be distributed through CloudFront edge locations.

---

### Deployment

#### NFR-016 — Automated Deployment

Code changes merged into the main branch should trigger automated deployment workflows through GitHub Actions.

#### NFR-017 — Frontend Deployment

Frontend build artifacts shall be deployed to Amazon S3.

#### NFR-018 — Infrastructure Automation

Infrastructure changes shall be deployed through Terraform.

---

## Assumptions

* Users have internet connectivity.
* AWS services are operational.
* GitHub Actions runners are available.
* Route 53 is configured as the authoritative DNS provider.
* ACM certificates are available for public HTTPS access.

---

## Constraints

* AWS promotional credits and budget-conscious resource usage will be prioritized.
* A single production environment will be maintained initially.
* PostgreSQL will be deployed as a single database instance during the initial phase.
* Infrastructure will be provisioned through Terraform.
* Frontend hosting will utilize Amazon S3 and CloudFront.

---

## Current Scope

### Completed

* Terraform networking infrastructure
* VPC creation
* Public subnet configuration
* Internet Gateway configuration
* Route table configuration
* Security group configuration
* S3 static website hosting
* CloudFront CDN deployment
* Route 53 hosted zone configuration
* ACM certificate request and DNS validation setup

### Planned

* Node.js / Express backend deployment
* PostgreSQL database deployment
* User authentication
* Aircraft sighting management APIs
* Analytics dashboard
* GitHub Actions CI/CD pipeline
* CloudWatch monitoring and logging
