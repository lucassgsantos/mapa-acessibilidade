import { useState, useEffect } from 'react';
import { obterEstatisticas } from '../services/api';
import { CATEGORIAS, RECURSOS } from '../constants';
import { FiBarChart2, FiMapPin, FiStar, FiUsers } from 'react-icons/fi';

export default function Estatisticas() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const { data } = await obterEstatisticas();
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-gray-500">Nenhuma estatística disponível ainda.</p>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FiBarChart2 className="text-blue-600" aria-hidden="true" />
          Estatísticas de Acessibilidade
        </h1>
        <p className="text-gray-600 mb-8">Visão geral da acessibilidade urbana mapeada pela comunidade</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" role="region" aria-label="Resumo geral">
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <FiMapPin className="text-3xl text-blue-600 mx-auto mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold text-gray-900">{dados.totalLocais}</p>
            <p className="text-sm text-gray-500">Locais mapeados</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <FiStar className="text-3xl text-yellow-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold text-gray-900">{dados.totalAvaliacoes}</p>
            <p className="text-sm text-gray-500">Avaliações feitas</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <FiUsers className="text-3xl text-green-600 mx-auto mb-2" aria-hidden="true" />
            <p className="text-3xl font-bold text-gray-900">{dados.porCategoria?.length || 0}</p>
            <p className="text-sm text-gray-500">Categorias cobertas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border" aria-label="Estatísticas por categoria">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Categoria</h2>
            {dados.porCategoria?.length > 0 ? (
              <div className="space-y-3">
                {dados.porCategoria.map((cat) => {
                  const info = CATEGORIAS[cat._id];
                  const maxTotal = Math.max(...dados.porCategoria.map(c => c.total));
                  const percentual = (cat.total / maxTotal) * 100;

                  return (
                    <div key={cat._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {info?.emoji} {info?.label || cat._id}
                        </span>
                        <span className="text-sm text-gray-500">
                          {cat.total} local(is) • ⭐ {cat.mediaAcessibilidade?.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3" role="progressbar" aria-valuenow={cat.total} aria-valuemax={maxTotal}>
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Nenhuma categoria registrada</p>
            )}
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border" aria-label="Recursos mais comuns">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recursos Mais Comuns</h2>
            {dados.recursosComuns?.length > 0 ? (
              <div className="space-y-3">
                {dados.recursosComuns.map((rec) => {
                  const info = RECURSOS[rec._id];
                  const Icon = info?.icon;
                  const maxTotal = Math.max(...dados.recursosComuns.map(r => r.total));
                  const percentual = (rec.total / maxTotal) * 100;

                  return (
                    <div key={rec._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                          {info?.label || rec._id}
                        </span>
                        <span className="text-sm text-gray-500">{rec.total} local(is)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3" role="progressbar" aria-valuenow={rec.total} aria-valuemax={maxTotal}>
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Nenhum recurso registrado</p>
            )}
          </section>
        </div>

        <section className="mt-8 bg-white p-6 rounded-xl shadow-sm border" aria-label="Legenda de cores do mapa">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Legenda do Mapa</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { nota: 1, cor: 'bg-red-600', label: 'Inacessível' },
              { nota: 2, cor: 'bg-orange-600', label: 'Pouco acessível' },
              { nota: 3, cor: 'bg-yellow-600', label: 'Parcialmente acessível' },
              { nota: 4, cor: 'bg-lime-600', label: 'Acessível' },
              { nota: 5, cor: 'bg-green-600', label: 'Totalmente acessível' }
            ].map((item) => (
              <div key={item.nota} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${item.cor} flex items-center justify-center text-white text-xs font-bold`}>
                  {item.nota}
                </div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
