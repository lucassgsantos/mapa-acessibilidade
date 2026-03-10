# AcessaMapa - Backend

API REST pra autenticação, CRUD de locais e avaliações.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- express-validator
- helmet + express-rate-limit

## Endpoints

### Auth
| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/auth/registro` | não |
| POST | `/api/auth/login` | não |
| GET | `/api/auth/perfil` | sim |
| PUT | `/api/auth/perfil` | sim |

### Locais
| Método | Rota | Auth |
|--------|------|------|
| GET | `/api/locais` | não |
| GET | `/api/locais/:id` | não |
| POST | `/api/locais` | sim |
| PUT | `/api/locais/:id` | sim (autor) |
| DELETE | `/api/locais/:id` | sim (autor) |
| GET | `/api/locais/estatisticas/geral` | não |

### Avaliações
| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/avaliacoes` | sim |
| GET | `/api/avaliacoes/local/:localId` | não |
| DELETE | `/api/avaliacoes/:id` | sim (autor) |

## .env

```
PORT=5000
MONGODB_URI=sua_connection_string
JWT_SECRET=chave_secreta
CORS_ORIGIN=http://localhost:5173
```

## Rodando

```bash
npm install
npm run dev
```
