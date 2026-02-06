# Quick Start Guide

Get the Login Application running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed

## Steps

### 1. Start the Application

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080
- Frontend on port 4200

### 2. Wait for Services

Wait about 30 seconds for all services to start and be healthy.

Check status:
```bash
docker-compose ps
```

### 3. Access the Application

Open your browser and navigate to:
**http://localhost:4200**

### 4. Test Login

Use the default test user:
- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `Test123!`

### 5. Create New Account

Click "Sign up" and register a new user with:
- Username (min 3 characters)
- Email
- Password (min 8 characters)
- Optional: First name and Last name

### 6. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 7. Stop the Application

```bash
docker-compose down
```

## Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :4200
lsof -i :8080
lsof -i :5432

# Rebuild containers
docker-compose up --build -d
```

### Database issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### View container logs
```bash
docker-compose logs backend
```

## What's Next?

- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for manual setup
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details
- Explore [README.md](README.md) for full documentation
- Run tests (see [e2e-tests/README.md](e2e-tests/README.md))

## API Testing

Test the API directly:

```bash
# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "Password123!"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'

# Health check
curl http://localhost:8080/actuator/health
```

## Configuration

### Change Ports

Edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "4201:80"  # Change 4200 to 4201
  
  backend:
    ports:
      - "8081:8080"  # Change 8080 to 8081
```

### Environment Variables

Create `.env` file:

```env
# Database
POSTGRES_DB=loginapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Backend
JWT_SECRET=your-jwt-secret-at-least-256-bits

# Frontend
API_URL=http://localhost:8080/api
```

## Atlassian Integration

This project is configured for:
- **Jira Project**: ROVODEV
- **Site**: https://danielcaloto202603.atlassian.net/

Track issues and progress in Jira!

## Need Help?

- Check logs: `docker-compose logs -f`
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Open an issue on GitHub
