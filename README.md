# ✈️ FlightWatch (in-progress)

FlightWatch is a full-stack aircraft sighting application that allows aviation enthusiasts to record, manage, and explore aircraft sightings. The project is deployed on AWS using Infrastructure as Code (Terraform) and follows a production-style architecture with a React frontend, Node.js backend, and PostgreSQL database.

## 🌐 Live Demo

- Frontend: https://flight-watch.xyz
- API: https://api.flight-watch.xyz

---

# 🏗️ Architecture

```text
User
  │
  ▼
Route 53
  │
  ▼
CloudFront
  │
  ▼
S3 Static Website
(React Frontend)

User
  │
  ▼
api.flight-watch.xyz
  │
  ▼
Nginx Reverse Proxy
  │
  ▼
Docker Container
(Node.js + Express Backend)
  │
  ▼
Amazon RDS PostgreSQL
(Private Subnets)
```

---

# ☁️ AWS Services Used

- Amazon EC2
- Amazon RDS (PostgreSQL)
- Amazon S3
- Amazon CloudFront
- Amazon Route 53
- AWS Certificate Manager (ACM)
- Amazon VPC
- Security Groups
- Internet Gateway

---

# 🚀 Features

- User Registration & Authentication
- JWT-Based Authorization
- Record Aircraft Sightings
- View Aircraft Sightings
- PostgreSQL Database Storage
- Responsive React Frontend
- HTTPS Enabled
- Custom Domain Configuration
- Dockerized Backend
- Infrastructure as Code with Terraform

---

# 🛠️ Tech Stack

### Frontend
- React
- Vite
- Context API
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt

### Database
- PostgreSQL

### Infrastructure
- Terraform
- AWS
- Docker
- Nginx

---

# 📁 Project Structure

```text
FlightWatch/
│
├── app/
│   ├── frontend/
│   │   ├── src/
│   │   └── public/
│   │
│   └── backend/
│       ├── src/
│       ├── database/
│       └── Dockerfile
│
├── terraform/
│   ├── vpc.tf
│   ├── ec2.tf
│   ├── rds.tf
│   ├── s3.tf
│   ├── cloudfront.tf
│   └── route53.tf
│
└── docker-compose.yml
```

---

# 🔐 Security

### Database Security

- RDS is deployed inside private subnets.
- Database is not publicly accessible.
- Access is restricted through Security Groups.

### HTTPS

Frontend:

```text
https://flight-watch.xyz
```

secured using:

- AWS ACM
- CloudFront

Backend:

```text
https://api.flight-watch.xyz
```

secured using:

- Nginx
- Let's Encrypt SSL Certificate

---

# 🐳 Backend Deployment

Clone repository:

```bash
git clone https://github.com/mirzaatalhaa/FlightWatch.git
cd FlightWatch
```

Build Docker image:

```bash
docker build -t flightwatch-backend ./app/backend
```

Run container:

```bash
docker run -d \
  --name flightwatch-backend \
  -p 5000:5000 \
  --env-file app/backend/.env \
  flightwatch-backend
```

---

# 🗄️ Database Setup

Apply schema:

```bash
psql "<DATABASE_URL>" < app/backend/database/schema.sql
```

Verify tables:

```sql
\dt
```

Expected:

```text
users
sightings
```

---

# 🏗️ Infrastructure Deployment

Initialize Terraform:

```bash
terraform init
```

Review changes:

```bash
terraform plan
```

Deploy infrastructure:

```bash
terraform apply
```

---

# 📚 Key Learnings

This project provided hands-on experience with:

- Infrastructure as Code (Terraform)
- AWS Networking
- VPC Design
- Public and Private Subnets
- Security Groups
- Docker Containerization
- PostgreSQL on RDS
- Reverse Proxy Configuration with Nginx
- DNS Management with Route 53
- CloudFront Content Delivery
- SSL/TLS Configuration
- Production Deployment Workflows
- Debugging Real-World Infrastructure Issues

---

# 🔧 Challenges Solved

### bcrypt Docker Issue

Problem:

```text
bcrypt_lib.node: Exec format error
```

Cause:

```text
Windows node_modules were copied into the Linux container.
```

Solution:

```text
Excluded node_modules from Docker build context and rebuilt
dependencies inside the Linux container.
```

---

### RDS SSL Connection Issue

Problem:

```text
no pg_hba.conf entry for host ...
```

Cause:

```text
RDS required encrypted connections.
```

Solution:

```text
Enabled SSL support in PostgreSQL connection configuration.
```

---

# 🚀 Future Improvements

- GitHub Actions CI/CD
- AWS Secrets Manager
- CloudWatch Monitoring
- Application Load Balancer
- ECS/Fargate Deployment
- Automated Backend Deployments
- Infrastructure Modularization
- Enhanced Analytics Dashboard




---

⭐ If you found this project interesting, consider starring the repository.
