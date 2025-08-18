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
├── config/
│   ├── prisma.ts        # Prisma client initialization and connection testing
│   └── database.ts      # Legacy MySQL2 connection (being phased out)
├── models/
│   └── stock.ts         # Stock data model using Prisma
├── public/
│   ├── types.ts         # Shared TypeScript interfaces
│   ├── utils.ts         # Utility functions for validation and response formatting
│   └── const.ts         # API endpoint constants
├── prisma/
│   └── schema.prisma    # Database schema definition
└── server.ts            # Main Express application entry point
```

### Database Architecture
- Uses Prisma as the primary ORM for MySQL database
- Single `Stock` model for inventory management
- Database URL configured via `DATABASE_URL` environment variable
- Connection testing on server startup

### API Design
- RESTful API following `/api/v1/stock` pattern
- Consistent response format with `ApiResponse<T>` interface
- Error handling with appropriate HTTP status codes
- Request validation using utility functions

### Development Workflow
- Pre-commit hooks run TypeScript type checking and ESLint
- All code must pass type checking before commits
- Prettier formatting is enforced
- Environment variables managed via `.env` file

## Key Implementation Details

### Prisma Integration
- Global Prisma client instance with development-mode singleton pattern
- Connection testing function `testPrismaConnection()` for health checks
- Schema uses MySQL-specific field types and constraints

### API Endpoints
- `GET /api/v1/stock` - List all items, filter by id or name
- `POST /api/v1/stock/count/add` - Add to item count (max 20 limit)
- `POST /api/v1/stock/count/delete` - Subtract from item count (min 0 limit)

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint configuration with TypeScript rules
- Prettier for consistent formatting
- Husky pre-commit hooks ensure code quality before commits