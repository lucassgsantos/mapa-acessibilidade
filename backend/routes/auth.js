const express = require('express');
const router = express.Router();
const { registro, login, perfil, atualizarPerfil } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', auth, perfil);
router.put('/perfil', auth, atualizarPerfil);

module.exports = router;
