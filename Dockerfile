# syntax=docker/dockerfile:1

# ----------------------------------------------------
# Stage 1: Build the React Frontend
# ----------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY client/ ./
RUN npm run build

# ----------------------------------------------------
# Stage 2: Build & Run the Node.js Server
# ----------------------------------------------------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install server production dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server/ ./

# Copy built React files into the server public/static folder
COPY --from=frontend-builder /app/client/build ./public
# (Note: If your React build outputs to 'dist' instead of 'build', change to:
#  COPY --from=frontend-builder /app/client/dist ./public)

# Port your Node server listens on (change 5000 if your server uses 3000, 8000, etc.)
EXPOSE 5000
ENV PORT=5000

CMD ["node", "index.js"]
# (Or: CMD ["npm", "start"])