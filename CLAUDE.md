# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Docker Development (Recommended)

```bash
# Start entire application stack
docker-compose up

# Stop all services
docker-compose down

# Rebuild and start (after dependency changes)
docker-compose up --build
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint with auto-fix
```

### Backend (NestJS)

```bash
cd backend
npm install
npm run dev          # Development server with watch mode
npm run build        # Production build
npm run start:prod   # Production server
npm run create-admin # Create admin user manually
npm run lint         # ESLint with auto-fix
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Test coverage
```

## Architecture Overview

This is a full-stack QR code management application for chalet rentals with the following structure:

### Backend (NestJS + MongoDB)

- **Port**: 5042
- **Database**: MongoDB (port 27017)
- **Authentication**: JWT with HTTP-only cookies
- **Core Modules**:
  - `AuthModule`: JWT authentication with Passport strategies
  - `ChaletModule`: CRUD operations for chalets
  - `PageModule`: Content management for QR pages
  - `PdfModule`: QR code and PDF generation using Puppeteer

**Key Files:**

- `src/app.module.ts`: Main application module configuration
- `src/schemas/`: MongoDB schemas (User, Chalet, Page)
- `src/controllers/`: REST API endpoints
- `src/services/`: Business logic layer
- `src/strategies/`: Passport authentication strategies

### Frontend (Next.js + React)

- **Port**: 3000
- **UI Framework**: HeroUI + Tailwind CSS
- **State Management**: Zustand with persistence
- **Authentication**: Token-based with HTTP-only cookies
- **Editor**: TipTap for rich text editing

**Key Files:**

- `app/layout.tsx`: Root layout with navigation
- `lib/auth-store.ts`: Zustand store for authentication state
- `lib/services/`: API service layer
- `components/`: Reusable UI components

### Database Models

- **Users**: Admin authentication
- **Chalets**: Property information and management
- **Pages**: Content pages linked to chalets via QR codes

## Environment Setup

### Required Environment Variables

**Backend (.env)**:

```env
NODE_ENV=development
PORT=5042
MONGODB_URI=mongodb://database:27017/pere-sapin
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://frontend:3000
```

**Frontend (.env.local)**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5042
```

## Development Workflow

### Default Admin Account

- Email: `admin@pere-sapin.com`
- Password: `admin123`

### API Proxy

The frontend uses Next.js API routes as a proxy to the backend:

- Frontend API calls go to `/api/proxy/*`
- These are forwarded to the backend at `http://localhost:5042`

### Code Quality

- Both frontend and backend use ESLint with TypeScript
- Prettier for code formatting
- Frontend has comprehensive linting rules including React, accessibility, and import ordering
- Backend uses NestJS-standard ESLint configuration

### Testing

- Backend: Jest for unit and e2e testing
- Test files: `*.spec.ts` and `*.e2e-spec.ts`
- Coverage reports available via `npm run test:cov`

## Key Features

- Chalet management with CRUD operations
- Dynamic page creation with rich text editor
- Automatic QR code generation for each page
- PDF generation for QR codes using Puppeteer
- Responsive design optimized for mobile QR code scanning
- JWT authentication with secure HTTP-only cookies
- Multi-language support (French)
