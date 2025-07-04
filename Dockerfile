# Use Node.js LTS Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["npm", "start"]