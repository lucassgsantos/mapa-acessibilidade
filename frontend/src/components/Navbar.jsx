import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { FiMap, FiUser, FiLogOut, FiLogIn, FiPlus, FiBarChart2 } from 'react-icons/fi';

export default function Navbar() {
  const { usuario, autenticado, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg" role="navigation" aria-label="Navegação principal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-200 transition-colors" aria-label="Ir para página inicial">
            <FiMap className="text-2xl" aria-hidden="true" />
            <span>AcessaMapa</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Mapa
            </Link>
            <Link
              to="/estatisticas"
              className="px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <FiBarChart2 aria-hidden="true" />
              Estatísticas
            </Link>

            {autenticado ? (
              <>
                <Link
                  to="/novo-local"
                  className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
                  aria-label="Adicionar novo local"
                >
                  <FiPlus aria-hidden="true" />
                  Novo Local
                </Link>
                <span className="text-sm text-blue-200 hidden sm:inline" aria-label={`Logado como ${usuario?.nome}`}>
                  <FiUser className="inline mr-1" aria-hidden="true" />
                  {usuario?.nome}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                  aria-label="Sair da conta"
                >
                  <FiLogOut aria-hidden="true" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <FiLogIn aria-hidden="true" />
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
