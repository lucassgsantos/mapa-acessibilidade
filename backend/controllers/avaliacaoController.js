const Avaliacao = require('../models/Avaliacao');
const Local = require('../models/Local');

exports.criarAvaliacao = async (req, res) => {
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

    const avaliacoes = await Avaliacao.find({ local });
    const media = avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length;
    await Local.findByIdAndUpdate(local, { notaAcessibilidade: Math.round(media * 10) / 10 });

    res.status(201).json(avaliacao);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensagem: 'Você já avaliou este local' });
    }
    res.status(500).json({ mensagem: 'Erro ao criar avaliação', erro: error.message });
  }
};

exports.listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ local: req.params.localId })
      .populate('autor', 'nome tipoDeficiencia')
      .sort({ createdAt: -1 });

    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar avaliações', erro: error.message });
  }
};

exports.deletarAvaliacao = async (req, res) => {
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

    const avaliacoes = await Avaliacao.find({ local: localId });
    if (avaliacoes.length > 0) {
      const media = avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length;
      await Local.findByIdAndUpdate(localId, { notaAcessibilidade: Math.round(media * 10) / 10 });
    } else {
      await Local.findByIdAndUpdate(localId, { notaAcessibilidade: 3 });
    }

    res.json({ mensagem: 'Avaliação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar avaliação', erro: error.message });
  }
};
