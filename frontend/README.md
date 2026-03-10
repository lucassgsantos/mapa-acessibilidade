# AcessaMapa - Frontend

Interface do AcessaMapa. Mapa interativo pra visualizar e cadastrar locais acessíveis.

## Stack

- React 19 + Vite 7
- Tailwind CSS v4
- Leaflet / React-Leaflet
- React Router v7
- Axios

## Páginas

- **Home** — mapa + sidebar com filtros e busca
- **Login** — login / registro
- **Novo Local** — form com seleção no mapa
- **Detalhes** — info do local, recursos e avaliações
- **Estatísticas** — dashboard geral

## Rodando

```bash
npm install
npm run dev
```

Roda em `http://localhost:5173`. Proxy do Vite redireciona `/api` pra `http://localhost:5000`.
