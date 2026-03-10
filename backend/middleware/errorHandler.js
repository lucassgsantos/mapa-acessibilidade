const errorHandler = (err, req, res, _next) => {
  console.error('Erro:', err.message, err.stack);

  if (err.name === 'ValidationError') {
    const mensagens = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ mensagem: 'Dados inválidos', erros: mensagens });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ mensagem: 'Registro duplicado' });
  }

  const status = err.statusCode || 500;
  const mensagem = status === 500 ? 'Erro interno do servidor' : err.message;
  res.status(status).json({ mensagem });
};

module.exports = errorHandler;
