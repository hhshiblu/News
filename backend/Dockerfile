# ── Stage 1: deps ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: prisma generate ────────────────────────────────────────────────────
FROM node:20-alpine AS prisma
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Required for Prisma client (query engine)
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

RUN chmod +x /app/docker-entrypoint.sh

# Pre-create upload directories so they're present even without a volume
RUN mkdir -p uploads/news/images uploads/news/videos uploads/stories uploads/ads uploads/entities

EXPOSE 5000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
