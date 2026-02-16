const express = require('express');
const router = express.Router();
const { criarAvaliacao, listarAvaliacoes, deletarAvaliacao } = require('../controllers/avaliacaoController');
const auth = require('../middleware/auth');

router.post('/', auth, criarAvaliacao);
router.get('/local/:localId', listarAvaliacoes);
router.delete('/:id', auth, deletarAvaliacao);

module.exports = router;
