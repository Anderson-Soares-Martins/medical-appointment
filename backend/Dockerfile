FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

# Garante que o Prisma gere o client ao buildar
RUN npx prisma generate

EXPOSE 3001

CMD ["pnpm", "dev"] 