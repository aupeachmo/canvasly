# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (cache-friendly)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
ARG BASE_PATH=/canvasly/
ENV BASE_PATH=${BASE_PATH}
RUN npm run build

# ---- Output stage ----
# The built files are in /app/dist
# Use `docker cp` to extract them, or serve directly with nginx:
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
