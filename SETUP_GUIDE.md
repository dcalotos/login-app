# Login Application - Setup Guide

Complete guide to set up and run the Login Application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Manual Setup](#manual-setup)
4. [Configuration](#configuration)
5. [Running Tests](#running-tests)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- **Docker & Docker Compose** (recommended) OR:
  - Node.js 18+
  - Java 17+
  - PostgreSQL 15+
  - Maven 3.8+

### Optional (for E2E testing)
- BrowserStack account
- Appium (for mobile testing)
- Android SDK / Xcode

## Quick Start (Docker)

The fastest way to run the complete application:

```bash
# Clone or navigate to the project directory
cd login-app

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

Access the application:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

Default test user:
- Username: `testuser`
- Password: `Test123!`

### Stop Services

```bash
docker-compose down

# Remove volumes (delete all data)
docker-compose down -v
```

## Manual Setup

### 1. Database Setup

#### Option A: Using Docker

```bash
docker run --name loginapp-postgres \
  -e POSTGRES_DB=loginapp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb loginapp

# Or using psql
psql -U postgres
CREATE DATABASE loginapp;
\q
```

Run initialization script:

```bash
psql -U postgres -d loginapp -f docker/init-db.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run the application
./mvnw spring-boot:run
```

Backend will start on http://localhost:8080

#### Build JAR (Optional)

```bash
./mvnw clean package
java -jar target/login-backend-1.0.0.jar
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

Frontend will start on http://localhost:4200

#### Build for Production

```bash
npm run build:prod
```

Output will be in `dist/login-frontend/`

### 4. E2E Tests Setup

```bash
cd e2e-tests

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run tests
npm test
```

## Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loginapp
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-must-be-at-least-256-bits-long-change-this-in-production
CORS_ORIGINS=http://localhost:4200,http://localhost:4201
LOG_LEVEL=INFO
```

### Frontend Configuration

Edit `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### E2E Tests Configuration

Edit `e2e-tests/.env`:

```env
BASE_URL=http://localhost:4200
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
TEST_USERNAME=testuser
TEST_PASSWORD=Test123!
```

## Running Tests

### Backend Unit Tests

```bash
cd backend
./mvnw test
```

### Frontend Unit Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
cd e2e-tests

# Local browser tests
npm run test:local

# BrowserStack tests
npm run test:browserstack

# Mobile tests
npm run test:mobile
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Health Check

- `GET /actuator/health` - Backend health status

## Default Users

The database is initialized with a test user:

- **Username**: testuser
- **Email**: test@example.com
- **Password**: Test123!

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find and kill process
lsof -i :8080
kill -9 <PID>
```

**Database connection failed:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**JWT token errors:**
- Ensure JWT_SECRET is at least 256 bits (32 characters)

### Frontend Issues

**Port 4200 already in use:**
```bash
# Use different port
ng serve --port 4201
```

**CORS errors:**
- Verify backend CORS_ORIGINS includes your frontend URL
- Check backend is running

### Docker Issues

**Containers won't start:**
```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose up --build
```

**Database persistence:**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect login-app_postgres-data
```

### E2E Test Issues

**Tests fail to start:**
- Ensure frontend and backend are running
- Check BASE_URL in `.env`
- Verify test user exists in database

**BrowserStack tests fail:**
- Check credentials
- Verify account has available sessions

**Mobile tests fail:**
- Ensure Appium is installed
- Check Android SDK / Xcode setup
- Verify emulator/simulator is running

## Security Notes

### Production Deployment

Before deploying to production:

1. **Change JWT Secret**: Use a strong, random 256-bit key
2. **Use HTTPS**: Configure SSL/TLS certificates
3. **Update CORS**: Restrict origins to your domain
4. **Database Security**: Use strong passwords, restrict access
5. **Environment Variables**: Never commit secrets to version control
6. **Update Dependencies**: Keep all dependencies up to date

### Environment Variables

Never commit these files:
- `.env`
- `.env.local`
- Any file containing credentials

Always use `.env.example` as template.

## Atlassian Integration

This project is configured for:
- **Jira Project**: ROVODEV
- **Atlassian Site**: https://danielcaloto202603.atlassian.net/

## Support

For issues or questions:
1. Check this setup guide
2. Review README.md files in each directory
3. Check application logs
4. Review error messages and stack traces

## Next Steps

After setup:
1. Test the application manually
2. Run all test suites
3. Review code structure
4. Customize for your needs
5. Set up CI/CD pipeline
6. Deploy to production environment
