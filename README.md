# CaseMindGroup — Plataforma de Blog Monorepo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)

Aplicação completa de Blog desenvolvida com arquitetura **Monorepo** em **TypeScript**, contendo API RESTful desacoplada no Backend e Single Page Application (SPA) responsiva no Frontend.

---

## Funcionalidades Principais

- **Autenticação e Segurança**:
  - Registro e Login com validação robusta e senhas criptografadas com `bcrypt`.
  - Autenticação stateless via `JSON Web Token (JWT)`.
  - Troca segura de senha autenticada validando a senha atual.
- **Gestão Completa de Artigos (CRUD)**:
  - Criação e edição de artigos com upload de imagem de capa em memória.
  - Cálculo automático de tempo estimado de leitura (ex: *3 min de leitura*).
  - Destaques editoriais (*Featured Article*, *Recent Articles* e *Newest*).
  - Proteção de rotas: apenas o autor proprietário pode editar ou excluir sua matéria.
- **Busca e Descoberta**:
  - Barra de pesquisa em tempo real com *debounce* na listagem de artigos.
  - Filtro integrado por título, autor e conteúdo.
- **Experiência de Leitura Dedicada**:
  - Página completa de leitura (`/articles/:id`) com tipografia editorial limpa e metadados do autor.
- **Área do Autor e Perfil**:
  - Painel "Meus Artigos" com atalhos rápidos para edição e exclusão.
  - Modal customizado de confirmação antes de excluir qualquer matéria.
  - Configuração de perfil com upload e preview de avatar.
- **Feedback Visual e UX Moderna**:
  - Sistema global de notificações *Toast* animados (sucesso, erro, info, aviso).
  - *Skeleton Loaders* com efeito shimmer durante o carregamento de dados.

---

## Estrutura do Monorepo

```text
CaseMindGroup/
├── backend/                  # API RESTful (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/          # Conexão com banco de dados MySQL
│   │   ├── controllers/     # Controladores das rotas (Auth, Articles, User)
│   │   ├── middlewares/     # Auth JWT, Uploads Multer, Error Handler
│   │   ├── models/          # Modelos de acesso a dados (User, Article DTOs)
│   │   ├── routes/          # Definição e mapeamento das rotas
│   │   ├── utils/           # AppError semântico e cálculo de tempo de leitura
│   │   └── app.ts           # Configuração do Express e CORS
│   ├── bd_dump.sql          # Schema inicial do banco de dados
│   ├── Dockerfile           # Imagem multi-stage de produção
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   └── package.json
│
├── frontend/                 # Aplicação Web (React + TypeScript)
│   ├── src/
│   │   ├── components/      # Componentes (Navbar, ArticleCard, Skeletons, Modal, Icons)
│   │   ├── context/         # AuthContext e ToastContext
│   │   ├── pages/           # Home, Articles, ArticleDetail, MyArticles, Profile, Auth
│   │   ├── services/        # Clientes HTTP desacoplados (Axios)
│   │   ├── styles/          # Design system e estilos globais
│   │   └── App.tsx          # Roteamento e layouts
│   ├── Dockerfile           # Imagem multi-stage com Nginx
│   ├── nginx.conf           # Configuração Nginx de alta performance
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   └── package.json
│
├── docker-compose.yml       # Orquestração Full-Stack (MySQL 8 + Node API + React/Nginx)
└── README.md                # Documentação principal
```

---

## Como Executar o Projeto

### Opção A: Execução Completa via Docker (Recomendado)

Com o Docker instalado, você pode rodar a aplicação full-stack (Banco + Backend + Frontend) com apenas **um único comando**:

```bash
docker compose up --build
```

- **Frontend (React + Nginx)**: [http://localhost:3000](http://localhost:3000)
- **Backend (Node.js API)**: [http://localhost:4000/api](http://localhost:4000/api)
- **Banco de Dados (MySQL 8.0)**: Porta `3306` (com dados inicializados automaticamente)

---

### Opção B: Execução Manual / Desenvolvimento Local

#### 1. Banco de Dados
```bash
docker compose up database -d
```

---

#### 2. Configurar e Executar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Iniciar em modo de desenvolvimento (porta 4000)
npm run dev
```

---

#### 3. Configurar e Executar o Frontend

Em um novo terminal:
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação React (porta 3000)
npm start
```

Acesse a aplicação no navegador em: **`http://localhost:3000`**

---

## Referência dos Endpoints da API

| Método | Endpoint | Autenticado? | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Não | Cadastra um novo usuário |
| `POST` | `/api/auth/login` | Não | Autentica e retorna token JWT |
| `POST` | `/api/auth/change-password-by-email` | Não | Redefinição de senha por email |
| `GET` | `/api/articles` | Não | Lista artigos (suporta `?search=&page=&limit=`) |
| `GET` | `/api/articles/featured` | Não | Retorna o artigo em destaque |
| `GET` | `/api/articles/recent` | Não | Retorna os 3 artigos mais recentes |
| `GET` | `/api/articles/new` | Não | Retorna os 6 artigos novidades |
| `GET` | `/api/articles/:id` | Não | Retorna os detalhes de um artigo por ID |
| `GET` | `/api/articles/:id/image` | Não | Serve a imagem de capa com cabeçalho de cache |
| `GET` | `/api/articles/my` | **Sim** | Retorna apenas os artigos do autor logado |
| `POST` | `/api/articles` | **Sim** | Cria um novo artigo com upload de imagem |
| `PUT` | `/api/articles/:id` | **Sim** | Atualiza um artigo existente (apenas autor) |
| `DELETE` | `/api/articles/:id` | **Sim** | Exclui um artigo (apenas autor) |
| `GET` | `/api/users/profile` | **Sim** | Retorna o perfil do usuário logado |
| `PUT` | `/api/users/profile` | **Sim** | Atualiza nome e foto de avatar |
| `PUT` | `/api/users/change-password` | **Sim** | Altera a senha validando a senha atual |

---

## Autor

Desenvolvido por **Pedro Rovira** ([@pdr-rvr](https://github.com/pdr-rvr))
