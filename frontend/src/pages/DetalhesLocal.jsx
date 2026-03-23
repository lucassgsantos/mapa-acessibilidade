import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterLocal, criarAvaliacao, listarAvaliacoes, deletarLocal, deletarAvaliacao } from '../services/api';
import { CATEGORIAS, RECURSOS, TIPOS_DEFICIENCIA } from '../constants';
import { RecursoBadge, CategoriaBadge } from '../components/RecursosInfo';
import StarRating from '../components/StarRating';
import MapaInterativo from '../components/MapaInterativo';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiTrash2, FiSend, FiClock, FiUser } from 'react-icons/fi';

const LIMITE_AVALIACOES = 10;

export default function DetalhesLocal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, autenticado } = useAuth();
  const [dados, setDados] = useState(null);
  const [paginacaoAvaliacoes, setPaginacaoAvaliacoes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 3,
    comentario: '',
    tipoDeficiencia: 'nenhuma',
    recursosConfirmados: {}
  });

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await obterLocal(id, { page: 1, limit: LIMITE_AVALIACOES });
      setDados(data);
      setPaginacaoAvaliacoes(data.paginacaoAvaliacoes || null);
    } catch {
      toast.error('Erro ao carregar local');
      navigate('/');
    } finally {
      setCarregando(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleAvaliacao = async (e) => {
    e.preventDefault();
    if (!autenticado) {
      toast.error('Faça login para avaliar');
      navigate('/login');
      return;
    }

    setEnviando(true);
    try {
      await criarAvaliacao({ ...novaAvaliacao, local: id });
      toast.success('Avaliação adicionada!');
      setNovaAvaliacao({ nota: 3, comentario: '', tipoDeficiencia: 'nenhuma', recursosConfirmados: {} });
      carregarDados();
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao avaliar');
    } finally {
      setEnviando(false);
    }
  };

  const handleCarregarMaisAvaliacoes = async () => {
    if (!paginacaoAvaliacoes?.temProximaPagina || carregandoMais) {
      return;
    }

    setCarregandoMais(true);
    try {
      const proximaPagina = paginacaoAvaliacoes.pagina + 1;
      const { data } = await listarAvaliacoes(id, { page: proximaPagina, limit: LIMITE_AVALIACOES });

      setDados((prev) => ({
        ...prev,
        avaliacoes: [...(prev?.avaliacoes || []), ...(data.avaliacoes || [])]
      }));
      setPaginacaoAvaliacoes(data.paginacao || null);
    } catch {
      toast.error('Erro ao carregar mais avaliações');
    } finally {
      setCarregandoMais(false);
    }
  };

  const handleDeletar = async () => {
    if (!confirm('Tem certeza que deseja remover este local?')) return;
    try {
      await deletarLocal(id);
      toast.success('Local removido');
      navigate('/');
    } catch {
      toast.error('Erro ao remover local');
    }
  };

  const handleDeletarAvaliacao = async (avaliacaoId) => {
    if (!confirm('Remover esta avaliação?')) return;
    try {
      await deletarAvaliacao(avaliacaoId);
      toast.success('Avaliação removida');
      carregarDados();
    } catch {
      toast.error('Erro ao remover avaliação');
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
          <p className="text-gray-500">Carregando local...</p>
        </div>
      </div>
    );
  }

  if (!dados) return null;

  const { local, avaliacoes, mediaAvaliacoes, totalAvaliacoes } = dados;
  const isAutor = usuario && local.autor._id === usuario._id;
  const jaAvaliou = avaliacoes.some(av => av.autor._id === usuario?._id);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg" aria-label="Voltar">
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">{CATEGORIAS[local.categoria]?.emoji}</span>
              <h1 className="text-2xl font-bold text-gray-900">{local.nome}</h1>
            </div>
            <p className="text-gray-600 text-sm">{local.endereco}</p>
          </div>
          {isAutor && (
            <button
              onClick={handleDeletar}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-1"
              aria-label="Remover este local"
            >
              <FiTrash2 /> Remover
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-5 rounded-xl shadow-sm border" aria-label="Detalhes do local">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating nota={mediaAvaliacoes} somenteLeitura tamanho="text-xl" />
                    <span className="text-lg font-bold text-gray-900">{mediaAvaliacoes}</span>
                  </div>
                  <p className="text-sm text-gray-500">{totalAvaliacoes} avaliação(ões)</p>
                </div>
                <CategoriaBadge categoria={local.categoria} />
              </div>

              <p className="text-gray-700 mb-4">{local.descricao}</p>

              <h3 className="font-semibold text-gray-900 mb-2">Recursos de Acessibilidade</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(local.recursos || {}).map(([key, value]) => (
                  <RecursoBadge key={key} recurso={key} ativo={value} />
                ))}
                {Object.values(local.recursos || {}).every(v => !v) && (
                  <p className="text-sm text-gray-400">Nenhum recurso registrado</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                <FiClock className="inline mr-1" aria-hidden="true" />
                Adicionado por {local.autor.nome} em {new Date(local.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </section>

            <section aria-label="Avaliações do local">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Avaliações ({totalAvaliacoes})
              </h2>

              {autenticado && !jaAvaliou && (
                <form onSubmit={handleAvaliacao} className="bg-white p-5 rounded-xl shadow-sm border mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Sua avaliação</h3>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                    <StarRating
                      nota={novaAvaliacao.nota}
                      onChange={(nota) => setNovaAvaliacao({ ...novaAvaliacao, nota })}
                      tamanho="text-2xl"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">Comentário *</label>
                    <textarea
                      id="comentario"
                      required
                      rows={3}
                      maxLength={1000}
                      value={novaAvaliacao.comentario}
                      onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      placeholder="Descreva sua experiência de acessibilidade neste local..."
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="tipoDefAval" className="block text-sm font-medium text-gray-700 mb-1">
                      Sua perspectiva como pessoa com deficiência
                    </label>
                    <select
                      id="tipoDefAval"
                      value={novaAvaliacao.tipoDeficiencia}
                      onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, tipoDeficiencia: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {Object.entries(TIPOS_DEFICIENCIA).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiSend aria-hidden="true" />
                    {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                  </button>
                </form>
              )}

              {jaAvaliou && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-700 mb-4">
                  ✅ Você já avaliou este local.
                </div>
              )}

              {!autenticado && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700 mb-4">
                  <Link to="/login" className="font-medium hover:underline">Faça login</Link> para adicionar sua avaliação.
                </div>
              )}

              <div className="space-y-3">
                {avaliacoes.map((av) => (
                  <article key={av._id} className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="text-blue-600 text-sm" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{av.autor.nome}</p>
                          {av.tipoDeficiencia !== 'nenhuma' && (
                            <p className="text-xs text-gray-500">Deficiência {TIPOS_DEFICIENCIA[av.tipoDeficiencia]?.toLowerCase()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating nota={av.nota} somenteLeitura tamanho="text-sm" />
                        {usuario && av.autor._id === usuario._id && (
                          <button
                            onClick={() => handleDeletarAvaliacao(av._id)}
                            className="text-red-400 hover:text-red-600 p-1"
                            aria-label="Remover sua avaliação"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{av.comentario}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(av.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </article>
                ))}

                {avaliacoes.length === 0 && (
                  <p className="text-center text-gray-400 py-8">Nenhuma avaliação ainda. Seja o primeiro!</p>
                )}

                {paginacaoAvaliacoes?.temProximaPagina && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleCarregarMaisAvaliacoes}
                      disabled={carregandoMais}
                      className="px-5 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {carregandoMais ? 'Carregando...' : 'Carregar mais avaliações'}
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-3">Localização</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapaInterativo
                  locais={[local]}
                  centroInicial={[local.coordenadas.lat, local.coordenadas.lng]}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-3">Resumo de Acessibilidade</h3>
              <div className="space-y-2">
                {Object.entries(RECURSOS).map(([key, info]) => {
                  const Icon = info.icon;
                  const disponivel = local.recursos?.[key];
                  return (
                    <div key={key} className={`flex items-center gap-2 text-sm ${disponivel ? 'text-green-700' : 'text-gray-400'}`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span>{info.label}</span>
                      <span className="ml-auto" aria-hidden="true">{disponivel ? '✅' : '❌'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
