const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        mensagem: 'Acesso não autorizado. Token não fornecido.',
        codigo: 'TOKEN_NAO_FORNECIDO'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!Number.isInteger(decoded.tokenVersion)) {
      return res.status(401).json({
        mensagem: 'Token de sessão inválido.',
        codigo: 'TOKEN_SESSAO_INVALIDO'
      });
    }

    const usuario = await User.findById(decoded.id).select('-senha tokenVersion');

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

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        mensagem: 'Token expirado. Faça login novamente.',
        codigo: 'TOKEN_EXPIRADO'
      });
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(401).json({
        mensagem: 'Token inválido.',
        codigo: 'TOKEN_INVALIDO'
      });
    }

    return res.status(401).json({
      mensagem: 'Falha de autenticação.',
      codigo: 'FALHA_AUTENTICACAO'
    });
  }
};

module.exports = auth;
