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

# Install PM2, netcat, and Puppeteer dependencies (minimal set)
RUN npm install -g pm2 && \
    apk add --no-cache \
        netcat-openbsd \
        chromium \
        nss \
        ca-certificates \
        freetype \
        harfbuzz && \
    # Tell Puppeteer to skip installing Chromium. We'll be using the installed package.
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && \
    export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

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

# Add a user for running Chromium (security best practice)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application with startup script
CMD ["./start.sh"] 