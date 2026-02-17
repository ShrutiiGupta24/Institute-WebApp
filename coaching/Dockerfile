# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY config-overrides.js ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY public ./public
COPY src ./src

# Build application
RUN npm run build

# Install serve to run the build
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Serve the build folder
CMD ["serve", "-s", "build", "-l", "3000"]
