# syntax=docker/dockerfile:1

# ----------------------------------------------------
# Stage 1: Build the React Frontend (yarn, Node 18)
# ----------------------------------------------------
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client

RUN corepack enable

COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY client/ ./
RUN yarn build

# ----------------------------------------------------
# Stage 2: Build & Run the Node.js Server (npm, Node 18)
# ----------------------------------------------------
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./

COPY --from=frontend-builder /app/client/build ./public

EXPOSE 5000
ENV PORT=5000

CMD ["node", "server.js"]