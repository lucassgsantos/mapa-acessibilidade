const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do local é obrigatório'],
    trim: true,
    maxlength: 200
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: 1000
  },
  endereco: {
    type: String,
    required: [true, 'Endereço é obrigatório'],
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    enum: [
      'restaurante',
      'hospital',
      'escola',
      'mercado',
      'transporte',
      'lazer',
      'servico_publico',
      'comercio',
      'hotel',
      'outro'
    ]
  },
  coordenadas: {
    lat: {
      type: Number,
      required: [true, 'Latitude é obrigatória'],
      min: [-90, 'Latitude deve ser no mínimo -90'],
      max: [90, 'Latitude deve ser no máximo 90']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude é obrigatória'],
      min: [-180, 'Longitude deve ser no mínimo -180'],
      max: [180, 'Longitude deve ser no máximo 180']
    }
  },
  recursos: {
    rampa: { type: Boolean, default: false },
    elevador: { type: Boolean, default: false },
    banheiroAcessivel: { type: Boolean, default: false },
    pisoTatil: { type: Boolean, default: false },
    sinalizacaoBraile: { type: Boolean, default: false },
    estacionamentoAcessivel: { type: Boolean, default: false },
    portaLarga: { type: Boolean, default: false },
    libras: { type: Boolean, default: false },
    audioDescricao: { type: Boolean, default: false },
    caoPermitido: { type: Boolean, default: false }
  },
  notaAcessibilidade: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fotos: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['ativo', 'pendente', 'inativo'],
    default: 'ativo'
  }
}, {
  timestamps: true
});

localSchema.index({ 'coordenadas.lat': 1, 'coordenadas.lng': 1 });
localSchema.index({ categoria: 1 });
localSchema.index({ notaAcessibilidade: -1 });

module.exports = mongoose.model('Local', localSchema);
