# ============================================
# Stage 1: Build dependencies
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo archivos de dependencias primero (mejor cache)
COPY package*.json ./

# Instalar dependencias de producción y desarrollo
RUN npm ci --include=dev

# Copiar el resto del código
COPY . .

# ============================================
# Stage 2: Production image
# ============================================
FROM node:20-alpine

# Actualizar paquetes del sistema para parches de seguridad
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copiar solo package*.json
COPY package*.json ./

# Instalar SOLO dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código de la aplicación desde el builder
COPY --from=builder /app/server.js ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/libs ./libs

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Exponer puerto
EXPOSE 3001

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Cambiar a usuario no-root
USER appuser

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar la app
CMD ["node", "server.js"]

# Healthcheck para monitoreo
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
