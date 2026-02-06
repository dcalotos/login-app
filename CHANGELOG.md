# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-06

### Added
- **E2E Tests in CI/CD** - ChromeDriver configured for GitHub Actions
  - Automatic Chrome installation in CI
  - Service health checks before running tests
  - E2E tests now run on every push
- **Frontend Unit Tests** - Comprehensive test coverage
  - Login component tests
  - Register component tests
  - Forgot password component tests
  - Reset password component tests
  - Dashboard component tests
  - Auth service tests with 100% coverage
  - Frontend tests enabled in CI/CD pipeline
- **Rate Limiting** - API rate limiting with Bucket4j
  - Authentication endpoints: 5 requests per 15 minutes
  - Password reset endpoints: 3 requests per hour
  - Registration endpoint: 3 requests per hour
  - General API endpoints: 100 requests per minute
  - X-Rate-Limit headers in responses
  - Per-IP rate limiting
- **Email Verification** - User email verification system
  - Email verification token entity and repository
  - Verification email sent on registration
  - Verify email endpoint (`/api/auth/verify-email`)
  - Resend verification endpoint (`/api/auth/resend-verification`)
  - Validate verification token endpoint
  - Email verification frontend component (`/verify-email`)
  - 24-hour token expiration
  - Single-use tokens with audit logging

### Changed
- Registration message now includes email verification notice
- Database schema updated with `email_verification_tokens` table
- CI/CD pipeline now runs E2E tests successfully
- Frontend tests now run in CI/CD

### Security
- Rate limiting prevents brute force attacks
- Rate limiting prevents abuse of password reset
- Email verification adds extra security layer
- All verification actions are audit logged

## [1.1.0] - 2026-02-06

### Added
- **Password Reset Feature** - Complete password recovery functionality
  - Forgot password page (`/forgot-password`)
  - Reset password page (`/reset-password?token=xxx`)
  - Email service for sending reset links (logs to console in dev)
  - Password reset token entity and repository
  - Three new API endpoints:
    - `POST /api/auth/forgot-password` - Request password reset
    - `POST /api/auth/reset-password` - Reset password with token
    - `GET /api/auth/validate-reset-token` - Validate reset token
  - Database table `password_reset_tokens` for token storage
  - E2E tests for password reset flow
  - Comprehensive documentation in Confluence

### Changed
- Updated login page with "Forgot password?" link
- Enhanced `AuthService` with password reset methods
- Updated database initialization script

### Security
- UUID-based cryptographically secure tokens
- Time-limited tokens (1 hour expiration)
- Single-use token validation
- BCrypt password hashing for new passwords
- Audit logging for all password reset actions

## [1.0.0] - 2026-02-06

### Added
- Initial release of Login Application
- **Backend (Spring Boot)**
  - JWT authentication system
  - User registration and login
  - Refresh token mechanism
  - User profile management
  - Audit logging
  - PostgreSQL database integration
- **Frontend (Angular 17+)**
  - Login component
  - Registration component
  - Dashboard component
  - Auth guards and interceptors
  - JWT token management
  - Responsive design
- **E2E Tests (WebDriverIO)**
  - Login flow tests
  - Registration flow tests
  - Dashboard access tests
  - BrowserStack integration
  - Mobile testing with Appium
- **DevOps**
  - Docker and Docker Compose setup
  - GitHub Actions CI/CD pipeline
  - Makefile for common tasks
- **Documentation**
  - Complete Confluence documentation (9 pages)
  - README with setup instructions
  - Architecture documentation
  - API documentation
  - Security guide
  - Testing guide
  - Contributing guide

### Security Features
- JWT-based authentication
- BCrypt password hashing
- CORS protection
- SQL injection protection
- XSS protection
- Audit logging

## Links

- [GitHub Repository](https://github.com/dcalotos/login-app)
- [Confluence Documentation](https://danielcaloto202603.atlassian.net/wiki/spaces/ROVODEV/pages/557075)
- [Jira Project](https://danielcaloto202603.atlassian.net/browse/ROVODEV)
