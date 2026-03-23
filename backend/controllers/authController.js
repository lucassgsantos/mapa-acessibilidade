const jwt = require('jsonwebtoken');
const User = require('../models/User');

const gerarAccessToken = (id, tokenVersion) => {
  return jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const gerarRefreshToken = (id, tokenVersion) => {
  return jwt.sign({ id, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const gerarSessao = (usuario) => {
  const token = gerarAccessToken(usuario._id, usuario.tokenVersion);
  const refreshToken = gerarRefreshToken(usuario._id, usuario.tokenVersion);

  return {
    token,
    accessToken: token,
    refreshToken
  };
};

exports.registro = async (req, res, next) => {
  try {
    const { nome, email, senha, tipoDeficiencia, bio } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    const usuario = await User.create({ nome, email, senha, tipoDeficiencia, bio });
    const sessao = gerarSessao(usuario);

    res.status(201).json({
      usuario,
      ...sessao
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

    const sessao = gerarSessao(usuario);

    res.json({
      usuario,
      ...sessao
    });
  } catch (error) {
    next(error);
  }
};

exports.renovarSessao = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        mensagem: 'Refresh token é obrigatório',
        codigo: 'REFRESH_TOKEN_NAO_FORNECIDO'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          mensagem: 'Refresh token expirado. Faça login novamente.',
          codigo: 'REFRESH_TOKEN_EXPIRADO'
        });
      }

      return res.status(401).json({
        mensagem: 'Refresh token inválido.',
        codigo: 'REFRESH_TOKEN_INVALIDO'
      });
    }

    if (!Number.isInteger(decoded.tokenVersion)) {
      return res.status(401).json({
        mensagem: 'Token de sessão inválido.',
        codigo: 'TOKEN_SESSAO_INVALIDO'
      });
    }

    const usuario = await User.findById(decoded.id).select('tokenVersion');
    if (!usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não encontrado',
        codigo: 'USUARIO_NAO_ENCONTRADO'
      });
    }

    if (usuario.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        mensagem: 'Sessão invalidada. Faça login novamente.',
        codigo: 'SESSAO_INVALIDADA'
      });
    }

    const sessao = gerarSessao(usuario);
    return res.json(sessao);
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
