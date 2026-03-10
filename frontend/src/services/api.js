import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      const event = new CustomEvent('auth:logout');
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
export const obterLocal = (id) => api.get(`/locais/${id}`);
export const criarLocal = (dados) => api.post('/locais', dados);
export const atualizarLocal = (id, dados) => api.put(`/locais/${id}`, dados);
export const deletarLocal = (id) => api.delete(`/locais/${id}`);
export const obterEstatisticas = () => api.get('/locais/estatisticas/geral');

export const criarAvaliacao = (dados) => api.post('/avaliacoes', dados);
export const listarAvaliacoes = (localId) => api.get(`/avaliacoes/local/${localId}`);
export const deletarAvaliacao = (id) => api.delete(`/avaliacoes/${id}`);

export default api;
