# AcessaMapa

Plataforma colaborativa para mapear a acessibilidade de locais urbanos. Qualquer pessoa pode cadastrar um local, informar quais recursos de acessibilidade ele possui (rampa, elevador, piso tátil, etc.) e dar uma nota de 1 a 5. Outros usuários podem avaliar os locais e confirmar as informações.

O projeto nasceu da necessidade de facilitar o dia a dia de pessoas com deficiência na hora de planejar deslocamentos pela cidade.

## Funcionalidades

- Mapa interativo com marcadores coloridos por nota de acessibilidade
- Cadastro de locais com 10 tipos de recursos de acessibilidade
- Sistema de avaliações por usuário
- Filtros por categoria, nota mínima e recurso
- Busca por nome/endereço
- Página de estatísticas com gráficos
- Geolocalização do usuário
- Autenticação JWT

## Tecnologias

**Frontend:** React, Vite, Tailwind CSS, Leaflet, React Router, Axios

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs

## Pré-requisitos

- Node.js 18+
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou MongoDB local)

## Como rodar

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/acessamapa.git
cd acessamapa
```

2. Instale as dependências

```bash
npm run install-all
```

3. Configure o backend

Crie o arquivo `backend/.env` baseado no exemplo:

```bash
cp backend/.env.example backend/.env
```

Preencha com suas credenciais do MongoDB Atlas e uma chave secreta para o JWT.

4. Rode o projeto

Em um terminal:
```bash
npm run backend
```

Em outro terminal:
```bash
npm run frontend
```

O frontend roda em `http://localhost:5173` e o backend em `http://localhost:5000`.

## Estrutura

```
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── package.json
```

## Licença

MIT
