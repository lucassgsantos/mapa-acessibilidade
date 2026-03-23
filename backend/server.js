const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dns = require('dns');
require('dotenv').config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Variável de ambiente obrigatória não definida: ${envVar}`);
    process.exit(1);
  }
}

dns.setServers(['8.8.8.8', '8.8.4.4']);

const authRoutes = require('./routes/auth');
const locaisRoutes = require('./routes/locais');
const avaliacoesRoutes = require('./routes/avaliacoes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: corsOrigins, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { mensagem: 'Muitas requisições. Tente novamente em 15 minutos.' }
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { mensagem: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/registro', authLimiter);

app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/locais', locaisRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'API Mapa de Acessibilidade Urbana funcionando!' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
