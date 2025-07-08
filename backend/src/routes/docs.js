const express = require('express');
const router = express.Router();

// Exemplo de documentação Swagger (estrutura inicial)
router.get('/', (req, res) => {
  res.json({
    info: {
      title: 'API - Sistema de Agendamento de Consultas',
      version: '1.0.0',
      description: 'Documentação da API em construção.'
    },
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/appointments',
      '/api/users/doctors',
      '/api/users/profile'
    ]
  });
});

module.exports = router; 