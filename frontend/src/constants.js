import {
  FiCornerDownRight,
  FiArrowUp,
  FiDroplet,
  FiGrid,
  FiEye,
  FiTruck,
  FiMaximize,
  FiMessageSquare,
  FiHeadphones,
  FiHeart
} from 'react-icons/fi';

export const CATEGORIAS = {
  restaurante: { label: 'Restaurante', emoji: '🍽️' },
  hospital: { label: 'Hospital', emoji: '🏥' },
  escola: { label: 'Escola', emoji: '🏫' },
  mercado: { label: 'Mercado', emoji: '🛒' },
  transporte: { label: 'Transporte', emoji: '🚌' },
  lazer: { label: 'Lazer', emoji: '🎭' },
  servico_publico: { label: 'Serviço Público', emoji: '🏛️' },
  comercio: { label: 'Comércio', emoji: '🏪' },
  hotel: { label: 'Hotel', emoji: '🏨' },
  outro: { label: 'Outro', emoji: '📍' }
};

export const RECURSOS = {
  rampa: { label: 'Rampa de Acesso', icon: FiCornerDownRight, cor: 'blue' },
  elevador: { label: 'Elevador', icon: FiArrowUp, cor: 'purple' },
  banheiroAcessivel: { label: 'Banheiro Acessível', icon: FiDroplet, cor: 'cyan' },
  pisoTatil: { label: 'Piso Tátil', icon: FiGrid, cor: 'yellow' },
  sinalizacaoBraile: { label: 'Sinalização em Braile', icon: FiEye, cor: 'orange' },
  estacionamentoAcessivel: { label: 'Estacionamento Acessível', icon: FiTruck, cor: 'green' },
  portaLarga: { label: 'Porta Larga', icon: FiMaximize, cor: 'teal' },
  libras: { label: 'Intérprete de Libras', icon: FiMessageSquare, cor: 'pink' },
  audioDescricao: { label: 'Audiodescrição', icon: FiHeadphones, cor: 'indigo' },
  caoPermitido: { label: 'Cão-guia Permitido', icon: FiHeart, cor: 'red' }
};

export const TIPOS_DEFICIENCIA = {
  nenhuma: 'Nenhuma',
  visual: 'Visual',
  auditiva: 'Auditiva',
  motora: 'Motora',
  cognitiva: 'Cognitiva',
  multipla: 'Múltipla',
  outra: 'Outra'
};
