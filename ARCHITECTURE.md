# Login Application - Architecture Documentation

## Overview

This document describes the architecture of the Login Application, a full-stack application demonstrating modern best practices for authentication and authorization.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Angular Frontend (Port 4200)               │    │
│  │  - Components (Login, Register, Dashboard)          │    │
│  │  - Services (Auth, User)                            │    │
│  │  - Guards (Auth Guard)                              │    │
│  │  - Interceptors (Auth, Error)                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        Spring Boot Backend (Port 8080)              │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │           Controllers                        │   │    │
│  │  │  - AuthController                           │   │    │
│  │  │  - UserController                           │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │            Services                          │   │    │
│  │  │  - AuthService                              │   │    │
│  │  │  - UserService                              │   │    │
│  │  │  - RefreshTokenService                      │   │    │
│  │  │  - AuditLogService                          │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │           Security Layer                     │   │    │
│  │  │  - JWT Token Provider                       │   │    │
│  │  │  - Authentication Filter                    │   │    │
│  │  │  - User Details Service                     │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │          Data Access Layer                   │   │    │
│  │  │  - UserRepository                           │   │    │
│  │  │  - RefreshTokenRepository                   │   │    │
│  │  │  - AuditLogRepository                       │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JDBC
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         PostgreSQL Database (Port 5432)             │    │
│  │  - users                                            │    │
│  │  - refresh_tokens                                   │    │
│  │  - audit_logs                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Testing Layer                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │     WebDriverIO E2E Tests                           │    │
│  │  - Local Browser Tests                              │    │
│  │  - BrowserStack Tests                               │    │
│  │  - Mobile App Tests (Appium)                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Angular 17+
- **Language**: TypeScript
- **State Management**: Signals (Angular)
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Styling**: CSS3

### Backend
- **Framework**: Spring Boot 3.2+
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database Access**: Spring Data JPA
- **Database**: PostgreSQL 15+
- **Build Tool**: Maven

### Testing
- **E2E Framework**: WebDriverIO 8
- **Mobile Testing**: Appium
- **Cloud Testing**: BrowserStack
- **Reporting**: Allure

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend)

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   │
   ├─> Frontend sends POST /api/auth/login
   │
   ├─> Backend validates credentials
   │
   ├─> Backend generates JWT access token
   │
   ├─> Backend generates refresh token
   │
   ├─> Backend stores refresh token in database
   │
   └─> Backend returns tokens + user info

2. Authenticated requests
   │
   ├─> Frontend includes JWT in Authorization header
   │
   ├─> Backend validates JWT
   │
   ├─> Backend extracts user from JWT
   │
   └─> Backend processes request

3. Token refresh
   │
   ├─> Frontend sends refresh token
   │
   ├─> Backend validates refresh token
   │
   ├─> Backend generates new access token
   │
   └─> Backend returns new access token
```

### Security Features

1. **Password Hashing**: BCrypt with configurable strength
2. **JWT Tokens**: Stateless authentication with expiration
3. **Refresh Tokens**: Long-lived tokens stored in database
4. **CORS Protection**: Configurable allowed origins
5. **SQL Injection Protection**: JPA with parameterized queries
6. **XSS Protection**: Angular sanitization + security headers
7. **CSRF Protection**: Not needed for stateless JWT
8. **Audit Logging**: All authentication actions logged

## Data Model

### Users Table
```sql
users
├── id (BIGINT, PK)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, hashed)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── last_login (TIMESTAMP)
├── is_active (BOOLEAN)
└── is_verified (BOOLEAN)
```

### Refresh Tokens Table
```sql
refresh_tokens
├── id (BIGINT, PK)
├── user_id (BIGINT, FK -> users.id)
├── token (VARCHAR, UNIQUE)
├── expiry_date (TIMESTAMP)
└── created_at (TIMESTAMP)
```

### Audit Logs Table
```sql
audit_logs
├── id (BIGINT, PK)
├── user_id (BIGINT, FK -> users.id)
├── action (VARCHAR)
├── details (TEXT)
├── ip_address (VARCHAR)
└── created_at (TIMESTAMP)
```

## API Design

### RESTful Principles

- **Resources**: users, auth
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500
- **Content Type**: application/json

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/logout | Logout user | Yes |
| POST | /api/auth/refresh | Refresh access token | No |
| GET | /api/auth/me | Get current user | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/users/profile | Get user profile | Yes |
| PUT | /api/users/profile | Update user profile | Yes |

## Frontend Architecture

### Component Structure

```
app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── models/
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts
│       └── user.service.ts
└── features/
    ├── auth/
    │   ├── login/
    │   └── register/
    └── dashboard/
```

### State Management

- **Signals**: Used for reactive state management
- **LocalStorage**: Token and user persistence
- **Services**: Centralized state and business logic

### Routing Strategy

- **Lazy Loading**: Feature modules loaded on demand
- **Route Guards**: Protect authenticated routes
- **Redirects**: Automatic redirect to login if not authenticated

## Testing Strategy

### Unit Tests
- Backend: JUnit + Mockito
- Frontend: Jasmine + Karma

### Integration Tests
- Backend: Spring Boot Test
- Database: H2 in-memory for tests

### E2E Tests
- WebDriverIO for browser automation
- Page Object Model pattern
- BrowserStack for cross-browser testing
- Appium for mobile app testing

### Test Coverage
- Unit tests: Business logic and services
- Integration tests: API endpoints
- E2E tests: User workflows

## Deployment Architecture

### Docker Containers

```
login-app/
├── postgres (Database)
├── backend (Spring Boot)
└── frontend (Nginx + Angular)
```

### Environment Configuration

- **Development**: Local with hot reload
- **Testing**: Docker Compose
- **Production**: Docker with external database

## Performance Considerations

### Backend
- Connection pooling
- JPA second-level cache (if needed)
- Database indexes on frequently queried columns
- Efficient JWT validation

### Frontend
- Lazy loading
- Angular production build optimizations
- Nginx gzip compression
- Static asset caching

### Database
- Indexes on username, email
- Indexes on foreign keys
- Periodic cleanup of expired refresh tokens

## Scalability

### Horizontal Scaling
- Stateless backend (can add multiple instances)
- Load balancer for backend instances
- Shared database or read replicas

### Vertical Scaling
- Increase container resources
- Database optimization
- Connection pool tuning

## Monitoring and Logging

### Backend
- Spring Boot Actuator for health checks
- Structured logging
- Audit logs for security events

### Frontend
- Error interceptor for API errors
- Console logging (disabled in production)

### Database
- PostgreSQL logs
- Query performance monitoring

## Future Enhancements

### Security
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Password reset flow
- [ ] Account lockout after failed attempts
- [ ] Role-based access control (RBAC)

### Features
- [ ] User profile with avatar
- [ ] Social login (OAuth2)
- [ ] Session management (view/revoke sessions)
- [ ] Password strength requirements
- [ ] Remember me functionality

### DevOps
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Centralized logging (ELK stack)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] API documentation (Swagger/OpenAPI)

## Best Practices Implemented

1. **Separation of Concerns**: Clear layering (Controller → Service → Repository)
2. **DRY Principle**: Reusable components and services
3. **SOLID Principles**: Especially Single Responsibility
4. **Security First**: Authentication, authorization, input validation
5. **Error Handling**: Global exception handlers
6. **Code Quality**: Consistent naming, formatting, comments
7. **Testing**: Comprehensive test coverage
8. **Documentation**: README files, code comments, this document

## Atlassian Integration

- **Jira Project**: ROVODEV
- **Confluence Site**: https://danielcaloto202603.atlassian.net/
- Used for project tracking and documentation
