# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy PM2 ecosystem file
COPY ecosystem.config.js .

# Generate Prisma Client
RUN npx prisma generate

# Create startup script
RUN echo '#!/bin/sh\n\
npx prisma db push\n\
pm2-runtime ecosystem.config.js' > /app/start.sh && \
chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application with startup script
CMD ["/app/start.sh"] 