# Multi-stage Dockerfile for Node.js + TypeScript + PostgreSQL Backend

# ============================================
# Development Stage
# ============================================
FROM node:22-alpine AS development

WORKDIR /app

# Install dependencies for Prisma (required for native bindings)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for tsx watch)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start development server with hot-reload
CMD ["npm", "run", "dev"]

# ============================================
# Production Build Stage
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM node:22-alpine AS production

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema and generated client
COPY prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Start production server
CMD ["npm", "start"]
