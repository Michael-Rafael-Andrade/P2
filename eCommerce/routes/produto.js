// routes/produto.js
var express = require('express');
var router = express.Router();
var produtoController = require('../controller/produto');

const autenticacaoRequired = (req, res, next) => {
   
    if (req.session && req.session.usuarioId) {
       
        next();
    } else {

        res.redirect('/usuario/login?redirect=' + req.originalUrl);
    }
};

/* GET / (Rota para listar todos os produtos - Dashboard) */
router.get('/', produtoController.listAll); 

// === Rotas Protegidas (Aplicando o middleware 'autenticacaoRequired') ===

/* POST /criar (Rota para processar a criação) */
router.post('/criar', autenticacaoRequired, produtoController.create); 

/* GET /criar (Rota para exibir o formulário de criação) */
router.get('/criar', autenticacaoRequired, produtoController.formCreate);

/* GET /:id/editar (Rota para exibir o formulário de edição) */
router.get('/:id/editar', autenticacaoRequired, produtoController.formEdit); 

/* POST /:id/editar (Rota para processar a edição) */
router.post('/:id/editar', autenticacaoRequired, produtoController.update); 

/* POST /:id/delete (Rota para processar a deleção) */
router.post('/:id/delete', autenticacaoRequired, produtoController.deleteProduct); 

// === Rotas Públicas (Não requerem login) ===

/* GET /:id (Rota para exibir os detalhes) */
router.get('/:id', produtoController.detalhe);

module.exports = router;