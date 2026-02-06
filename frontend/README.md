# Login Application - Frontend

Angular single-page application for user authentication.

## Technology Stack

- Angular 17+
- TypeScript
- RxJS
- Angular Signals
- CSS3

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Business services
│   └── features/
│       ├── auth/
│       │   ├── login/
│       │   └── register/
│       └── dashboard/
├── environments/            # Environment configs
└── styles.css              # Global styles
```

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to http://localhost:4200

### Build

```bash
# Development
npm run build

# Production
npm run build:prod
```

### Test

```bash
npm test
```

## Features

- User registration
- User login
- Protected routes
- JWT token management
- Auto token refresh
- Error handling
- Responsive design

## Architecture

- **Standalone Components**: Using Angular standalone API
- **Signals**: For reactive state management
- **Interceptors**: JWT token injection and error handling
- **Guards**: Route protection
- **Services**: Centralized business logic
