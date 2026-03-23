const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [8, 'Senha deve ter no mínimo 8 caracteres']
  },
  avatar: {
    type: String,
    default: ''
  },
  tipoDeficiencia: {
    type: String,
    enum: ['nenhuma', 'visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra'],
    default: 'nenhuma'
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  tokenVersion: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

userSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
