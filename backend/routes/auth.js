const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { registro, login, renovarSessao, perfil, atualizarPerfil } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/registro', [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 100 }).withMessage('Nome deve ter no máximo 100 caracteres'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Senha deve conter ao menos uma letra maiúscula')
    .matches(/[0-9]/).withMessage('Senha deve conter ao menos um número'),
  body('tipoDeficiencia').optional().isIn(['nenhuma', 'visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra']).withMessage('Tipo de deficiência inválido'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio deve ter no máximo 500 caracteres'),
  validate
], registro);

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
  validate
], login);

router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório'),
  validate
], renovarSessao);

router.get('/perfil', auth, perfil);

router.put('/perfil', auth, [
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode ser vazio').isLength({ max: 100 }),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio deve ter no máximo 500 caracteres'),
  body('tipoDeficiencia').optional().isIn(['nenhuma', 'visual', 'auditiva', 'motora', 'cognitiva', 'multipla', 'outra']).withMessage('Tipo de deficiência inválido'),
  validate
], atualizarPerfil);

module.exports = router;
