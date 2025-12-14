// routes/usuario.js
var express = require('express');
var router = express.Router();

// 1. Importa o Controller de Usuário (que criaremos a seguir)
var usuarioController = require('../controller/usuario');

/* GET /usuario/login (Exibe o formulário de login) */
router.get('/login', usuarioController.formLogin);

/* GET /usuario/cadastro (Exibe o formulário de cadastro) */
router.get('/cadastro', usuarioController.formCadastro);

/* POST /usuario/cadastro (Processa o cadastro do novo usuário) */
router.post('/cadastro', usuarioController.create);

/* POST /usuario/login (Processa a autenticação do usuário) */
router.post('/login', usuarioController.login);

/* POST /usuario/logout (Encerra a sessão) */
router.post('/logout', usuarioController.logout);

module.exports = router;