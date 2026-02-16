const Local = require('../models/Local');
const Avaliacao = require('../models/Avaliacao');

exports.criarLocal = async (req, res) => {
  try {
    const dados = { ...req.body, autor: req.usuario.id };
    const local = await Local.create(dados);
    await local.populate('autor', 'nome email');
    res.status(201).json(local);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar local', erro: error.message });
  }
};

exports.listarLocais = async (req, res) => {
  try {
    const { categoria, nota, recurso, busca } = req.query;
    let filtro = { status: 'ativo' };

    if (categoria) filtro.categoria = categoria;
    if (nota) filtro.notaAcessibilidade = { $gte: Number(nota) };
    if (recurso) filtro[`recursos.${recurso}`] = true;
    if (busca) {
      filtro.$or = [
        { nome: { $regex: busca, $options: 'i' } },
        { endereco: { $regex: busca, $options: 'i' } },
        { descricao: { $regex: busca, $options: 'i' } }
      ];
    }

    const locais = await Local.find(filtro)
      .populate('autor', 'nome')
      .sort({ createdAt: -1 });

    res.json(locais);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar locais', erro: error.message });
  }
};

exports.obterLocal = async (req, res) => {
  try {
    const local = await Local.findById(req.params.id)
      .populate('autor', 'nome email');

    if (!local) {
      return res.status(404).json({ mensagem: 'Local não encontrado' });
    }

    const avaliacoes = await Avaliacao.find({ local: local._id })
      .populate('autor', 'nome tipoDeficiencia')
      .sort({ createdAt: -1 });

    const mediaAvaliacoes = avaliacoes.length > 0
      ? avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length
      : local.notaAcessibilidade;

    res.json({
      local,
      avaliacoes,
      mediaAvaliacoes: Math.round(mediaAvaliacoes * 10) / 10,
      totalAvaliacoes: avaliacoes.length
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar local', erro: error.message });
  }
};

exports.atualizarLocal = async (req, res) => {
  try {
    let local = await Local.findById(req.params.id);

    if (!local) {
      return res.status(404).json({ mensagem: 'Local não encontrado' });
    }

    if (local.autor.toString() !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Não autorizado a editar este local' });
    }

    local = await Local.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('autor', 'nome email');

    res.json(local);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar local', erro: error.message });
  }
};

exports.deletarLocal = async (req, res) => {
  try {
    const local = await Local.findById(req.params.id);

    if (!local) {
      return res.status(404).json({ mensagem: 'Local não encontrado' });
    }

    if (local.autor.toString() !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Não autorizado a deletar este local' });
    }

    await Local.findByIdAndDelete(req.params.id);
    await Avaliacao.deleteMany({ local: req.params.id });

    res.json({ mensagem: 'Local removido com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar local', erro: error.message });
  }
};

exports.estatisticas = async (req, res) => {
  try {
    const totalLocais = await Local.countDocuments({ status: 'ativo' });
    const totalAvaliacoes = await Avaliacao.countDocuments();

    const porCategoria = await Local.aggregate([
      { $match: { status: 'ativo' } },
      { $group: { _id: '$categoria', total: { $sum: 1 }, mediaAcessibilidade: { $avg: '$notaAcessibilidade' } } },
      { $sort: { total: -1 } }
    ]);

    const recursosComuns = await Local.aggregate([
      { $match: { status: 'ativo' } },
      { $project: {
        recursos: [
          { nome: 'rampa', tem: '$recursos.rampa' },
          { nome: 'elevador', tem: '$recursos.elevador' },
          { nome: 'banheiroAcessivel', tem: '$recursos.banheiroAcessivel' },
          { nome: 'pisoTatil', tem: '$recursos.pisoTatil' },
          { nome: 'sinalizacaoBraile', tem: '$recursos.sinalizacaoBraile' },
          { nome: 'estacionamentoAcessivel', tem: '$recursos.estacionamentoAcessivel' },
          { nome: 'portaLarga', tem: '$recursos.portaLarga' },
          { nome: 'libras', tem: '$recursos.libras' },
          { nome: 'audioDescricao', tem: '$recursos.audioDescricao' },
          { nome: 'caoPermitido', tem: '$recursos.caoPermitido' }
        ]
      }},
      { $unwind: '$recursos' },
      { $match: { 'recursos.tem': true } },
      { $group: { _id: '$recursos.nome', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      totalLocais,
      totalAvaliacoes,
      porCategoria,
      recursosComuns
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar estatísticas', erro: error.message });
  }
};
