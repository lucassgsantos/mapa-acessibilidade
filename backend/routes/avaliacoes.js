const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { criarAvaliacao, listarAvaliacoes, deletarAvaliacao } = require('../controllers/avaliacaoController');
const auth = require('../middleware/auth');

const recursosValidos = [
  'rampa',
  'elevador',
  'banheiroAcessivel',
  'pisoTatil',
  'sinalizacaoBraile',
  'estacionamentoAcessivel',
  'portaLarga',
  'libras',
  'audioDescricao',
  'caoPermitido'
];

const validarRecursosConfirmados = (valor) => {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new Error('Recursos confirmados deve ser um objeto válido');
  }

  for (const [chave, valorRecurso] of Object.entries(valor)) {
    if (!recursosValidos.includes(chave)) {
      throw new Error(`Recurso confirmado inválido: ${chave}`);
    }

    if (typeof valorRecurso !== 'boolean') {
      throw new Error(`O recurso confirmado ${chave} deve ser booleano`);
    }
  }

  return true;
};

const criarAvaliacaoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.usuario?._id?.toString() || req.ip,
  message: { mensagem: 'Muitas avaliações enviadas. Tente novamente mais tarde.' }
});

router.post('/', auth, criarAvaliacaoLimiter, [
  body('local').isMongoId().withMessage('ID do local inválido'),
  body('nota').isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5'),
  body('comentario').trim().notEmpty().withMessage('Comentário é obrigatório').isLength({ max: 1000 }).withMessage('Comentário deve ter no máximo 1000 caracteres'),
  body('tipoDeficiencia').optional().isIn(['visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra', 'nenhuma']).withMessage('Tipo de deficiência inválido'),
  body('recursosConfirmados').optional().custom(validarRecursosConfirmados),
  validate
], criarAvaliacao);

router.get('/local/:localId', [
  param('localId').isMongoId().withMessage('ID do local inválido'),
  validate
], listarAvaliacoes);

router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('ID da avaliação inválido'),
  validate
], deletarAvaliacao);

module.exports = router;
