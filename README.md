# FlightWatch ✈️

FlightWatch is a web application for plane spotters to log and track aircraft sightings. It combines a React frontend, a Node.js/Express backend, and real-time aviation data, deployed on a production-style AWS architecture.

🔗 **Live demo:** [https://flight-watch.xyz](https://flight-watch.xyz)

---

## Screenshots

<!-- Add screenshots below. Recommended: dashboard, sighting log form, aircraft details view, login/register screens -->

| | |
|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Sighting Log](./screenshots/sighting-log.png) |
| ![Aircraft Details](./screenshots/aircraft-details.png) | ![Login](./screenshots/login.png) |

---

## Features

- Log and track aircraft sightings with timestamps and location data
- Integration with external aviation data APIs for live aircraft information
- User registration and authentication
- Persistent sighting history backed by PostgreSQL
- Responsive React frontend

## Tech Stack

**Frontend**
- React
- Hosted on S3, delivered via CloudFront

**Backend**
- Node.js + Express
- Dockerized, deployed on EC2
- Nginx as a reverse proxy
- Let's Encrypt SSL certificate

**Database**
- PostgreSQL on Amazon RDS (private subnet)

**Infrastructure**
- Terraform (Infrastructure as Code)
- Docker & Docker Compose

## Architecture

![FlightWatch architecture overview](./screenshots/architecture-diagram.png)

The diagram above covers the full request flow: the frontend is hosted on S3 and delivered via CloudFront, the backend runs in a Docker container on EC2 behind an Nginx reverse proxy secured with Let's Encrypt, and PostgreSQL runs on RDS in private subnets that are not publicly accessible. Route 53 manages DNS for the custom domain and API subdomain.

## AWS Services Used

- EC2
- RDS PostgreSQL
- S3
- CloudFront
- Route 53
- ACM (Certificate Manager)
- VPC
- Security Groups
- Internet Gateway

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (or use the provided Docker container)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/flightwatch.git
   cd flightwatch
   ```

2. Set up environment variables
   ```bash
   cp .env.example .env
   # Fill in your database credentials and API keys
   ```

3. Start the application with Docker Compose
   ```bash
   docker-compose up --build
   ```

4. The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`

## Infrastructure (Terraform)

The `infrastructure/` directory contains Terraform configuration for provisioning the AWS resources described above, including the VPC, subnets, security groups, EC2 instance, RDS instance, S3 bucket, CloudFront distribution, Route 53 records, and ACM certificate.

```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

## Further enhancements

- Monitoring
- CI/CD

---