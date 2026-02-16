import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { TIPOS_DEFICIENCIA } from '../constants';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipoDeficiencia: 'nenhuma' });
  const [carregando, setCarregando] = useState(false);
  const { login, registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (modo === 'login') {
        await login(form.email, form.senha);
        toast.success('Login realizado com sucesso!');
      } else {
        await registrar(form);
        toast.success('Conta criada com sucesso!');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.mensagem || 'Erro ao processar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {modo === 'login' ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-600">
            {modo === 'login'
              ? 'Acesse sua conta para contribuir com o mapa'
              : 'Junte-se à comunidade e ajude a mapear a acessibilidade'
            }
          </p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1" role="tablist">
          <button
            role="tab"
            aria-selected={modo === 'login'}
            onClick={() => setModo('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors
              ${modo === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Entrar
          </button>
          <button
            role="tab"
            aria-selected={modo === 'registro'}
            onClick={() => setModo('registro')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors
              ${modo === 'registro' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          {modo === 'registro' && (
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {modo === 'registro' && (
            <div>
              <label htmlFor="tipoDeficiencia" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de deficiência (opcional)
              </label>
              <select
                id="tipoDeficiencia"
                value={form.tipoDeficiencia}
                onChange={(e) => setForm({ ...form, tipoDeficiencia: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(TIPOS_DEFICIENCIA).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiLogIn aria-hidden="true" />
            {carregando ? 'Processando...' : modo === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </main>
  );
}
