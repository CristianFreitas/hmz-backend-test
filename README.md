# Teste Backend HMZ

Este é um teste de backend para a empresa HMZ, implementando uma API REST baseada nos endpoints da API fake ReqRes.in. O projeto foi desenvolvido usando Node.js, TypeScript, Express e Prisma com PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Docker para containerização
- Bcrypt para hash de senhas
- Express Validator para validação de dados

## Estrutura do Projeto

```
hmz-backend-test/
│
├── src/
│   ├── controllers/   # Controladores para as rotas
│   ├── middleware/    # Middlewares (autenticação)
│   ├── routes/        # Definição de rotas
│   ├── services/      # Lógica de negócios
│   ├── utils/         # Utilitários
│   ├── app.ts         # Configuração do Express
│   └── server.ts      # Ponto de entrada da aplicação
│
├── prisma/
│   ├── schema.prisma  # Definição do esquema do banco de dados
│   ├── migrations/    # Migrações do banco de dados (inclui migração inicial)
│   ├── seed.ts        # Script para popular o banco de dados (dev)
│   └── seed.js        # Script para popular o banco de dados (Docker)
│
├── Dockerfile         # Configuração do Docker para a API
├── docker-compose.yml # Configuração do Docker Compose
│
├── .env.example       # Exemplo de variáveis de ambiente
├── package.json       # Dependências e scripts
└── tsconfig.json      # Configuração do TypeScript
```

## Requisitos

- Node.js 22+
- Docker e Docker Compose v2+ (para deployment completo)
- NPM ou Yarn

## Executando com Docker

A maneira mais fácil de executar todo o projeto é usando Docker Compose:

```bash
# Iniciar todos os serviços (PostgreSQL e API)
docker compose up -d

# Para acompanhar os logs da aplicação
docker compose logs -f api
```

Este comando inicia o PostgreSQL, executa as migrações, popula o banco de dados com dados iniciais e inicia a API, tudo automaticamente.

> **Nota**: O projeto já inclui migrações iniciais do Prisma na pasta `prisma/migrations/`, então não é necessário criar manualmente as migrações.

Se preferir iniciar os serviços separadamente ou executar em modo de desenvolvimento:

1. Inicie o container do PostgreSQL:

```bash
docker compose up -d postgres
```

2. Execute as migrações do Prisma para aplicar o schema:

```bash
npx prisma migrate deploy
```

3. Popular o banco de dados com dados iniciais:

```bash
npm run prisma:seed
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Migrações do Banco de Dados

O projeto já inclui a migração inicial necessária para criar todas as tabelas. Para aplicar esta migração, basta executar:

```bash
npx prisma migrate deploy
```

Se você precisar fazer alterações no schema, pode criar novas migrações:

```bash
# Para alterações subsequentes no schema
npx prisma migrate dev --name <nome-da-alteracao>
```

Estas migrações são armazenadas em `prisma/migrations/` e garantem que o banco de dados seja atualizado de forma consistente em todos os ambientes.

## Comandos Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em modo de produção
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa as migrações do banco de dados
- `npm run prisma:studio`: Inicia o Prisma Studio para visualizar o banco de dados
- `npm run prisma:seed`: Popula o banco de dados com dados iniciais
- `npm run prisma:reset`: Reseta o banco de dados (apaga todos os dados e recria as tabelas)

## Endpoints da API

### Autenticação

- **POST /api/login**
  - Autentica um usuário com email e senha
  - Retorna um token JWT

### Usuários

- **GET /api/users?page=1&per_page=5**
  - Lista usuários com paginação
  - Requer autenticação

- **GET /api/users/:id**
  - Busca um usuário pelo ID
  - Requer autenticação

- **PUT /api/users/:id**
  - Atualiza um usuário pelo ID
  - Requer autenticação

- **DELETE /api/users/:id**
  - Remove um usuário pelo ID
  - Requer autenticação

## Credenciais para Teste

Você pode usar as seguintes credenciais para teste:

```
Email: george.bluth@reqres.in
Senha: password123
```

## Comandos para Recriar as Tabelas

Para recriar as tabelas do banco de dados, execute:

```bash
npm run prisma:reset
```

Este comando irá apagar todas as tabelas, recriar conforme o schema.prisma e executar o seed para popular o banco de dados.

## Deployment com Docker Completo

Para fazer o deployment completo da aplicação com Docker (incluindo o backend), você pode usar os comandos:

```bash
# Parar e remover os containers, redes, volumes e imagens
docker compose down -v

# Reconstruir e iniciar os containers em modo detached (background)
docker compose up -d --build
```

Esta sequência de comandos dará a você um ambiente completamente limpo e atualizado para testar sua aplicação.

## Testes

O projeto inclui uma suíte de testes automatizados para garantir o funcionamento correto dos endpoints da API.

### Configuração do Ambiente de Teste

1. Crie um banco de dados específico para testes:

```bash
# Conecte-se ao PostgreSQL
docker exec -it hmz_postgres psql -U hmzuser

# Crie o banco de dados de teste
CREATE DATABASE hmz_test_db;
```

2. Configure o banco de dados de teste:

```bash
# Configurar o banco de dados de teste
npm run test:setup
```

### Executando os Testes

npm run test

```bash