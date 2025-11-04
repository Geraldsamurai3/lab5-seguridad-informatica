FROM node:22-alpine


WORKDIR /app

COPY package*.json ./

RUN apk update && apk upgrade --no-cache

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=development
ENV PORT=3001

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

CMD ["node", "server.js"]
