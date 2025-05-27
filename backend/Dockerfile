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

# Install PM2 globally and netcat
RUN npm install -g pm2 && \
    apk add --no-cache netcat-openbsd

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
COPY start.sh .
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application with startup script
CMD ["./start.sh"] 