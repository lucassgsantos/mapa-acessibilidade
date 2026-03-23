import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const AUTH_STORAGE_KEYS = {
  accessToken: 'token',
  refreshToken: 'refreshToken',
  usuario: 'usuario'
};

const codigosErroToken = [
  'TOKEN_NAO_FORNECIDO',
  'TOKEN_EXPIRADO',
  'TOKEN_INVALIDO',
  'TOKEN_SESSAO_INVALIDO',
  'USUARIO_NAO_ENCONTRADO',
  'SESSAO_INVALIDADA',
  'FALHA_AUTENTICACAO',
  'REFRESH_TOKEN_EXPIRADO',
  'REFRESH_TOKEN_INVALIDO',
  'REFRESH_TOKEN_NAO_FORNECIDO'
];

const getAccessToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
const getRefreshToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);

const setTokens = ({ token, accessToken, refreshToken }) => {
  const access = accessToken || token;
  if (access) {
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, access);
  }
  if (refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  }
};

const limparSessaoLocal = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.usuario);
};

let refreshEmAndamento = null;

const renovarSessao = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token ausente');
  }

  const { data } = await axios.post('/api/auth/refresh', { refreshToken }, {
    headers: { 'Content-Type': 'application/json' }
  });

  setTokens(data);
  return data;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const codigo = error.response?.data?.codigo;
    const erroDeToken = codigosErroToken.includes(codigo);
    const requisicaoOriginal = error.config || {};
    const rota = requisicaoOriginal.url || '';
    const rotaAuth = rota.includes('/auth/login') || rota.includes('/auth/registro') || rota.includes('/auth/refresh');

    if (status === 401 && codigo === 'TOKEN_EXPIRADO' && !requisicaoOriginal._retry && !rotaAuth) {
      requisicaoOriginal._retry = true;

      try {
        if (!refreshEmAndamento) {
          refreshEmAndamento = renovarSessao().finally(() => {
            refreshEmAndamento = null;
          });
        }

        const tokens = await refreshEmAndamento;
        const novoAccessToken = tokens.accessToken || tokens.token;

        if (!requisicaoOriginal.headers) {
          requisicaoOriginal.headers = {};
        }
        requisicaoOriginal.headers.Authorization = `Bearer ${novoAccessToken}`;

        return api(requisicaoOriginal);
      } catch {
      }
    }

    if (status === 401 && erroDeToken) {
      limparSessaoLocal();
      const event = new CustomEvent('auth:logout', { detail: { reason: codigo } });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  }
);

export const registrar = (dados) => api.post('/auth/registro', dados);
export const login = (dados) => api.post('/auth/login', dados);
export const obterPerfil = () => api.get('/auth/perfil');
export const atualizarPerfil = (dados) => api.put('/auth/perfil', dados);

export const listarLocais = (params) => api.get('/locais', { params });
export const obterLocal = (id, params) => api.get(`/locais/${id}`, { params });
export const criarLocal = (dados) => api.post('/locais', dados);
export const atualizarLocal = (id, dados) => api.put(`/locais/${id}`, dados);
export const deletarLocal = (id) => api.delete(`/locais/${id}`);
export const obterEstatisticas = () => api.get('/locais/estatisticas/geral');

export const criarAvaliacao = (dados) => api.post('/avaliacoes', dados);
export const listarAvaliacoes = (localId, params) => api.get(`/avaliacoes/local/${localId}`, { params });
export const deletarAvaliacao = (id) => api.delete(`/avaliacoes/${id}`);

export default api;
