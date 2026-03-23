# AcessaMapa

Um mapa colaborativo de acessibilidade urbana. A ideia é simples: qualquer um pode cadastrar um local, marcar quais recursos de acessibilidade ele tem (rampa, elevador, piso tátil, banheiro acessível, etc.) e dar uma nota de 1 a 5. Outros usuários avaliam e confirmam as informações.

Fiz esse projeto pensando em facilitar o dia a dia de quem tem alguma deficiência e precisa planejar como se deslocar pela cidade.

## O que tem

- Mapa interativo com marcadores coloridos pela nota de acessibilidade
- Cadastro de locais com 10 recursos de acessibilidade
- Avaliações por usuário (uma por local)
- Filtros por categoria, nota mínima e recurso
- Busca por nome/endereço
- Dashboard de estatísticas
- Geolocalização
- Auth com JWT
- Rate limiting e validação no backend
- Helmet + CORS configurável

## Stack

- **Front:** React 19, Vite, Tailwind CSS v4, Leaflet, React Router v7, Axios
- **Back:** Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, express-validator

## Rodando localmente

Você precisa de Node.js 18+ e uma instância MongoDB (Atlas ou local).

```bash
git clone https://github.com/lucassgsantos/mapa-acessibilidade.git
cd mapa-acessibilidade
npm run install-all
```

Crie o `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

Preencha `MONGODB_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET` e opcionalmente `CORS_ORIGIN`.

Pra rodar tudo junto:

```bash
npm run dev
```

Ou separado:

```bash
npm run backend   # porta 5000
npm run frontend  # porta 5173
```

## Estrutura

```
├── backend/
│   ├── controllers/   # lógica de negócio
│   ├── middleware/     # auth, validação, error handler
│   ├── models/         # schemas mongoose
│   ├── routes/         # definição de rotas + validação
│   ├── utils/          # funções auxiliares
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/ # mapa, navbar, ratings, etc
│       ├── context/    # auth context
│       ├── pages/      # home, login, detalhes, etc
│       └── services/   # cliente api
└── package.json
```

## Licença

MIT
