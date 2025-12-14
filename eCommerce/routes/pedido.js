// routes/pedido.js

// ... (imports e Middleware autenticacaoRequired, conforme já definido) ...

/* GET /pedidos/comprar/:produtoId 
   - Exibe o formulário de finalização da compra
*/
router.get('/comprar/:produtoId', autenticacaoRequired, pedidoController.formFinalizacao);

/* POST /pedidos/comprar 
   - Processa a criação dos registros Pedido e ItemPedido
*/
router.post('/comprar', autenticacaoRequired, pedidoController.finalizarCompra);

/* GET /pedidos/gerenciar 
   - Exibe a lista de pedidos para gerenciamento [cite: 110]
*/
router.get('/gerenciar', autenticacaoRequired, pedidoController.gerenciarPedidos);

/* POST /pedidos/status/:id
   - Altera o status do pedido (Cancelado, Suspenso, Concluído) 
*/
router.post('/status/:id', autenticacaoRequired, pedidoController.alterarStatus);

module.exports = router;