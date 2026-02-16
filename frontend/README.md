# AcessaMapa - Frontend

Interface web do AcessaMapa, com mapa interativo para visualizar e cadastrar locais acessíveis.

## Stack

- React 19
- Vite
- Tailwind CSS
- Leaflet / React-Leaflet
- React Router
- Axios

## Páginas

- **Home** — Mapa interativo + lista lateral com filtros e busca
- **Login** — Tela de login e criação de conta
- **Novo Local** — Formulário para cadastrar um local com seleção no mapa
- **Detalhes** — Informações do local, recursos de acessibilidade e avaliações
- **Estatísticas** — Dashboard com dados gerais de acessibilidade

## Rodando

```bash
npm install
npm run dev
```

O servidor de desenvolvimento roda em `http://localhost:5173`.

As chamadas para `/api` são redirecionadas automaticamente para `http://localhost:5000` via proxy do Vite.
