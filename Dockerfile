# Multi-stage build for Test Automation Dashboard Backend
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install Python, bash, and other necessary tools for test execution
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    curl \
    && ln -sf python3 /usr/bin/python

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Copy production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Copy tests directory (needed for test execution)
COPY --from=builder /app/tests ./tests

# Make test scripts executable
RUN chmod +x tests/*.py tests/*.sh

# Create results directory and set permissions
RUN mkdir -p /app/results && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 5000
EXPOSE 5000


# Start the application
CMD ["node", "dist/server.js"]