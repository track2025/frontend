#FROM 658919911873.dkr.ecr.us-east-1.amazonaws.com/shoutty-front:latest as BUILD_IMAGE
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Install system dependencies
RUN apk add --no-cache python3 make g++

# 2. Copy package files first for better caching
COPY package.json package-lock.json ./

# 3. Install dependencies (force if needed)
RUN npm install --force --frozen-lockfile

# 4. Copy all files
COPY . .

# 5. Set memory limit and disable font optimization
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_OPTIMIZE_FONTS=false

# 6. Build with retries
RUN npm run build || \
    (echo "Build failed, retrying..." && npm run build) || \
    (echo "Build failed again, retrying one last time..." && npm run build)

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# 1. Copy production files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# 2. Security: Run as non-root user
RUN chown -R node:node /app
USER node

# 3. Runtime configuration
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]