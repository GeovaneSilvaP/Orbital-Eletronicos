# Orbital Eletrônicos 🛰️

Loja virtual de eletrônicos desenvolvida com arquitetura em camadas, utilizando o padrão **MVC + Repository Pattern**. O ecossistema conta com um back-end robusto em Node.js/TypeScript e um front-end moderno em React/TypeScript.

## 🚀 Tecnologias

### Back-end
- **Node.js** (Ambiente de execução)
- **TypeScript** (Tipagem estática e segurança)
- **Express** (Framework web)
- **MySQL2** (Driver de conexão com banco de dados)
- **Zod** (Validação estrita de dados e payloads)
- **JWT** (Autenticação baseada em tokens)
- **bcryptjs** (Algoritmo de hash seguro para senhas)
- **Docker & Docker Compose** (Conteinerização do ambiente)

### Front-end
- **React** / **TypeScript**
- **Tailwind CSS** (Estilização utilitária)
- **React Router DOM** (Gerenciamento de rotas)
- **Axios** (Cliente HTTP)

---

## 📐 Arquitetura do Back-end

O servidor foi estruturado seguindo uma divisão clara de responsabilidades para facilitar a manutenção e escalabilidade do código:

```text
src/
├── config/          # Configurações de banco de dados e variáveis
├── controllers/     # Interceptam requisições HTTP e devolvem respostas
├── errors/          # Classes customizadas de tratamento de exceções (AppError)
├── middlewares/     # Interceptadores globais (Validação, Erros, Autenticação)
├── models/          # Tipagens das entidades e Contratos de Dados (DTOs)
├── repositories/    # Camada exclusiva de comunicação SQL com o Banco de Dados
├── routes/          # Definição e mapeamento dos endpoints da API
├── scripts/         # Scripts utilitários executados manualmente (ex: criação do admin)
├── services/        # Centralização das Regras de Negócio e validações críticas
├── utils/           # Funções utilitárias reaproveitáveis (Mapeamentos, Criptografia)
├── validations/      # Schemas Zod de validação de payloads (auth, user, etc.)
```

**Divisão de Responsabilidades:**

- **Routes**: Mapeia as URLs e aciona os middlewares de validação antes de expor os recursos.
- **Controllers**: Isolam a camada HTTP. Apenas extraem dados da requisição (params, body, query) e disparam a resposta.
- **Middlewares**: Filtros globais. O `validate.middleware` valida payloads com Zod, o `authMiddleware` autentica via JWT, o `authorize` restringe rotas por papel (role), e o `errorHandler` impede crashes inesperados capturando erros conhecidos (`AppError`) e genéricos.
- **Services**: Onde o sistema "pensa". Verifica duplicidade de e-mails, comanda a criptografia de senhas através do `bcryptjs`, gera e valida tokens JWT, e valida fluxos antes de persistir dados.
- **Repositories**: Concentram as queries SQL diretas (SELECT, INSERT, UPDATE, DELETE) usando tipagens fortes do driver `mysql2` como `RowDataPacket` e `ResultSetHeader`.
- **Utils**: Funções puras de apoio. O `toUserPublic` higieniza dados de entidades removendo informações sensíveis (como hashes de senhas) antes do envio ao cliente.

## 🗂️ Modelo de Dados

Entidades principais mapeadas no banco de dados: `users`, `categories`, `products`, `addresses`, `orders`, `order_items`.

- Um produto pertence obrigatoriamente a uma categoria (`category_id`).
- Um pedido (`order`) pertence a um usuário e, opcionalmente, a um endereço de entrega.
- Um pedido possui múltiplos itens (`order_items`), cujo preço unitário é congelado no ato da compra para histórico financeiro íntegro.
- Cada usuário possui um papel (`role`) do tipo `ENUM('ADMIN', 'CUSTOMER')`, que define seu nível de acesso ao sistema.

## 🔐 Autenticação e Autorização (JWT)

A API utiliza **JSON Web Tokens (JWT)** para autenticação stateless e middlewares de autorização baseados em papéis (`role`).

### Fluxo de login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "suasenha"
}
```

Resposta (200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "CUSTOMER"
  }
}
```

O `token` retornado deve ser enviado no cabeçalho `Authorization` das requisições às rotas protegidas:

```http
Authorization: Bearer <token>
```

### Middlewares de proteção

- **`authMiddleware`**: valida o token JWT enviado no cabeçalho e injeta `req.user` (`id`, `role`) na requisição. Sem token válido, retorna `401 Unauthorized`.
- **`authorize(["ADMIN"])`**: restringe o acesso a rotas com base no papel do usuário autenticado. Sem o papel exigido, retorna `403 Forbidden`.

Exemplo de uso combinado em uma rota restrita a administradores:

```ts
router.post(
  "/categories",
  authMiddleware,
  authorize(["ADMIN"]),
  CategoryController.create,
);
```

### Papéis (Roles)

| Role | Permissões |
|---|---|
| `CUSTOMER` | Papel padrão de qualquer usuário cadastrado pela rota pública. Acesso aos próprios dados e fluxo de compra. |
| `ADMIN` | Acesso total ao sistema: criação/edição de categorias, produtos, e gestão geral. |

> 🔒 **Importante**: a rota pública de cadastro (`POST /api/users`) nunca aceita o campo `role` vindo do cliente — o schema Zod de criação ignora esse campo, e todo novo usuário nasce como `CUSTOMER`. Não existe forma de se autopromover a `ADMIN` pela API pública.

### Criando o usuário administrador

Como o papel `ADMIN` nunca pode ser concedido por uma rota pública, o primeiro administrador do sistema é criado por um **script manual**, executado fora do fluxo HTTP:

1. Defina as credenciais do administrador no `.env` (nunca commitado no Git):

```env
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@orbital.com
ADMIN_PASSWORD=uma_senha_forte_aqui
```

2. Execute o script:

```bash
npx ts-node src/scripts/seedAdmin.ts
```

3. Saída esperada:

```
Servidor conectado ao banco de dados!
Admin criado com sucesso: admin@orbital.com
```

O script reutiliza o `UserServices.create`, garantindo hash de senha e checagem de e-mail duplicado, mas passa `role: "ADMIN"` diretamente — algo que a rota pública de cadastro nunca permite.

## 📦 Como Executar

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose

### 🟢 Rodando com Docker (Recomendado)

Na raiz do projeto, execute o comando abaixo para construir e subir o ambiente completo:

```bash
docker-compose up --build
```

Isso vai inicializar a seguinte malha de serviços:

| Serviço | Porta no Host | Descrição |
|---|---|---|
| `backend` | `3000` | API REST Node.js/Express |
| `mysql` | `3307` | Banco de Dados MySQL 8 |

> 💡 **Nota sobre a porta do MySQL**: A porta exposta no host é a `3307` (mapeada para a interna `3306` do container) precisamente para evitar conflitos de porta caso você já possua um MySQL rodando localmente na sua máquina.

**Comandos úteis do Docker:**
- Rodar em segundo plano (background): `docker-compose up -d`
- Parar os containers: `docker-compose down`
- Derrubar os containers apagando os volumes de dados do banco: `docker-compose down -v`

### 🟡 Rodando Localmente (Sem Docker)

Caso opte por rodar nativamente, lembre-se de iniciar seu banco de dados MySQL local primeiro:

```bash
# Executando o Backend
cd backend
npm install
npm run dev

# Executando o Frontend
cd ../frontend
npm install
npm run dev
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` seguindo a estrutura abaixo:

```env
PORT=3000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=orbital_eletronicos
JWT_SECRET=sua_chave_secreta_super_segura

# Credenciais usadas apenas pelo script seedAdmin.ts
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@orbital.com
ADMIN_PASSWORD=uma_senha_forte_aqui
```

> ⚠️ **Atenção**: Se você estiver rodando a aplicação sem Docker, mude a propriedade `DB_HOST=mysql` para `DB_HOST=localhost` e certifique-se de que a porta configurada no seu arquivo de conexão local aponte para onde seu banco físico está respondendo (ex: `3307`).

> ⚠️ **Segurança**: o arquivo `.env` nunca deve ser commitado (já está protegido pelo `.gitignore`). Caso o repositório seja compartilhado, gere um `JWT_SECRET` forte (`openssl rand -hex 32`) e nunca reutilize as credenciais de exemplo acima em produção.

## 🌿 Fluxo de Branches

O projeto adota uma estratégia simplificada de Git Flow para garantir a integridade do código em produção:

| Branch | Função |
|---|---|
| `main` | Código perfeitamente estável e homologado, pronto para produção. |
| `develop` | Branch de integração contínua do desenvolvimento. |
| `feature/*` | Ramificações para construção de funcionalidades isoladas (Ex: `feature/user-management`). |

**Fluxo de Trabalho Diário:**

1. Sincronize com a `develop` e puxe as novidades:
```bash
git checkout develop
git pull origin develop
```

2. Crie sua branch a partir da `develop` atualizada:
```bash
git checkout -b feature/nome-da-sua-feature
```

3. Desenvolva, adicione suas alterações e envie ao repositório:
```bash
git add .
git commit -m "tipo(escopo): descrição curta"
git push -u origin feature/nome-da-sua-feature
```

4. Abra um Pull Request (PR) da sua `feature/*` para a `develop`. Após a aprovação e testes, a `develop` será mesclada à `main` periodicamente.

## 🏷️ Convenção de Commits

Este repositório segue estritamente a especificação de [Conventional Commits](https://www.conventionalcommits.org/). Seus commits devem iniciar com um dos prefixos abaixo:

- `feat`: Introdução de uma nova funcionalidade (ex: `feat(auth): add JWT login and role-based authorization`)
- `fix`: Correção de um bug (ex: `fix(auth): fix token expiration crash`)
- `docs`: Alterações exclusivamente na documentação (ex: `docs: update readme architecture overview`)
- `style`: Mudanças que não afetam o significado do código (espaços, formatação, ponto e vírgula ausente)
- `refactor`: Alterações de código que não corrigem bugs nem adicionam funcionalidades (melhoria de legibilidade)
- `test`: Adição ou correção de testes existentes
- `chore`: Atualizações de tarefas de build, pacotes npm, configurações de ferramentas, etc

## 👨‍💻 Autor

**Geovane Silva Prazeres**
[GitHub](https://github.com/GeovaneSilvaP)
