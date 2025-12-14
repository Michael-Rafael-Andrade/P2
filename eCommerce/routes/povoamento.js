// routes/povoamento.js
var express = require('express');
var router = express.Router();

// 1. Importa o Controller de Povoamento
var povoamentoController = require('../controller/povoamento');

/* GET /povoamento (Rota para executar a inserção de dados) */
// A rota raiz (/) deste arquivo, que é mapeada para /povoamento no app.js,
// chama o método 'index' do controller.
router.get('/', povoamentoController.index);

module.exports = router;