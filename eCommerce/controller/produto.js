// controller/produto.js

// Importar Model Mongoose e Model Sequelize
const Produto = require('../model/Produto');
const Categoria = require('../model/Categoria');

// GET / (ou /produtos) - Lista todos os produtos (Dashboard)
exports.listAll = async function (req, res) {
    try {
        const produtos = await Produto.find().lean();
        const categorias = await Categoria.findAll();

        const categoriaMap = {};
        categorias.forEach(cat => {
            categoriaMap[cat.id] = cat.nome;
        });

        const produtosComCategoria = produtos.map(produto => ({
            ...produto,
            categoriaNome: categoriaMap[produto.categoria_sql_id] || 'N/A'
        }));

        res.render('dashboard_produtos', {
            title: 'Dashboard de Produtos',
            titulo_pagina: 'Dashboard de Produtos',
            produtos: produtosComCategoria,
            quantidadeProdutos: produtos.length
        });

    } catch (error) {
        console.error(" Erro ao listar produtos:", error);
        res.status(500).render('error', {
            message: "Erro interno ao buscar produtos.",
            error: {}
        });
    }
};


// GET /produtos/criar (Exibe o formulário de criação)
exports.formCreate = async function (req, res) {
    try {
        const categorias = await Categoria.findAll({
            order: [['nome', 'ASC']]
        });

        res.render('form_produto', {
            title: 'Criar Novo Produto',
            titulo_pagina: 'Novo Produto',
            categorias: categorias
        });

    } catch (error) {
        console.error(" Erro ao preparar formulário de produto:", error);
        res.status(500).render('error', {
            message: "Erro interno.",
            error: {}
        });
    }
};


// POST /produtos/criar (Processa a criação)
exports.create = async function (req, res) {
    try {
        await Produto.create(req.body);
        res.redirect('/produtos');

    } catch (error) {
        console.error(" Erro ao criar novo produto:", error);
        res.status(500).render('error', {
            message: "Erro ao tentar salvar o produto.",
            error: {}
        });
    }
};


// GET /:id (Exibe os detalhes)
exports.detalhe = async function (req, res) {
    try {
        const produtoId = req.params.id;
        const produto = await Produto.findById(produtoId).lean();

        if (!produto) {
            return res.status(404).render('error', { message: "Produto não encontrado.", error: {} });
        }

        let categoria = null;
        if (produto.categoria_sql_id) {
            categoria = await Categoria.findByPk(produto.categoria_sql_id);
        }

        res.render('detalhe_produto', {
            title: `Detalhes de ${produto.nome}`,
            produto: produto,
            categoriaNome: categoria ? categoria.nome : 'N/A'
        });

    } catch (error) {
        console.error(" Erro ao buscar detalhes do produto:", error);
        res.status(500).render('error', { message: "Erro interno ao carregar detalhes.", error: {} });
    }
};


//  GET /:id/editar (Exibe o formulário de edição)
exports.formEdit = async function (req, res) {
    try {
        const produtoId = req.params.id;
        const produto = await Produto.findById(produtoId).lean();

        if (!produto) {
            return res.status(404).render('error', { message: "Produto não encontrado para edição.", error: {} });
        }

        // Busca todas as Categorias para o dropdown
        const categorias = await Categoria.findAll({
            order: [['nome', 'ASC']]
        });

        res.render('form_produto_edit', {
            title: `Editar ${produto.nome}`,
            titulo_pagina: `Editar Produto`,
            produto: produto,
            categorias: categorias,
            categoriaSelecionadaId: produto.categoria_sql_id
        });

    } catch (error) {
        console.error("❌ Erro ao preparar formulário de edição:", error);
        res.status(500).render('error', { message: "Erro interno ao carregar formulário de edição.", error: {} });
    }
};


//  POST /:id/editar (Processa a edição)
exports.update = async function (req, res) {
    try {
        const produtoId = req.params.id;
        const dadosAtualizados = req.body;

        // Mongoose: findByIdAndUpdate para atualizar o documento
        const resultado = await Produto.findByIdAndUpdate(produtoId, dadosAtualizados, { new: true, runValidators: true });

        if (!resultado) {
            return res.status(404).render('error', { message: "Produto não encontrado para atualização.", error: {} });
        }

        // Redireciona para os detalhes do produto
        res.redirect(`/produtos/${produtoId}`);

    } catch (error) {
        console.error(" Erro ao atualizar produto:", error);
        res.status(500).render('error', { message: "Erro ao tentar salvar as alterações do produto.", error: {} });
    }
};


exports.deleteProduct = async function (req, res) {
    try {
        const produtoId = req.params.id;

        const resultado = await Produto.findByIdAndDelete(produtoId);

        if (!resultado) {
            return res.status(404).render('error', { message: "Produto não encontrado para deleção.", error: {} });
        }

        res.redirect('/produtos');

    } catch (error) {
        console.error(" Erro ao deletar produto:", error);
        res.status(500).render('error', { message: "Erro ao tentar deletar o produto.", error: {} });
    }
};

exports.dashboard = async function (req, res) {
    try {
        // 1. Contagem Simples
        const totalProdutos = await Produto.countDocuments({});
        const produtosBaixoEstoque = await Produto.countDocuments({ estoque: { $lt: 10 } });

        // 2. Agregação por Categoria (Utiliza $group)
        const produtosPorCategoria = await Produto.aggregate([
            { $group: { _id: "$categoria", count: { $sum: 1 } } }
        ]);

        const produtosPorPreco = await Produto.aggregate([
            {
                $group: {
                    _id: null, // Agrupa todos os documentos em um único resultado
                    count0_100: {
                        $sum: { $cond: [{ $and: [{ $gte: ['$preco', 0] }, { $lte: ['$preco', 100] }] }, 1, 0] }
                    },
                    count101_1000: {
                        $sum: { $cond: [{ $and: [{ $gt: ['$preco', 100] }, { $lte: ['$preco', 1000] }] }, 1, 0] }
                    },
                    count1001_5000: {
                        $sum: { $cond: [{ $and: [{ $gt: ['$preco', 1000] }, { $lte: ['$preco', 5000] }] }, 1, 0] }
                    },
                    countMaior5000: {
                        $sum: { $cond: [{ $gt: ['$preco', 5000] }, 1, 0] }
                    }
                }
            }
        ]);

        // A agregação por preço retorna um array com um único objeto.
        const priceStats = produtosPorPreco.length > 0 ? produtosPorPreco[0] : {};

        res.render('dashboard_produtos', {
            title: 'Dashboard de Produtos',
            totalProdutos,
            produtosBaixoEstoque,

            // Dados de Categoria formatados para a view (ex: [{ nome: 'Computadores', count: 5 }])
            categorias: produtosPorCategoria.map(item => ({
                nome: item._id,
                count: item.count
            })),

            // Dados de Preço
            faixasPreco: [
                { nome: 'R$ 0 a R$ 100', count: priceStats.count0_100 || 0 },
                { nome: 'R$ 101 a R$ 1000', count: priceStats.count101_1000 || 0 },
                { nome: 'R$ 1001 a R$ 5000', count: priceStats.count1001_5000 || 0 },
                { nome: 'Maior que R$ 5000', count: priceStats.countMaior5000 || 0 }
            ]
        });

    } catch (error) {
        console.error(" Erro ao gerar dashboard:", error);
        res.status(500).render('error', { message: "Erro interno ao carregar o dashboard." });
    }
};

module.exports = exports;