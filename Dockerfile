# =============================================================================
# RuruLand Portfolio - Production Dockerfile
# =============================================================================
# Multi-stage build for optimized production image
# Stage 1: Build the Vue.js SSG application
# Stage 2: Serve static files with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

# Set build-time arguments
ARG VITE_GA_MEASUREMENT_ID=G-Q4RFNMK35D

# Install build dependencies for native modules (if needed)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json ./

# Install dependencies (clean install for reproducibility)
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
ENV VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Add labels for better maintainability
LABEL maintainer="Yu-Ru Pan <ruru@swift.moe>"
LABEL description="RuruLand Portfolio - Vue 3 + TypeScript + Vite SSG"
LABEL version="1.0.0"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config and html
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Use non-root user for security
USER nginx

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
