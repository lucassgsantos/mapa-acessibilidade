const Avaliacao = require('../models/Avaliacao');
const Local = require('../models/Local');

async function recalcularMedia(localId) {
  const avaliacoes = await Avaliacao.find({ local: localId });
  const nota = avaliacoes.length > 0
    ? Math.round((avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length) * 10) / 10
    : 3;
  await Local.findByIdAndUpdate(localId, { notaAcessibilidade: nota });
  return nota;
}

module.exports = { recalcularMedia };
