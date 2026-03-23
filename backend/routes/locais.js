const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const {
  criarLocal,
  listarLocais,
  obterLocal,
  atualizarLocal,
  deletarLocal,
  estatisticas
} = require('../controllers/localController');
const auth = require('../middleware/auth');

const categorias = ['restaurante', 'hospital', 'escola', 'mercado', 'transporte', 'lazer', 'servico_publico', 'comercio', 'hotel', 'outro'];
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

const validarRecursos = (valor) => {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new Error('Recursos deve ser um objeto válido');
  }

  for (const [chave, valorRecurso] of Object.entries(valor)) {
    if (!recursosValidos.includes(chave)) {
      throw new Error(`Recurso inválido: ${chave}`);
    }

    if (typeof valorRecurso !== 'boolean') {
      throw new Error(`O recurso ${chave} deve ser booleano`);
    }
  }

  return true;
};

const validarLocal = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 200 }).withMessage('Nome deve ter no máximo 200 caracteres'),
  body('descricao').trim().notEmpty().withMessage('Descrição é obrigatória').isLength({ max: 1000 }).withMessage('Descrição deve ter no máximo 1000 caracteres'),
  body('endereco').trim().notEmpty().withMessage('Endereço é obrigatório'),
  body('categoria').isIn(categorias).withMessage('Categoria inválida'),
  body('coordenadas.lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude deve estar entre -90 e 90'),
  body('coordenadas.lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude deve estar entre -180 e 180'),
  body('recursos').optional().custom(validarRecursos),
  validate
];

const validarAtualizacaoLocal = [
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode ser vazio').isLength({ max: 200 }).withMessage('Nome deve ter no máximo 200 caracteres'),
  body('descricao').optional().trim().notEmpty().withMessage('Descrição não pode ser vazia').isLength({ max: 1000 }).withMessage('Descrição deve ter no máximo 1000 caracteres'),
  body('endereco').optional().trim().notEmpty().withMessage('Endereço não pode ser vazio'),
  body('categoria').optional().isIn(categorias).withMessage('Categoria inválida'),
  body('coordenadas.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude deve estar entre -90 e 90'),
  body('coordenadas.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude deve estar entre -180 e 180'),
  body('notaAcessibilidade').optional().isInt({ min: 1, max: 5 }).withMessage('Nota de acessibilidade deve ser entre 1 e 5'),
  body('recursos').optional().custom(validarRecursos),
  validate
];

const validarId = [
  param('id').isMongoId().withMessage('ID inválido'),
  validate
];

router.get('/estatisticas/geral', estatisticas);

router.get('/', listarLocais);
router.get('/:id', validarId, obterLocal);
router.post('/', auth, validarLocal, criarLocal);
router.put('/:id', auth, validarId, validarAtualizacaoLocal, atualizarLocal);
router.delete('/:id', auth, validarId, deletarLocal);

module.exports = router;
