FROM node:20-alpine

# Install SSH client + sshpass for lateral movement demo
RUN apk add --no-cache openssh-client openssh-keygen sshpass

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY . .

ENV REDIS_PASSWORD=Redis@2024Internal

EXPOSE 3000 3001 8080

CMD ["node", "server.js"]
