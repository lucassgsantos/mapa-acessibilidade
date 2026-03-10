const jwt = require('jsonwebtoken');
const User = require('../models/User');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registro = async (req, res, next) => {
  try {
    const { nome, email, senha, tipoDeficiencia, bio } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    const usuario = await User.create({ nome, email, senha, tipoDeficiencia, bio });

    res.status(201).json({
      usuario,
      token: gerarToken(usuario._id)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    res.json({
      usuario,
      token: gerarToken(usuario._id)
    });
  } catch (error) {
    next(error);
  }
};

exports.perfil = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

exports.atualizarPerfil = async (req, res, next) => {
  try {
    const { nome, bio, tipoDeficiencia } = req.body;
    const usuario = await User.findByIdAndUpdate(
      req.usuario.id,
      { nome, bio, tipoDeficiencia },
      { new: true, runValidators: true }
    );
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};
