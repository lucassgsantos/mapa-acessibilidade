import { useState, useEffect, useRef } from 'react';
import { login as loginAPI, registrar as registrarAPI, obterPerfil } from '../services/api';
import { AuthContext } from './AuthContextDef';

function getUsuarioInicial() {
  try {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    if (token && usuarioSalvo) {
      return JSON.parse(usuarioSalvo);
    }
  } catch {}
  return null;
}

function getCarregandoInicial() {
  return !!localStorage.getItem('token');
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getUsuarioInicial);
  const [carregando, setCarregando] = useState(getCarregandoInicial);
  const verificado = useRef(false);

  useEffect(() => {
    if (verificado.current) return;
    verificado.current = true;

    const token = localStorage.getItem('token');
    if (token) {
      obterPerfil()
        .then(res => {
          setUsuario(res.data);
          localStorage.setItem('usuario', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setUsuario(null);
        })
        .finally(() => setCarregando(false));
    }
  }, []);

  const loginFn = async (email, senha) => {
    const { data } = await loginAPI({ email, senha });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const registrarFn = async (dados) => {
    const { data } = await registrarAPI(dados);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
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
