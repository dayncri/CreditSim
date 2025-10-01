# Credit Simulator API

## Overview

The Credit Simulator is a backend API application designed to calculate loan simulations based on customer age, loan amount, and repayment terms. The system provides endpoints for both single and batch loan simulations, calculating monthly payments, total interest, and total payable amounts. Built with TypeScript and Express, the application uses age-based interest rate tiers to determine loan conditions, making it suitable for financial institutions offering personalized credit products.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture

**Framework & Runtime**
- **Technology**: Node.js with Express 5.x
- **Language**: TypeScript with strict type checking
- **Rationale**: Express provides a lightweight, unopinionated framework perfect for RESTful APIs. TypeScript adds type safety and better developer experience for financial calculations where precision is critical.

**Layered Architecture Pattern**
- **Controllers**: Handle HTTP request/response logic and input validation
- **Services**: Contain business logic for loan simulations
- **Utils**: Pure functions for financial calculations (interest rates, payments)
- **Routes**: Define API endpoints and validation rules
- **Rationale**: Clear separation of concerns makes the codebase maintainable and testable. Financial calculation logic is isolated in pure functions for reliability and reusability.

### API Design

**RESTful Endpoints**
- `POST /api/simulate` - Single loan simulation
- `POST /api/simulate/batch` - Batch processing up to 10,000 simulations
- `GET /health` - Health check endpoint
- **Rationale**: RESTful design provides a standard, predictable API structure. Batch endpoint addresses performance requirements for processing multiple simulations efficiently.

**Input Validation**
- Uses `express-validator` for request validation
- Validates loan amounts (positive numbers), birth dates (ISO 8601), and term lengths (1-600 months)
- **Rationale**: Input validation at the route level prevents invalid data from reaching business logic, ensuring data integrity and security.

### Business Logic

**Age-Based Interest Rate Calculation**
- Age ≤ 25: 5% annual rate
- Age 26-40: 3% annual rate
- Age 41-60: 2% annual rate
- Age > 60: 4% annual rate
- **Rationale**: Risk-based pricing model that adjusts interest rates based on customer demographics.

**Financial Calculations**
- Uses standard amortization formulas (PMT calculation)
- Monthly payment: `P * (r * (1 + r)^n) / ((1 + r)^n - 1)`
- Handles zero-interest edge cases
- **Rationale**: Industry-standard loan calculation formulas ensure accuracy and compatibility with financial systems.

**Date Handling**
- Uses `date-fns` library for age calculations
- Handles leap years and edge cases
- **Rationale**: Reliable date library prevents calculation errors in age determination, which directly affects interest rates.

### Testing Strategy

**Test Coverage**
- Unit tests for calculation utilities (age, interest rates, payments)
- Integration tests for API endpoints
- Performance tests for batch processing (100, 1000, 5000 simulations)
- **Test Framework**: Jest with ts-jest preset
- **Rationale**: Comprehensive testing ensures financial calculations are accurate. Performance tests validate scalability requirements.

**Performance Requirements**
- 100 simulations < 5 seconds
- 1000 simulations < 10 seconds
- Supports up to 10,000 batch simulations
- **Rationale**: Performance benchmarks ensure the system can handle production-scale workloads.

### Code Quality

**Linting & Type Safety**
- ESLint with TypeScript plugin
- Strict TypeScript configuration
- **Rationale**: Enforces code consistency and catches errors at compile time, critical for financial applications.

**Build & Development**
- TypeScript compilation to CommonJS
- Nodemon for development hot-reload
- Source maps for debugging
- **Rationale**: Developer productivity tools while maintaining production-ready compilation.

## External Dependencies

### Core Dependencies

**Express.js (v5.1.0)**
- Purpose: Web framework for REST API
- Used for: HTTP server, routing, middleware

**TypeScript (v5.9.3)**
- Purpose: Static typing and compilation
- Used for: Type safety across the codebase

**date-fns (v4.1.0)**
- Purpose: Date manipulation and calculations
- Used for: Age calculation from birth dates
- Alternative considered: moment.js (rejected due to larger bundle size)

### Validation & Testing

**express-validator (v7.2.1)**
- Purpose: Request validation middleware
- Used for: Input sanitization and validation on API endpoints

**Jest (v30.2.0) + ts-jest (v29.4.4)**
- Purpose: Testing framework
- Used for: Unit tests, integration tests, and performance tests

**supertest (v7.1.4)**
- Purpose: HTTP assertion library
- Used for: API endpoint testing

### Development Tools

**ESLint (v9.36.0) + TypeScript ESLint**
- Purpose: Code linting and style enforcement
- Configuration: Recommended TypeScript rules with custom overrides

**Nodemon (v3.1.10)**
- Purpose: Development file watcher
- Used for: Auto-reloading during development

**ts-node (v10.9.2)**
- Purpose: TypeScript execution
- Used for: Running TypeScript directly in development mode

### Data Storage

**Current State**: No database integration
- All calculations are stateless and performed in-memory
- No persistence layer implemented
- **Note**: The application could integrate a database (e.g., with Drizzle ORM and PostgreSQL) for storing simulation history, user data, or audit logs in future iterations.

### External Services

**None currently integrated**
- No third-party APIs
- No external authentication services
- No payment gateways
- Self-contained calculation engine