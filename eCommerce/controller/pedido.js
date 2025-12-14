// controller/pedido.js
const { Sequelize } = require('sequelize'); // Necessário para COUNT e col
const Produto = require('../model/Produto'); 
const Pedido = require('../model/Pedido');   
const ItemPedido = require('../model/ItemPedido'); 
const Usuario = require('../model/Usuario'); 


// GET /pedidos/comprar/:produtoId - Exibe o formulário de finalização da compra
exports.formFinalizacao = async function(req, res) {
    // ... (Código da função exports.formFinalizacao, conforme já implementado) ...
};


// POST /pedidos/comprar - Processa a finalização da compra
exports.finalizarCompra = async function(req, res) {
    // ... (Código da função exports.finalizarCompra, conforme já implementado) ...
};


// 📋 GET /pedidos/gerenciar - Exibe a lista e gerenciamento de pedidos
exports.gerenciarPedidos = async function(req, res) {
    try {
        // 1. Consulta complexa usando Eager Loading (include) e Agregação (COUNT)
        const pedidos = await Pedido.findAll({
            // Seleciona colunas do Pedido e cria uma coluna agregada para a contagem
            attributes: [
                'id', 
                'createdAt', 
                'updatedAt', 
                'valor_total', 
                'status',
                // Coluna calculada: Conta os IDs dos ItemPedido associados
                [Sequelize.fn('COUNT', Sequelize.col('itens.id')), 'produtosDistintosCount']
            ],
            include: [
                // Inclui o Usuário para obter o nome [cite: 114]
                { 
                    model: Usuario, 
                    as: 'usuario', 
                    attributes: ['nome'] 
                },
                // Inclui ItemPedido para fazer a contagem [cite: 117]
                {
                    model: ItemPedido,
                    as: 'itens',
                    attributes: [], // Não precisamos dos dados do item, apenas para a contagem
                    required: false // Garante que pedidos sem itens (embora improvável) sejam incluídos (LEFT JOIN)
                }
            ],
            where: {
                // Filtra apenas os status de pedidos que devem ser gerenciados [cite: 111]
                status: ['CONCLUIDO', 'CANCELADO', 'SUSPENSO']
            },
            group: [
                'Pedido.id', // Agrupa por Pedido.id e usuario.id para o COUNT funcionar corretamente
                'usuario.id'
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            // Usar raw: true e nest: true simplifica o acesso aos dados da agregação
            raw: true, 
            nest: true 
        });

        // 2. Processamento e Formatação dos Dados para a View
        const pedidosFormatados = pedidos.map(pedido => {
            return {
                id: pedido.id,
                // Formata as datas para o padrão do Brasil 
                dataPedido: new Date(pedido.createdAt).toLocaleDateString('pt-BR'),
                ultimaAtualizacao: new Date(pedido.updatedAt).toLocaleDateString('pt-BR'),
                // O nome vem do include aninhado (pedido.usuario.nome)
                usuarioNome: pedido.usuario.nome, 
                // Formata o valor total como moeda
                valorTotal: `R$ ${parseFloat(pedido.valor_total).toFixed(2).replace('.', ',')}`,
                produtosDistintos: pedido.produtosDistintosCount,
                status: pedido.status
            };
        });

        res.render('gerenciamento_pedidos', {
            title: 'Gerenciamento de Pedidos',
            pedidos: pedidosFormatados
        });

    } catch (error) {
        console.error("❌ Erro ao listar pedidos:", error);
        res.status(500).render('error', { 
            message: "Erro interno ao carregar a lista de pedidos.", 
            error: {} 
        });
    }
};

// POST /pedidos/status/:id (Função para alterar o status do pedido - Próxima Etapa)
exports.alterarStatus = async function(req, res) {
    // ... Implementação da alteração de status virá aqui ...
    res.send(`Alterando status do pedido ${req.params.id} para ${req.body.status}...`);
};

module.exports = exports;