# Orbital Eletrônicos 🛰️

Loja virtual de eletrônicos desenvolvida com arquitetura em camadas (MVC + Repository Pattern), back-end em Node.js/TypeScript e front-end em React/TypeScript.

## 🚀 Tecnologias

**Back-end**
- Node.js
- TypeScript
- Express
- MySQL2
- JWT (autenticação)
- Zod (validação)
- bcryptjs (hash de senha)
- Docker

**Front-end**
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios

## 📐 Arquitetura

O back-end segue uma arquitetura em camadas:
- **Routes** — definição dos endpoints e middlewares aplicados
- **Controllers** — recebem a requisição HTTP e devolvem a resposta, sem regra de negócio
- **Services** — concentram as regras de negócio (validações, cálculos, integrações entre entidades)
- **Repositories** — único ponto de acesso ao banco de dados (queries MySQL2)
- **Models** — tipagem das entidades e DTOs

## 🗂️ Modelo de dados

Entidades principais: `users`, `categories`, `products`, `addresses`, `orders`, `order_items`.

- Um produto pertence a uma categoria (`category_id`)
- Um pedido (`order`) pertence a um usuário e, opcionalmente, a um endereço
- Um pedido possui vários itens (`order_items`), com preço congelado no momento da compra

## 📦 Como executar

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose

### Rodando com Docker (recomendado)

Na raiz do projeto:

```bash
docker-compose up --build
```

Isso vai subir:

| Serviço | Porta no host | Descrição |
|---|---|---|
| `backend` | `3000` | API Node.js/Express |
| `mysql` | `3307` | Banco de dados MySQL 8 |

> A porta do MySQL no host é `3307` (mapeada para `3306` dentro do container) para evitar conflito com instalações locais de MySQL.

Para rodar em segundo plano:
```bash
docker-compose up -d
```

Para parar os containers:
```bash
docker-compose down
```

Para parar e remover também os dados do banco:
```bash
docker-compose down -v
```

### Rodando localmente (sem Docker)

```bash
# Backend
cd backend
npm install
npm run dev
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` dentro de `backend/` com:

```env
PORT=3000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=orbital_eletronicos
JWT_SECRET=sua_chave_secreta
```

> Ao rodar localmente (sem Docker), troque `DB_HOST=mysql` para `DB_HOST=localhost` e a porta de conexão para `3307`.

## 🌿 Fluxo de branches

| Branch | Função |
|---|---|
| `main` | Código estável, pronto para produção |
| `develop` | Branch de integração do desenvolvimento |
| `feature/*` | Branches de funcionalidades específicas (ex: `feature/jwt-auth`) |

Fluxo de trabalho:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature

# ... desenvolve e comita ...

git push -u origin feature/nome-da-feature
```

Depois, abrir um **Pull Request** de `feature/nome-da-feature` → `develop`. Quando `develop` estiver estável, abrir um PR de `develop` → `main`.

### Convenção de commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):
