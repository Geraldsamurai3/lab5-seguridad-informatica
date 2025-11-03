
FROM node:20-alpine


WORKDIR /app


COPY package*.json ./
COPY . .


RUN npm install --omit=dev


ENV NODE_ENV=development
ENV PORT=3001


EXPOSE 3001


RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Comando para ejecutar la app
CMD ["node", "server.js"]
