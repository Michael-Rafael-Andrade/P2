// routes/categoria.js
var express = require('express');
var router = express.Router();
var categoriaController = require('../controller/categoria');

/* GET / (Listar todas) */
router.get('/', categoriaController.listAll);

/* Criação */
router.get('/criar', categoriaController.formCreate);
router.post('/', categoriaController.create);

/* Edição */
// 1. Exibir o formulário pré-preenchido
router.get('/:id/editar', categoriaController.formEdit);
// 2. Processar a atualização (usamos POST, dependendo do method-override)
router.post('/:id', categoriaController.update);

/* Exclusão */
// 3. Processar a exclusão (DELETE)
router.delete('/:id', categoriaController.delete);

module.exports = router;