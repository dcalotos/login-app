# Login Application - Backend

Spring Boot REST API for authentication and user management.

## Technology Stack

- Java 17
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Tokens)
- Maven

## Project Structure

```
src/main/java/com/loginapp/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── controller/          # REST Controllers
│   ├── AuthController.java
│   └── UserController.java
├── dto/                 # Data Transfer Objects
├── entity/              # JPA Entities
│   ├── User.java
│   ├── RefreshToken.java
│   └── AuditLog.java
├── exception/           # Exception handling
├── repository/          # Data repositories
├── security/            # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── service/             # Business logic
    ├── AuthService.java
    ├── UserService.java
    └── RefreshTokenService.java
```

## Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 15+

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Run

```bash
./mvnw spring-boot:run
```

### Build

```bash
./mvnw clean package
```

### Test

```bash
./mvnw test
```

## API Documentation

See main [README.md](../README.md) for API endpoints.

## Security

- Passwords are hashed using BCrypt
- JWT tokens for stateless authentication
- Refresh tokens stored in database
- CORS protection
- Request validation
