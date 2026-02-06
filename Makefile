# Makefile for Login Application

.PHONY: help up down build clean test install logs restart

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

build: ## Build all services
	docker-compose build

clean: ## Clean and remove all containers, volumes, and images
	docker-compose down -v --rmi all

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && ./mvnw test
	@echo "Running frontend tests..."
	cd frontend && npm test -- --watch=false
	@echo "Running E2E tests..."
	cd e2e-tests && npm test

install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && ./mvnw dependency:resolve
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing E2E test dependencies..."
	cd e2e-tests && npm install

logs: ## Show logs from all services
	docker-compose logs -f

restart: down up ## Restart all services

backend-run: ## Run backend locally
	cd backend && ./mvnw spring-boot:run

frontend-run: ## Run frontend locally
	cd frontend && npm start

db-init: ## Initialize database
	psql -U postgres -d loginapp -f docker/init-db.sql

docker-backend: ## Build backend Docker image
	cd backend && docker build -t loginapp-backend:latest .

docker-frontend: ## Build frontend Docker image
	cd frontend && docker build -t loginapp-frontend:latest .

e2e-local: ## Run E2E tests locally
	cd e2e-tests && npm run test:local

e2e-browserstack: ## Run E2E tests on BrowserStack
	cd e2e-tests && npm run test:browserstack
