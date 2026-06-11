# FlightWatch — Project Overview

---

## Introduction

FlightWatch is a cloud-native aircraft spotting logbook application designed for aviation enthusiasts to record, organize, and analyze aircraft sightings. The platform allows users to create personal accounts, maintain a history of aircraft sightings, add notes and observations, and view analytics related to their spotting activities.

The primary objective of this project is not only to develop a functional web application but also to implement and operate it using modern cloud and DevOps practices. The project follows a production-style three-tier architecture and is deployed on Amazon Web Services (AWS) using Infrastructure as Code (IaC), containerization, and CI/CD pipelines.

---

## Problem Statement

Aircraft spotters often maintain logs using spreadsheets, notebooks, or disconnected tools. These solutions lack centralized data management, analytics, search capabilities, and accessibility across devices.

FlightWatch addresses this by providing a centralized web-based platform where users can:
- Record aircraft sightings
- Store detailed observations
- Search historical records
- Analyze spotting statistics
- Access their data from anywhere

---

## Project Goals

- Build a complete full-stack web application
- Implement a three-tier architecture
- Provision cloud infrastructure using Terraform
- Containerize application services using Docker
- Automate testing, building, and deployment using GitHub Actions
- Deploy and operate the application on AWS EC2
- Implement secure authentication and authorization
- Follow production-oriented software engineering practices

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, React Router, Axios |
| **Backend** | Node.js, Express.js, JWT, bcrypt |
| **Database** | PostgreSQL |
| **Infrastructure** | AWS VPC, EC2, Security Groups, Internet Gateway, Route Tables |
| **DevOps** | Terraform, Docker, Docker Compose, GitHub Actions |
| **Monitoring** | CloudWatch Logs, EC2 Monitoring |

---

## Application Features

### User Management
- User registration and login
- Secure JWT-based authentication
- User-specific data isolation

### Aircraft Sighting Management
- Create, edit, and delete sighting records
- Search and filter sightings

### Dashboard
- Total sightings count
- Most spotted airline and aircraft type
- Airport statistics
- Activity overview

---

## Deployment Strategy

- The application runs on a Linux-based EC2 instance.
- All services are containerized and managed with Docker Compose.
- GitHub Actions automates testing, building, and deployment on every push to the main branch.

---

## Learning Objectives

This project provides practical experience in:
- Cloud infrastructure and Infrastructure as Code
- Linux administration
- Containerization and CI/CD pipelines
- Backend development and database design
- Production deployments and system architecture

---

## Success Criteria

The project will be considered successful when:

- [ ] Infrastructure can be provisioned entirely through Terraform
- [ ] Application services run successfully within Docker containers
- [ ] CI/CD pipelines automatically deploy updates
- [ ] Users can authenticate and manage aircraft sightings
- [ ] PostgreSQL stores persistent application data
- [ ] The application is accessible through a public endpoint on AWS
