# Login Application

[![CI/CD Pipeline](https://github.com/dcalotos/login-app/actions/workflows/ci.yml/badge.svg)](https://github.com/dcalotos/login-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Full-stack login application with Angular frontend, Spring Boot backend, PostgreSQL database, and WebDriverIO testing.

## 📦 Repository

**GitHub**: [dcalotos/login-app](https://github.com/dcalotos/login-app)

## 🔗 Resources

- **GitHub Repository**: https://github.com/dcalotos/login-app
- **CI/CD Pipeline**: https://github.com/dcalotos/login-app/actions
- **Confluence Documentation**: https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV
- **Jira Project**: https://danielcaloto202603.atlassian.net/browse/ROVODEV

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

Backend will run on http://localhost:8081

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
  apiUrl: 'http://localhost:8081/api'
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

## CI/CD

The project includes a GitHub Actions workflow that automatically:
- Runs backend tests
- Runs frontend tests
- Runs E2E tests
- Builds Docker images

View the pipeline: [GitHub Actions](https://github.com/dcalotos/login-app/actions)

## Documentation

Complete documentation is available in Confluence:
- [📖 Full Documentation](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/557075)
- [🚀 Quick Start Guide](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/786433)
- [🏗️ Architecture & Design](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/753665)
- [⚙️ Setup & Installation](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/819202)
- [🔌 API Documentation](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/851969)
- [🔒 Security](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/884738)
- [🧪 Testing Guide](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/917505)
- [🐳 DevOps & Deployment](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/950274)
- [🤝 Contributing Guide](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/983041)

## Atlassian Integration

- **Jira Project**: [ROVODEV](https://danielcaloto202603.atlassian.net/browse/ROVODEV)
- **Confluence Space**: [ROVODEV](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV)
- **Site**: https://danielcaloto202603.atlassian.net/

## Contributing

Contributions are welcome! Please read the [Contributing Guide](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/983041) for details on our code of conduct and the process for submitting pull requests.

## License

MIT

## Support

If you need help:
1. Check the [documentation](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV)
2. Search [GitHub Issues](https://github.com/dcalotos/login-app/issues)
3. Search [Jira Issues](https://danielcaloto202603.atlassian.net/browse/ROVODEV)
4. Create a new issue

---

**Created**: February 2026  
**Maintained By**: Development Team
