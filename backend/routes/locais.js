const express = require('express');
const router = express.Router();
const {
  criarLocal,
  listarLocais,
  obterLocal,
  atualizarLocal,
  deletarLocal,
  estatisticas
} = require('../controllers/localController');
const auth = require('../middleware/auth');

router.get('/estatisticas/geral', estatisticas);

router.get('/', listarLocais);
router.get('/:id', obterLocal);
router.post('/', auth, criarLocal);
router.put('/:id', auth, atualizarLocal);
router.delete('/:id', auth, deletarLocal);

module.exports = router;
