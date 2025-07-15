# Use Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install ALL dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Verify the build output exists
RUN ls -la dist/ && test -f dist/app.js

# Remove dev dependencies after build
RUN pnpm prune --production

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["pnpm", "start"]