# 🚀 Product Management API

[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0+-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)](https://www.postgresql.org/)

---

## 📖 Overview

This project supports **CRUD operations** using **Node.js** and **Express framework** for products. It not only provides an API but also creates a **skeleton for project structure and data flow** which can be applied in real projects to help **improve code quality and development process**.

The project demonstrates:
- ✅ **Clean Architecture**: Separation of concerns with Controller → Service → Repository pattern
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Database Management**: Prisma ORM with PostgreSQL
- ✅ **Testing**: Unit and E2E tests with Jest
- ✅ **Docker Support**: Containerized application for easy deployment

---

## ✨ Key Features

### 🔧 Core Functionality
- **Resource Management**: Full CRUD operations for products (Create, Read, Update, Delete)
- **Advanced Filtering**: Support for searching, sorting, and pagination using cursor-based
- **Data Validation**: Strong request validation using Zod schema

### 🔐 Security & Authentication
- **Simplified Authentication**: Header-based mock authentication for development ease
- **Role-Based Access Control**: Support for `ADMIN`, `SELLER`, and `USER` roles
- **Security Middleware**: Helmet, CORS, and rate limiting protection

### 🐳 Development Experience
- **Docker Support**: Containerized application and database
- **Hot Reload**: Automatic server restart on code changes
- **API Documentation**: OpenAPI 3.0 specification included
- **Comprehensive Testing**: Unit tests and E2E tests with high coverage

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js v22+ |
| **Language** | TypeScript 5.2+ |
| **Framework** | Express.js 4.18+ |
| **Database** | PostgreSQL 16+ |
| **ORM** | Prisma 7.0+ |
| **Validation** | Zod 3.22+ |
| **Testing** | Jest 29.7+ |
| **Containerization** | Docker & Docker Compose |

### 📦 Key Dependencies
```json
{
  "express": "HTTP server framework",
  "prisma": "Database ORM and migration tool",
  "zod": "Schema validation library",
  "helmet": "Security headers middleware",
  "cors": "Cross-origin resource sharing",
  "express-rate-limit": "Rate limiting middleware",
  "jsonwebtoken": "JWT token handling (future use)"
}
```

---

## 🔐 Security

### Authentication Strategy

To **simplify the demonstration** of core logic without complex authentication setups (like JWT/OAuth), this project uses a **Mock Authentication** mechanism.

#### How It Works

Authentication is handled via **custom HTTP headers**:

| Header | Description | Example |
|--------|-------------|---------|
| `X-User-Id` | The ID of the user performing the request | `1` |
| `X-User-Role` | The role of the user | `ADMIN` \| `SELLER` \| `USER` |

#### Test Users
During initialization, we have seed data to create three test users.
You can use the following test users in your API requests by setting the appropriate headers:

1. **Normal user** - Can view products but has limited permissions
   - Headers: `X-User-Id: 1` and `X-User-Role: USER`

2. **Seller user** - Can create and manage their own products
   - Headers: `X-User-Id: 2` and `X-User-Role: SELLER`

3. **Admin user** - Has full access to all products and operations
   - Headers: `X-User-Id: 3` and `X-User-Role: ADMIN`

#### Example Request
```http
GET /api/v1/products
X-User-Id: 1
X-User-Role: ADMIN
```

> ⚠️ **Important**: In a production environment, this should be replaced with a secure standard like **JWT** or **Session-based authentication**.

### Security Middleware

| Middleware | Purpose |
|------------|---------|
| `helmet` | Sets secure HTTP headers to protect against common vulnerabilities |
| `cors` | Handles Cross-Origin Resource Sharing (CORS) |
| `rateLimit` | Protects against brute-force attacks by limiting requests |

---

## 🏗️ Project Architecture

### 📁 Directory Structure

```
problem_5/
├── src/
│   ├── components/          # Feature-based modules
│   │   ├── base/           # Base classes (Controller, Service, Repository)
│   │   └── products/       # Product feature module
│   │       ├── controller.ts    # HTTP request/response handling
│   │       ├── service.ts       # Business logic
│   │       ├── repository.ts    # Database operations
│   │       ├── routers.ts       # Route definitions
│   │       ├── validation.ts    # Request validation schemas
│   │       ├── policy.ts        # Authorization policies
│   │       └── types.ts         # TypeScript types
│   ├── config/             # Configuration files
│   ├── middlewares/        # Express middlewares
│   ├── errors/             # Custom error classes
│   ├── types/              # Global TypeScript types
│   ├── utils/              # Utility functions
│   ├── routers.ts          # Main router (combines all routes)
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Database seeding script
├── tests/
│   ├── unit/               # Unit tests
│   └── e2e/                # End-to-end tests
├── docker-compose.yml      # Docker services configuration
├── Dockerfile              # Application container
└── openapi.yaml            # API documentation
```

### 🔄 Data Flow

This diagram shows how a request flows through the application:

```
📥 Incoming Request
    ↓
🛡️ Security Middleware (helmet, cors)
    ↓
⏱️ Rate Limiting
    ↓
📦 Body Parsing & Cookie Parsing
    ↓
📝 Request Logger
    ↓
🚦 Router
    ↓
🔗 Route-specific Middleware Chain:
    1️⃣ Authentication (verify X-User-Id & X-User-Role)
    2️⃣ Validation (validate request data with Zod)
    3️⃣ Policy (check user permissions)
    ↓
🎮 Controller (handle HTTP request/response)
    ↓
⚙️ Service (business logic, orchestration)
    ↓
💾 Repository (database operations via Prisma)
    ↓
🔌 Prisma Client
    ↓
🗄️ PostgreSQL Database
    ↓
📤 Response ← Format & Send
    ↓
❌ Error Handler (if error occurs at any stage)
```

### 🧩 Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | Handle HTTP requests and responses | Parse request, call service, format response |
| **Service** | Business logic and orchestration | Validate business rules, coordinate operations |
| **Repository** | Database operations | CRUD operations using Prisma |
| **Validation** | Request data validation | Validate request body, params, query with Zod schemas |
| **Middleware** | Cross-cutting concerns | Authentication, logging, error handling |
| **Policy** | Authorization checks | Verify user has permission for action |

---

## 📚 Development Guide: How to Add New Components

Follow these steps to add a new resource (e.g., `Orders`, `Users`, `Categories`):

### Step 1: Update Prisma Schema

**File**: `prisma/schema.prisma`

Add your new model:

```prisma
model Order {
  id          Int      @id @default(autoincrement())
{{ ... }}
  productId   Int
  userId      Int
  quantity    Int
  totalPrice  Decimal  @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING)
  // other properties...

  @@index([userId])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}
```

Run migration:
```bash
npm run prisma:migrate
```

### Step 2: Create Types

**File**: `src/components/orders/types.ts`

```typescript
import { OrderStatus } from '@prisma/client';
export interface OrderListFilters {
  userId?: number;
  status?: OrderStatus;
  cursor?: number;
  take?: number;
}
```

### Step 3: Create Repository

**File**: `src/components/orders/repository.ts`

```typescript
import { prisma } from '@config/database';
import { BaseRepository } from '@components/base/BaseRepository';
import { Order } from '@prisma/client';

export class OrdersRepository extends BaseRepository<Order> {
  constructor() {
    super(prisma.order);
  }
}
```

### Step 4: Create Service

**File**: `src/components/orders/service.ts`

```typescript
import { BaseService } from '@components/base/BaseService';
import { Order } from '@prisma/client';
import { OrderCreateData, OrderListFilters } from './types';
import { BadRequestError, NotFoundError } from '@/errors';

export class OrderService extends BaseService<Order> {

  async list(filters: OrderListFilters): Promise<Order[]> {
    const { userId, status, cursor, take } = filters;
    return this.repository.findMany({
      where: { userId, status },
      take,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  // Add update() and delete() methods following the same pattern
}
```

### Step 5: Create Controller

**File**: `src/components/orders/controller.ts`

```typescript
import { BaseController } from '@components/base/BaseController';
import { Order } from '@prisma/client';
import { asyncHandler } from '@utils/asyncHandler';
import { Request, Response } from 'express';
import { OrderCreateInput, OrderCreateData } from './types';
import { OrderService } from './service';
import { HttpStatus } from '@config/enums';
import { AuthenticatedRequest } from '@/types/common';

export class OrderController extends BaseController<Order, OrderService> {
  list = asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query;
    const orders = await this.service.list(filters);
    this.success(res, orders, 'Orders found successfully', HttpStatus.OK);
  });
  // Add update(), partialUpdate(), and delete() methods
}
```

### Step 6: Create Validation

**File**: `src/components/orders/validation.ts`

```typescript
import { z } from 'zod';
import { BaseValidation } from '@components/base/BaseValidation';
import { MAX_TAKE, DEFAULT_TAKE } from '@config/constants';
import { OrderStatus } from '@prisma/client';

export class OrderValidation extends BaseValidation {
  // Common schemas
  productIdSchema = z.number().int().positive();
  quantitySchema = z.number().int().positive();
  totalPriceSchema = z.number().positive();
  statusSchema = z.nativeEnum(OrderStatus).optional();

  list = z.object({
    query: z.object({
      userId: z.coerce.number().int().positive().optional(),
      status: this.statusSchema,
      cursor: z.string().optional(),
      take: z.coerce.number().int().positive().max(MAX_TAKE).optional().default(DEFAULT_TAKE),
    }),
  });
}
```

### Step 7: Create Policy

**File**: `src/components/orders/policy.ts`

```typescript
import { BasePolicy } from '@components/base/BasePolicy';
import { Permission } from '@utils/permission';
import { Order } from '@prisma/client';

export class OrderPolicy extends BasePolicy<Order> {
  canList(user: any): boolean {
    return true
  }
}
```

### Step 8: Create Router

**File**: `src/components/orders/routers.ts`

```typescript
import { Router } from 'express';
import { OrderController } from './controller';
import { OrderValidation } from './validation';
import { OrderService } from './service';
import { OrdersRepository } from './repository';
import { OrderPolicy } from './policy';
import { checkPolicy } from '@middlewares/policy';
import { validate } from '@middlewares/validate';

const router = Router();
const repository = new OrdersRepository();
const policy = new OrderPolicy(repository);
const service = new OrderService(repository);
const controller = new OrderController(service);
const validation = new OrderValidation();

router.get(
  '/',
  validate(validation.list),
  checkPolicy(policy.canList.bind(policy)),
  controller.list,
);

export default router;
```

### Step 9: Register Routes

**File**: `src/routers.ts`

```typescript
import orderRouter from './components/orders/routers';

// Add to router configuration
router.use('/api/v1/orders', orderRouter);
```

### ✅ Checklist

- [ ] Update `schema.prisma` with new model
- [ ] Run `npm run prisma:migrate` to create migration
- [ ] Create `types.ts` (TypeScript interfaces)
- [ ] Create `repository.ts` (extends BaseRepository)
- [ ] Create `service.ts` (extends BaseService)
- [ ] Create `controller.ts` (extends BaseController)
- [ ] Create `validation.ts` (extends BaseValidation with Zod schemas)
- [ ] Create `policy.ts` (extends BasePolicy for authorization)
- [ ] Create `routers.ts` (Express routes with middleware chain)
- [ ] Register routes in `src/routers.ts`
- [ ] Write unit tests in `tests/unit/`
- [ ] Write E2E tests in `tests/e2e/`
- [ ] Update OpenAPI documentation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Docker** and **Docker Compose** ([Download](https://www.docker.com/))
- ✅ **Git** ([Download](https://git-scm.com/))

> 💡 **Note**: Docker will handle Node.js, npm, and PostgreSQL automatically. No need to install them separately!

### Quick Start with Docker (Recommended)

This is the **easiest way** to run the application. Docker will set up everything for you.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd problem_5
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   The default `.env.example` values work out of the box with Docker. You can use them as-is:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=user
   DB_PASSWORD=password
   DB_NAME=products

   # Security Configuration
   ALLOWED_ORIGINS=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100

   # Logging
   LOG_LEVEL=info

   # Mock Authentication (for development/testing)
   ENABLE_MOCK_AUTH=false
   ```

3. **Start the application with Docker**
   ```bash
   npm run docker:up
   ```

   This single command will:
   - 🐳 Start PostgreSQL database container
   - 📦 Build the application container
   - 🔄 Generate Prisma Client
   - 🗄️ Run database migrations
   - 🚀 Start the development server

4. **Verify the application is running**

   The API will be available at: **http://localhost:4000**

   Test it with:
   ```bash
   curl http://localhost:4000/api/v1/products \
     -H "X-User-Id: 1" \
     -H "X-User-Role: ADMIN"
   ```

5. **(Optional) Seed the database with sample data**

   If you want to populate the database with test data:
   ```bash
   docker exec -it problem5_app npm run prisma:seed
   ```

### Docker Management Commands

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start all containers (database + app) |
| `npm run docker:down` | Stop and remove all containers |
| `npm run docker:logs` | View application logs |
| `npm run docker:rebuild` | Rebuild and restart containers |

### Stopping the Application

To stop the application:
```bash
npm run docker:down
```

To stop and remove all data (including database):
```bash
docker-compose down -v
```

---

### Alternative: Local Development Setup

If you prefer to run the application locally without Docker:

<details>
<summary>Click to expand local setup instructions</summary>

#### Prerequisites for Local Development

- ✅ **Node.js** v20 or higher ([Download](https://nodejs.org/))
- ✅ **npm** v10 or higher (comes with Node.js)
- ✅ **PostgreSQL** 16+ ([Download](https://www.postgresql.org/))

#### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd problem_5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   Create a database and user:
   ```sql
   CREATE DATABASE products;
   CREATE USER product_user WITH PASSWORD 'U296I0rEdWWnSBjt';
   GRANT ALL PRIVILEGES ON DATABASE products TO product_user;
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your local database configuration.

5. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

7. **Seed the database** (optional)
   ```bash
   npm run prisma:seed
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

</details>
---

## 🏃 Running the Application

### Using Docker (Recommended)

If you've followed the Getting Started guide, your application is already running! If not:

```bash
npm run docker:up
```

**Useful Docker commands:**

```bash
# View real-time logs
npm run docker:logs

# Restart containers
npm run docker:rebuild

# Stop containers
npm run docker:down
```

The API will be available at: **http://localhost:4000**

### Local Development Mode

If you're running locally without Docker:

```bash
npm run dev
```

The server will start at `http://localhost:4000` with hot reload enabled.

### Production Build

For production deployment:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

> 💡 **Tip**: For production, consider using Docker with the production target in the Dockerfile.


## 📡 API Documentation

### OpenAPI Specification
API documentation is available at: **http://localhost:4000/api-docs**

Full API documentation is available in `openapi.yaml` file.

You can view it using:
- [Swagger Editor](https://editor.swagger.io/) (paste the YAML content)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

### Quick API Reference

#### Products Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/products` | Get all products (with filters) | ✅ |
| `GET` | `/api/v1/products/:id` | Get product by ID | ✅ |
| `POST` | `/api/v1/products` | Create new product | ✅ (ADMIN/SELLER) |
| `PUT` | `/api/v1/products/:id` | Update product | ✅ (Owner/ADMIN) |
| `DELETE` | `/api/v1/products/:id` | Delete product (soft delete) | ✅ (Owner/ADMIN) |

#### Example Requests

**Create Product**
```http
POST /api/v1/products
Content-Type: application/json
X-User-Id: 1
X-User-Role: SELLER

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 10
}
```


## 🧪 Testing

### Run All Tests
To execute tests inside the Docker container, prepend the command with: `docker exec -it problem5_app`.
Example: `docker exec -it problem5_app npm test`.

```bash
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run E2E Tests Only

```bash
npm run test:e2e
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── controllers/        # Controller tests
│   ├── services/           # Service tests
│   └── repositories/       # Repository tests
├── e2e/                    # End-to-end tests
│   └── products.e2e.test.ts
└── utils/                  # Test utilities
    ├── testHelpers.ts
    └── e2eHelpers.ts
```

### Example Test

```typescript
describe('ProductService', () => {
  it('should create a product', async () => {
    const productData = {
      name: 'Test Product',
      price: 99.99,
      category: 'Test',
      stock: 10,
      ownerId: 1
    };

    const product = await productService.create(productData);

    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
  });
});
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:coverage` | Generate test coverage report |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npm run format` | Format code with Prettier |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View application logs |
| `npm run docker:rebuild` | Rebuild and restart containers |

---

