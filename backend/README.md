# AcessaMapa - Backend

API REST do AcessaMapa, responsável por autenticação, CRUD de locais e sistema de avaliações.

## Stack

- Node.js + Express
- MongoDB com Mongoose
- JWT para autenticação
- bcryptjs para hash de senhas

## Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/registro` | Criar conta |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/perfil` | Dados do usuário logado |
| PUT | `/api/auth/perfil` | Atualizar perfil |

### Locais
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/locais` | Listar locais (com filtros) |
| GET | `/api/locais/:id` | Detalhes de um local |
| POST | `/api/locais` | Cadastrar local |
| PUT | `/api/locais/:id` | Editar local |
| DELETE | `/api/locais/:id` | Remover local |
| GET | `/api/locais/estatisticas/geral` | Estatísticas gerais |

### Avaliações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/avaliacoes` | Criar avaliação |
| GET | `/api/avaliacoes/local/:localId` | Avaliações de um local |
| DELETE | `/api/avaliacoes/:id` | Remover avaliação |

## Configuração

Crie um arquivo `.env` na raiz do backend:

```
PORT=5000
MONGODB_URI=sua_connection_string_aqui
JWT_SECRET=sua_chave_secreta
```

## Rodando

```bash
npm install
npm run dev
```
