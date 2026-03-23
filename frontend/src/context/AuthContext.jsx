import { useState, useEffect, useRef, useCallback } from 'react';
import { login as loginAPI, registrar as registrarAPI, obterPerfil } from '../services/api';
import { AuthContext } from './AuthContextDef';
import toast from 'react-hot-toast';

function getUsuarioInicial() {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && refreshToken && usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      if (usuario && typeof usuario === 'object' && usuario._id && usuario.nome) {
        return usuario;
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
  }

  return null;
}

function getCarregandoInicial() {
  return !!(localStorage.getItem('token') && localStorage.getItem('refreshToken'));
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getUsuarioInicial);
  const [carregando, setCarregando] = useState(getCarregandoInicial);
  const verificado = useRef(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  useEffect(() => {
    const handleForceLogout = (event) => {
      const reason = event?.detail?.reason;
      if (reason === 'TOKEN_EXPIRADO' || reason === 'REFRESH_TOKEN_EXPIRADO') {
        toast.error('Sua sessão expirou. Faça login novamente.');
      }
      logout();
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [logout]);

  useEffect(() => {
    if (verificado.current) return;
    verificado.current = true;

    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      obterPerfil()
        .then(res => {
          setUsuario(res.data);
          localStorage.setItem('usuario', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
          setUsuario(null);
        })
        .finally(() => setCarregando(false));
    }
  }, []);

  const loginFn = async (email, senha) => {
    const { data } = await loginAPI({ email, senha });
    localStorage.setItem('token', data.accessToken || data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const registrarFn = async (dados) => {
    const { data } = await registrarAPI(dados);
    localStorage.setItem('token', data.accessToken || data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      carregando,
      login: loginFn,
      registrar: registrarFn,
      logout,
      autenticado: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}
