# Real Estate App

Welcome to the **Real Estate App**! This is a modern, scalable web application designed to manage real estate listings and provide a seamless experience for agents and clients alike.

---

## 🚀 **Tech Stack**

This project uses the following technologies:

- **Frontend**: React, React Router, Redux, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB (NoSQL Database)
- **Caching**: Redis
- **Storage**: AWS S3 (for storing images and documents)
- **Authentication**: JWT (JSON Web Token)
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **Continuous Integration**: GitHub Actions (or other CI/CD pipelines)

---

## 🌐 **Features**

- **User Authentication**: Secure login and registration system with JWT tokens.
- **Real Estate Listings**: Manage properties including details like images, pricing, and descriptions.
- **Image Storage**: All property images are securely stored on AWS S3.
- **Fast Data Access**: Use of Redis to cache frequently requested data and improve performance.
- **Mobile-Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.

---

## 🛠️ **Installation**

### Clone the Repository

```bash

git clone https://github.com/jfbenitezz/real-estate-app.git
cd real-estate-app

# MongoDB URI for your database
MONGO_URI=mongodb://localhost:27017/real-estate-db

# Redis connection details
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3 Credentials
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Application port
PORT=5000

