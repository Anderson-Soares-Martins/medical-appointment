FROM node:18
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install

COPY . .
RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001
CMD ["docker-entrypoint.sh"]
