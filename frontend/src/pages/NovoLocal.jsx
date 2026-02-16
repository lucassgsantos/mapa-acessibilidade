import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapaInterativo from '../components/MapaInterativo';
import { criarLocal } from '../services/api';
import { CATEGORIAS, RECURSOS } from '../constants';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { FiMapPin, FiSave, FiArrowLeft } from 'react-icons/fi';

export default function NovoLocal() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [coordenadas, setCoordenadas] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    categoria: 'outro',
    notaAcessibilidade: 3,
    recursos: {
      rampa: false,
      elevador: false,
      banheiroAcessivel: false,
      pisoTatil: false,
      sinalizacaoBraile: false,
      estacionamentoAcessivel: false,
      portaLarga: false,
      libras: false,
      audioDescricao: false,
      caoPermitido: false
    }
  });

  const handleRecurso = (recurso) => {
    setForm({
      ...form,
      recursos: {
        ...form.recursos,
        [recurso]: !form.recursos[recurso]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coordenadas) {
      toast.error('Clique no mapa para selecionar a localização!');
      return;
    }

    setCarregando(true);
    try {
      const dados = {
        ...form,
        coordenadas: { lat: coordenadas.lat, lng: coordenadas.lng }
      };
      const { data } = await criarLocal(dados);
      toast.success('Local adicionado com sucesso!');
      navigate(`/local/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.mensagem || 'Erro ao adicionar local');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Local</h1>
            <p className="text-gray-600 text-sm">Contribua com o mapa de acessibilidade</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-xl shadow-sm border space-y-4">
              <h2 className="font-semibold text-gray-900 text-lg">Informações do Local</h2>

              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do local *</label>
                <input
                  id="nome"
                  type="text"
                  required
                  maxLength={200}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Shopping Centro"
                />
              </div>

              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                <input
                  id="endereco"
                  type="text"
                  required
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  id="categoria"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(CATEGORIAS).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <textarea
                  id="descricao"
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  placeholder="Descreva a acessibilidade do local..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota de acessibilidade *</label>
                <StarRating
                  nota={form.notaAcessibilidade}
                  onChange={(nota) => setForm({ ...form, notaAcessibilidade: nota })}
                  tamanho="text-2xl"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Recursos de Acessibilidade</h2>
              <p className="text-sm text-gray-500 mb-4">Selecione os recursos disponíveis neste local</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Recursos de acessibilidade disponíveis">
                {Object.entries(RECURSOS).map(([key, info]) => {
                  const Icon = info.icon;
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${form.recursos[key]
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.recursos[key]}
                        onChange={() => handleRecurso(key)}
                        className="sr-only"
                      />
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium">{info.label}</span>
                      {form.recursos[key] && (
                        <span className="ml-auto text-blue-600 text-lg" aria-hidden="true">✓</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
            >
              <FiSave aria-hidden="true" />
              {carregando ? 'Salvando...' : 'Salvar Local'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin className="text-blue-600" aria-hidden="true" />
                <h2 className="font-semibold text-gray-900">Localização no Mapa</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Clique no mapa para marcar a localização do local
              </p>
              {coordenadas && (
                <p className="text-xs text-green-600 font-medium mb-2">
                  ✅ Localização selecionada: {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
                </p>
              )}
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapaInterativo
                  onLocationSelect={(latlng) => setCoordenadas(latlng)}
                  marcadorSelecionado={coordenadas}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
