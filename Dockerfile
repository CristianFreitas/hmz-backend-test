FROM node:22 AS builder

# Configurar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar arquivos do projeto
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build && ls -la dist/

# Estágio de execução - usar a mesma imagem em vez de multi-stage build
FROM node:22

# Configurar diretório de trabalho
WORKDIR /app

# Copiar tudo do estágio de build
COPY --from=builder /app ./

# Verificar se os arquivos de build existem
RUN ls -la dist/

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]