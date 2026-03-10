const Avaliacao = require('../models/Avaliacao');
const Local = require('../models/Local');
const { recalcularMedia } = require('../utils/calcularMedia');

exports.criarAvaliacao = async (req, res, next) => {
  try {
    const { local, nota, comentario, recursosConfirmados, tipoDeficiencia } = req.body;

    const localExiste = await Local.findById(local);
    if (!localExiste) {
      return res.status(404).json({ mensagem: 'Local não encontrado' });
    }

    const avaliacaoExistente = await Avaliacao.findOne({ local, autor: req.usuario.id });
    if (avaliacaoExistente) {
      return res.status(400).json({ mensagem: 'Você já avaliou este local' });
    }

    const avaliacao = await Avaliacao.create({
      local,
      autor: req.usuario.id,
      nota,
      comentario,
      recursosConfirmados,
      tipoDeficiencia
    });

    await avaliacao.populate('autor', 'nome tipoDeficiencia');
    await recalcularMedia(local);

    res.status(201).json(avaliacao);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensagem: 'Você já avaliou este local' });
    }
    next(error);
  }
};

exports.listarAvaliacoes = async (req, res, next) => {
  try {
    const avaliacoes = await Avaliacao.find({ local: req.params.localId })
      .populate('autor', 'nome tipoDeficiencia')
      .sort({ createdAt: -1 });

    res.json(avaliacoes);
  } catch (error) {
    next(error);
  }
};

exports.deletarAvaliacao = async (req, res, next) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id);

    if (!avaliacao) {
      return res.status(404).json({ mensagem: 'Avaliação não encontrada' });
    }

    if (avaliacao.autor.toString() !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Não autorizado' });
    }

    const localId = avaliacao.local;
    await Avaliacao.findByIdAndDelete(req.params.id);
    await recalcularMedia(localId);

    res.json({ mensagem: 'Avaliação removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
