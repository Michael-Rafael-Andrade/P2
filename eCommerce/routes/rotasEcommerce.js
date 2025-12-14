// routes/rotasEcommerce.js
var express = require('express');
var router = express.Router();
var controllerEcommerce = require('../controller/controllerEcommerce');

// Rota principal (Tela de listagem de produtos)

/* GET Página Principal. */
router.get('/', controllerEcommerce.principal_get);

/* POST Pesquisa (Se for implementado futuramente). */
// router.post('/', controllerEcommerce.principal_post); 

// Povoamento de Banco de Dados
/* GET Povoamento de dados no banco de dados. */
router.get('/povoamento', controllerEcommerce.povoamento);

// Detalhes do Produto
/* GET Detalhes do Produto. */
router.get('/produto/:id', controllerEcommerce.detalhes_get);


// Realização da Compra
/* GET Tela de finalização de compra (GET para exibir tela). */
router.get('/comprar/:id', controllerEcommerce.comprar_get);
/* POST Finaliza a compra (POST para processar a compra). */
router.post('/finaliza-compra', controllerEcommerce.comprar_post);
/* GET Tela de Confirmação. */
router.get('/confirmacao/:id', controllerEcommerce.confirmacao_get);


// Dashboard de Produtos
/* GET Dashboard de Produtos. */
router.get('/dashboard', controllerEcommerce.dashboard_get);

// Gerenciamento de Pedidos
/* GET Gerenciamento de Pedidos. */
router.get('/pedidos', controllerEcommerce.pedidos_get);
/* GET Altera Status do Pedido. */
router.get('/pedidos/altera-status/:id/:novoStatus', controllerEcommerce.pedidos_altera_status);


module.exports = router;