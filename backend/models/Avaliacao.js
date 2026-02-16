const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  local: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Local',
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nota: {
    type: Number,
    required: [true, 'Nota é obrigatória'],
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: [true, 'Comentário é obrigatório'],
    maxlength: 1000
  },
  recursosConfirmados: {
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
  tipoDeficiencia: {
    type: String,
    enum: ['visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra', 'nenhuma'],
    default: 'nenhuma'
  }
}, {
  timestamps: true
});

avaliacaoSchema.index({ local: 1, autor: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);
