# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --force --frozen-lockfile

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_OPTIMIZE_FONTS=false

RUN npm run build \
  && npm prune --omit=dev \
  && npm cache clean --force

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm",  "start"]
