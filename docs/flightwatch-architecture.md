# FlightWatch — System Architecture

## Overview

FlightWatch follows a cloud-native architecture that separates the frontend, networking, application, and data layers. The frontend is delivered through Amazon S3 and CloudFront, while DNS is managed through Route 53. Infrastructure is provisioned using Terraform.

```text
Users
   │
   ▼
Route 53
   │
   ▼
CloudFront CDN
   │
   ▼
Amazon S3 Static Website Hosting
   │
   ▼
React Frontend
```

---

## Frontend Architecture

### Component: React Frontend

**Responsibilities:**

* User interface rendering
* Authentication screens
* Dashboard display
* Aircraft sighting management
* API communication

**Technologies:**

* React
* React Router
* Axios
* Vite

### Deployment Flow

```text
React Source Code
        │
        ▼
npm run build
        │
        ▼
dist/
        │
        ▼
Amazon S3
        │
        ▼
CloudFront
        │
        ▼
Users
```

---

## DNS & Content Delivery Layer

### Amazon Route 53

**Responsibilities:**

* DNS management
* Domain resolution
* Routing traffic to CloudFront

**Domain:**

* flight-watch.xyz

### Amazon CloudFront

**Responsibilities:**

* Global content delivery
* HTTPS termination
* Asset caching
* Reduced latency

**Benefits:**

* Faster content delivery
* Improved performance worldwide
* Secure HTTPS access
* Reduced load on the origin

---

## Storage Layer

### Amazon S3

**Responsibilities:**

* Static website hosting
* Frontend asset storage
* Build artifact hosting

**Hosted Content:**

* HTML
* CSS
* JavaScript
* Images
* Static assets

---

## SSL/TLS Architecture

### AWS Certificate Manager (ACM)

**Responsibilities:**

* SSL/TLS certificate management
* Automatic certificate renewal
* HTTPS support for CloudFront

**Domains Covered:**

* flight-watch.xyz
* *.flight-watch.xyz

---

## Planned Application Architecture

The backend and database layers will be added in a future phase.

```text
Users
   │
   ▼
Route 53
   │
   ▼
CloudFront
   │
   ├── S3 Frontend
   │
   └── Backend API
            │
            ▼
         PostgreSQL
```

### Planned Backend

**Component:** Node.js / Express API

**Responsibilities:**

* Authentication and authorization
* Business logic
* Input validation
* Database interaction
* API responses

**Technologies:**

* Node.js
* Express.js
* JWT
* bcrypt

---

### Planned Database

**Component:** PostgreSQL

**Responsibilities:**

* Persistent data storage
* Query processing
* Relationship management
* Data integrity

**Stored Data:**

* Users
* Aircraft sightings
* Analytics data

---

## AWS Infrastructure Architecture

Current Terraform-managed resources:

```text
AWS
│
├── VPC
│   ├── Public Subnet
│   ├── Internet Gateway
│   ├── Route Table
│   └── Security Group
│
├── S3 Bucket
│   └── Static Website Hosting
│
├── CloudFront Distribution
│
├── Route 53 Hosted Zone
│
└── ACM Certificate
```

---

## Infrastructure as Code (Terraform)

Terraform manages all infrastructure provisioning, ensuring environments are reproducible and version-controlled.

### Managed Resources

* VPC
* Public Subnet
* Internet Gateway
* Route Tables
* Route Table Associations
* Security Groups
* S3 Bucket
* S3 Website Configuration
* S3 Bucket Policies
* CloudFront Distribution
* Route 53 Hosted Zone
* ACM Certificate

### Benefits

* Reproducible infrastructure
* Version-controlled configuration
* Automated environment creation
* Consistent deployments
* Reduced manual configuration

---

## CI/CD Pipeline (Planned)

```text
Developer
    │
    ▼ git push
GitHub Repository
    │
    ▼
GitHub Actions
    ├── Build Frontend
    ├── Run Tests
    ├── Deploy to S3
    ├── Invalidate CloudFront Cache
    └── Publish New Version
            │
            ▼
Application Updated
```

---

## Security Design

| Control                 | Description                                         |
| ----------------------- | --------------------------------------------------- |
| Security Groups         | Restrict network traffic within the VPC             |
| HTTPS                   | Enforced through CloudFront and ACM                 |
| Route 53 DNS Management | Centralized DNS control                             |
| Terraform               | Infrastructure changes tracked in source control    |
| Environment Variables   | Sensitive values stored outside source code         |
| ACM Certificates        | Managed SSL/TLS certificates with automatic renewal |

---

## Future Enhancements

### Backend Infrastructure

* Node.js / Express API
* PostgreSQL Database
* RDS PostgreSQL

### Security

* Private Subnets
* NAT Gateway
* AWS WAF
* Secrets Manager

### Monitoring

* Amazon CloudWatch
* Application logging
* Alarms and notifications

### Scalability

* Application Load Balancer
* ECS/Fargate
* Auto Scaling

### Reliability

* Automated backups
* Multi-AZ database deployment
* Disaster recovery planning

### DevOps

* GitHub Actions CI/CD
* Automated Terraform deployments
* Multi-environment infrastructure (Dev, Staging, Production)

```
```
