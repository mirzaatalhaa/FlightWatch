# FlightWatch — Project Overview

---

## Introduction

FlightWatch is a cloud-native aircraft spotting logbook application designed for aviation enthusiasts to record, organize, and analyze aircraft sightings. The platform allows users to create personal accounts, maintain a history of aircraft sightings, add notes and observations, and view analytics related to their spotting activities.

The project serves two purposes:

1. Build a full-stack web application for aircraft spotting enthusiasts.
2. Demonstrate real-world cloud engineering, DevOps, and infrastructure automation practices using Amazon Web Services (AWS).

FlightWatch is being deployed using a modern cloud-native architecture with Infrastructure as Code (IaC), content delivery networks (CDNs), DNS management, SSL/TLS certificates, and automated deployment pipelines.

---

## Problem Statement

Aircraft spotters often maintain logs using spreadsheets, notebooks, or disconnected tools. These solutions lack centralized data management, analytics capabilities, search functionality, and accessibility across devices.

FlightWatch addresses these limitations by providing a centralized web platform where users can:

* Record aircraft sightings
* Store detailed observations
* Search historical records
* Analyze spotting statistics
* Access data from any device with an internet connection

---

## Project Goals

* Build a complete full-stack web application
* Implement a cloud-native architecture on AWS
* Provision infrastructure using Terraform
* Deploy a React frontend using Amazon S3 and CloudFront
* Implement secure DNS management with Route 53
* Configure HTTPS using AWS Certificate Manager (ACM)
* Automate deployments using GitHub Actions
* Develop a secure Node.js/Express backend API
* Implement PostgreSQL data storage
* Follow production-oriented cloud engineering and DevOps practices

---

## Technology Stack

| Layer                      | Technologies                                                  |
| -------------------------- | ------------------------------------------------------------- |
| **Frontend**               | React, React Router, Axios, Vite                              |
| **Backend**                | Node.js, Express.js, JWT, bcrypt                              |
| **Database**               | PostgreSQL                                                    |
| **Cloud Platform**         | AWS                                                           |
| **Networking**             | VPC, Subnets, Internet Gateway, Route Tables, Security Groups |
| **Frontend Hosting**       | Amazon S3                                                     |
| **Content Delivery**       | Amazon CloudFront                                             |
| **DNS Management**         | Amazon Route 53                                               |
| **SSL/TLS**                | AWS Certificate Manager (ACM)                                 |
| **Infrastructure as Code** | Terraform                                                     |
| **CI/CD**                  | GitHub Actions                                                |
| **Monitoring**             | Amazon CloudWatch                                             |

---

## Current Architecture

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
Amazon S3
   │
   ▼
React Frontend
```

### Current AWS Resources

* Virtual Private Cloud (VPC)
* Public Subnet
* Internet Gateway
* Route Tables
* Security Groups
* Amazon S3 Static Website Hosting
* CloudFront Distribution
* Route 53 Hosted Zone
* ACM SSL/TLS Certificate

---

## Planned Full Architecture

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

---

## Application Features

### User Management

* User registration and login
* Secure JWT-based authentication
* User-specific data isolation

### Aircraft Sighting Management

* Create, edit, and delete sighting records
* Search and filter sightings
* Maintain personal spotting history

### Dashboard & Analytics

* Total sightings count
* Most spotted airline
* Most spotted aircraft type
* Airport statistics
* Activity overview

---

## Deployment Strategy

### Current Deployment

* React frontend is built using Vite
* Static assets are hosted in Amazon S3
* CloudFront distributes content globally
* Route 53 manages DNS records
* ACM provides SSL/TLS certificates
* Infrastructure is managed through Terraform

### Planned Deployment Enhancements

* GitHub Actions automated deployments
* Backend API deployment
* Database deployment
* Automated cache invalidation
* Multi-environment support

---

## Learning Objectives

This project provides hands-on experience in:

### Cloud Engineering

* AWS networking fundamentals
* DNS management
* Content delivery networks
* SSL/TLS certificate management
* Infrastructure as Code

### DevOps

* Terraform
* GitHub Actions
* CI/CD pipelines
* Automated deployments

### Software Engineering

* Full-stack development
* API development
* Database design
* Authentication and authorization

### Solutions Architecture

* Cloud-native application design
* Service separation
* Scalability planning
* Security best practices

---

## Success Criteria

The project will be considered successful when:

* [x] Infrastructure can be provisioned through Terraform
* [x] Frontend is hosted using Amazon S3
* [x] Content is delivered through CloudFront
* [x] DNS is managed using Route 53
* [ ] SSL/TLS certificate is fully attached to CloudFront
* [ ] Custom domain is accessible via HTTPS
* [ ] GitHub Actions automates deployments
* [ ] Backend API is deployed and operational
* [ ] PostgreSQL stores persistent application data
* [ ] Users can authenticate and manage aircraft sightings
* [ ] Monitoring and logging are implemented through CloudWatch

---

## Project Status

### Completed

* AWS account setup
* Terraform project initialization
* Custom VPC creation
* Public subnet creation
* Internet Gateway configuration
* Route table configuration
* Security group creation
* S3 static website hosting
* CloudFront distribution deployment
* Route 53 hosted zone creation
* ACM certificate request and DNS validation setup
* Frontend deployment

### In Progress

* ACM certificate validation
* Custom domain integration

### Planned

* Backend API deployment
* PostgreSQL database deployment
* CI/CD pipeline implementation
* CloudWatch monitoring
* Production hardening
