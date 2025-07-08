# Escolhe imagem base Node
FROM node:18

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json pnpm-lock.yaml ./

# Instala pnpm e dependências
RUN npm install -g pnpm && pnpm install

# Copia o schema do Prisma e gera o client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do código
COPY . .

EXPOSE 3000
CMD ["pnpm", "start"]
