# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server from compiled code
- `npm run typecheck` - Run TypeScript type checking without compilation
- `npm run lint` - Run ESLint on all files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Database Commands

- `npx prisma generate` - Generate Prisma Client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management

## Architecture Overview

### Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL with Prisma ORM
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks

### Project Structure

```
src/
├── app.ts                    # Express application setup and middleware configuration
├── server.ts                 # Server startup and database connection
├── config/
│   ├── prisma.ts            # Prisma client initialization and connection testing
│   └── database.ts          # Legacy MySQL2 connection (being phased out)
├── routes/
│   ├── index.ts             # Main API router configuration
│   └── stock.ts             # Stock-specific route definitions
├── controllers/
│   └── stockController.ts    # Request handling and response formatting
├── services/
│   └── stockService.ts       # Business logic and data manipulation
├── models/
│   └── stock.ts             # Prisma data models and database operations
├── middlewares/
│   └── errorMiddleware.ts    # Error handling and 404 responses
├── validators/
│   └── stockValidator.ts     # Input validation functions
└── utils/
    ├── types.ts             # TypeScript interfaces and type definitions
    ├── utils.ts             # Utility functions for validation and response formatting
    └── const.ts             # API endpoint constants and configuration
```

### MVC Architecture

- **Controllers**: Handle HTTP requests, validate inputs, and format responses
- **Services**: Contain business logic, data validation, and cross-cutting concerns
- **Models**: Prisma-based data access layer with type-safe database operations
- **Routes**: Express routing configuration with clean URL structure
- **Middlewares**: Error handling, request processing, and cross-cutting concerns

### API Design

- RESTful API following `/api/v1` base path structure
- Consistent response format using `ApiResponse<T>` interface
- Centralized error handling with appropriate HTTP status codes
- Input validation separated into dedicated validator functions
- Route definitions use modular router pattern

### Database Architecture

- Single `Stock` model for inventory management
- Prisma ORM with MySQL database backend
- Global Prisma client instance with development-mode singleton pattern
- Database URL configured via `DATABASE_URL` environment variable
- Connection testing function `testPrismaConnection()` for health checks

### Development Workflow

- Pre-commit hooks ensure TypeScript type checking and ESLint compliance
- ES modules with `.js` file extensions in imports for proper TypeScript compilation
- Environment variables managed via `.env` file
- Build outputs to `dist/` directory with preserved source structure

## Key Implementation Details

### API Endpoints

- `GET /api/v1/stock` - List all items, optionally filter by `id` or `name` query parameters
- `POST /api/v1/stock/count/add` - Add to item count (enforces max limit of 20)
- `POST /api/v1/stock/count/delete` - Subtract from item count (enforces min limit of 0)

### Error Handling

- Centralized error middleware catches and formats all errors
- Controllers use try-catch blocks with specific error handling for business logic violations
- Services throw descriptive errors that controllers translate to appropriate HTTP status codes
- 404 handler for undefined routes

### Type Safety

- Strict TypeScript configuration with comprehensive type checking
- Interface definitions for API requests/responses in `src/utils/types.ts`
- Prisma generates type-safe database client from schema
- Controllers and services use explicit return type annotations
