const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { criarAvaliacao, listarAvaliacoes, deletarAvaliacao } = require('../controllers/avaliacaoController');
const auth = require('../middleware/auth');

router.post('/', auth, [
  body('local').isMongoId().withMessage('ID do local inválido'),
  body('nota').isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5'),
  body('comentario').trim().notEmpty().withMessage('Comentário é obrigatório').isLength({ max: 1000 }).withMessage('Comentário deve ter no máximo 1000 caracteres'),
  body('tipoDeficiencia').optional().isIn(['visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra', 'nenhuma']).withMessage('Tipo de deficiência inválido'),
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
