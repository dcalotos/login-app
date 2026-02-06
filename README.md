# Login Application

Full-stack login application with Angular frontend, Spring Boot backend, PostgreSQL database, and WebDriverIO testing.

## Architecture

- **Frontend**: Angular 17+ with TypeScript
- **Backend**: Java 17 + Spring Boot 3.x
- **Database**: PostgreSQL 15+
- **Testing**: TypeScript + WebDriverIO + Appium (BrowserStack support)

## Project Structure

```
.
├── frontend/          # Angular application
├── backend/           # Spring Boot application
├── e2e-tests/         # WebDriverIO tests
├── docker/            # Docker configuration
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- PostgreSQL 15+
- Docker and Docker Compose (optional)
- Maven 3.8+

## Quick Start with Docker

```bash
docker-compose up -d
```

## Manual Setup

### Database Setup

```bash
# Create database
createdb loginapp

# Or using psql
psql -U postgres
CREATE DATABASE loginapp;
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend will run on http://localhost:8080

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:4200

### E2E Tests Setup

```bash
cd e2e-tests
npm install
npm test
```

## Configuration

### Environment Variables

Create `.env` files in respective directories:

**Backend** (backend/.env):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loginapp
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend** (frontend/src/environments/):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**E2E Tests** (e2e-tests/.env):
```
BASE_URL=http://localhost:4200
BROWSERSTACK_USERNAME=your-username
BROWSERSTACK_ACCESS_KEY=your-access-key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Testing

### Unit Tests

```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
```

### E2E Tests

```bash
cd e2e-tests

# Local execution
npm run test:local

# BrowserStack execution
npm run test:browserstack

# Mobile app testing with Appium
npm run test:mobile
```

## Security Features

- JWT-based authentication
- Password hashing with BCrypt
- CORS configuration
- SQL injection protection
- XSS protection

## Atlassian Integration

- **Jira Project**: ROVODEV
- **Site**: https://danielcaloto202603.atlassian.net/

## License

MIT
