import { useState, useEffect, useCallback } from 'react';
import MapaInterativo from '../components/MapaInterativo';
import { listarLocais } from '../services/api';
import { CATEGORIAS, RECURSOS } from '../constants';
import { RecursoBadge, CategoriaBadge } from '../components/RecursosInfo';
import StarRating from '../components/StarRating';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function Home() {
  const [locais, setLocais] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [busca, setBusca] = useState('');
  const [filtroPainel, setFiltroPainel] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregarLocais = useCallback(async () => {
    try {
      setCarregando(true);
      const params = { ...filtros };
      if (busca) params.busca = busca;
      const { data } = await listarLocais(params);
      setLocais(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setCarregando(false);
    }
  }, [filtros, busca]);

  useEffect(() => {
    carregarLocais();
  }, [carregarLocais]);

  const handleBusca = (e) => {
    e.preventDefault();
    carregarLocais();
  };

  const limparFiltros = () => {
    setFiltros({});
    setBusca('');
  };

  return (
    <main className="flex flex-col h-[calc(100vh-64px)]" id="conteudo-principal">
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <form onSubmit={handleBusca} className="flex-1 min-w-[250px] flex gap-2" role="search">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar locais por nome, endereço..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label="Buscar locais"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Buscar
            </button>
          </form>

          <button
            onClick={() => setFiltroPainel(!filtroPainel)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
            aria-expanded={filtroPainel}
            aria-controls="painel-filtros"
          >
            <FiFilter aria-hidden="true" />
            Filtros
            {Object.keys(filtros).length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-1.5 rounded-full">{Object.keys(filtros).length}</span>
            )}
          </button>

          {Object.keys(filtros).length > 0 && (
            <button
              onClick={limparFiltros}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
              aria-label="Limpar todos os filtros"
            >
              <FiX aria-hidden="true" />
              Limpar
            </button>
          )}
        </div>

        {filtroPainel && (
          <div id="painel-filtros" className="max-w-7xl mx-auto mt-3 p-4 bg-gray-50 rounded-lg border" role="region" aria-label="Filtros de busca">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  aria-label="Filtrar por categoria"
                >
                  <option value="">Todas</option>
                  {Object.entries(CATEGORIAS).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota mínima</label>
                <select
                  value={filtros.nota || ''}
                  onChange={(e) => setFiltros({ ...filtros, nota: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  aria-label="Filtrar por nota m\u00ednima"
                >
                  <option value="">Qualquer</option>
                  <option value="2">⭐ 2+</option>
                  <option value="3">⭐ 3+</option>
                  <option value="4">⭐ 4+</option>
                  <option value="5">⭐ 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurso</label>
                <select
                  value={filtros.recurso || ''}
                  onChange={(e) => setFiltros({ ...filtros, recurso: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  aria-label="Filtrar por recurso de acessibilidade"
                >
                  <option value="">Qualquer</option>
                  {Object.entries(RECURSOS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r overflow-y-auto hidden lg:block" aria-label="Lista de locais">
          <div className="p-3 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              {carregando ? 'Carregando...' : `${locais.length} local(is) encontrado(s)`}
            </h2>
          </div>
          <ul className="divide-y">
            {locais.map((local) => (
              <li key={local._id}>
                <Link
                  to={`/local/${local._id}`}
                  className="block p-3 hover:bg-blue-50 transition-colors"
                  aria-label={`${local.nome} - nota ${local.notaAcessibilidade} de 5`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg" aria-hidden="true">{CATEGORIAS[local.categoria]?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{local.nome}</h3>
                      <p className="text-xs text-gray-500 truncate">{local.endereco}</p>
                      <div className="mt-1">
                        <StarRating nota={local.notaAcessibilidade} somenteLeitura tamanho="text-xs" />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(local.recursos || {}).filter(([, v]) => v).slice(0, 3).map(([key]) => (
                          <RecursoBadge key={key} recurso={key} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {locais.length === 0 && !carregando && (
              <li className="p-6 text-center text-gray-500 text-sm">
                <p>Nenhum local encontrado.</p>
                <Link to="/novo-local" className="text-blue-600 hover:underline mt-1 inline-block">
                  Adicione o primeiro local!
                </Link>
              </li>
            )}
          </ul>
        </aside>

        <div className="flex-1" role="region" aria-label="Mapa de acessibilidade">
          <MapaInterativo locais={locais} />
        </div>
      </div>
    </main>
  );
}
