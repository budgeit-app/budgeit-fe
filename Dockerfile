# ---------- Build stage ----------
FROM node:25-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.29-alpine

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
