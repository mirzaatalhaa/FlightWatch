# FlightWatch — System Architecture

## Overview

FlightWatch follows a **three-tier architecture** that separates concerns across presentation, application, and data layers. This separation improves maintainability, scalability, and security.

```
Internet
    │
    ▼
Nginx Reverse Proxy
    │
    ▼
React Frontend
    │
    ▼
Node.js / Express API
    │
    ▼
PostgreSQL Database
```

---

## Tier 1 — Presentation Layer

**Component:** React Frontend

**Responsibilities:**
- User interface rendering
- Authentication forms
- Dashboard display
- Sighting management screens
- API communication

**Technologies:** React, React Router, Axios

> The frontend communicates exclusively with the backend API and never directly accesses the database.

---

## Tier 2 — Application Layer

**Component:** Node.js / Express Backend

**Responsibilities:**
- Authentication and authorization
- Business logic
- Input validation
- Database interaction
- API responses

**Technologies:** Node.js, Express.js, JWT, bcrypt

> The backend acts as an intermediary between the frontend and the database.

---

## Tier 3 — Data Layer

**Component:** PostgreSQL

**Responsibilities:**
- Persistent data storage
- Query processing
- Relationship management
- Data integrity

**Stored Data:**
- Users
- Aircraft sightings
- Analytics data

---

## Infrastructure Architecture

All services are deployed within a single AWS VPC, contained in a public subnet on an EC2 instance running Docker Compose.

```
AWS
│
└── VPC
    └── Public Subnet
        └── EC2 Instance
            └── Docker Compose
                ├── Nginx Container
                ├── Frontend Container
                ├── Backend Container
                └── PostgreSQL Container
```

---

## Docker Architecture

Each service runs in its own isolated container.

| Container | Service | Responsibilities |
|---|---|---|
| 1 | Nginx Reverse Proxy | Receive incoming traffic, route frontend and API requests |
| 2 | React Frontend | Render UI, handle user interactions |
| 3 | Node.js Backend | Process API requests, execute business logic |
| 4 | PostgreSQL | Store application data |

---

## CI/CD Pipeline

```
Developer
    │
    ▼ git push
GitHub Repository
    │
    ▼
GitHub Actions
    ├── Run Tests
    ├── Build Application
    ├── Deploy to EC2
    └── Restart Containers
    │
    ▼
Application Updated
```

---

## Infrastructure as Code (Terraform)

Terraform manages all infrastructure provisioning, ensuring environments are reproducible and version-controlled.

**Managed Resources:**
- VPC
- Public Subnet
- Internet Gateway
- Route Tables
- Security Groups
- EC2 Instance

**Benefits:**
- Reproducible infrastructure
- Version-controlled configuration
- Automated environment creation
- Consistent deployments across environments

---

## Security Design

| Control | Description |
|---|---|
| Security Groups | Restrict inbound/outbound traffic at the network level |
| JWT Authentication | Stateless token-based auth for API requests |
| Password Hashing | Passwords hashed with bcrypt before storage |
| Environment Variables | Secrets and config kept out of source code |
| Restricted DB Access | PostgreSQL is not publicly accessible; reachable only from the backend container |

---

## Future Enhancements

**Security & Networking**
- HTTPS via SSL/TLS

**Storage & Media**
- AWS S3 for photo uploads

**Observability**
- CloudWatch dashboards
- Monitoring and alerting

**Scalability**
- Load balancing
- ECS migration
- Multi-environment deployments

**Reliability**
- Automated backups

**Infrastructure**
- Infrastructure modules (Terraform)
