# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --force --frozen-lockfile

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_OPTIMIZE_FONTS=false

RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app

# Copy only package.json and production node_modules
COPY package*.json ./
RUN npm ci --omit=dev --force --frozen-lockfile

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Use non-root user
RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["npm", "start"]
