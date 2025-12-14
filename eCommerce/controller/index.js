// controller/index.js

// Importa o Model do Produto
const Produto = require('../model/Produto');

exports.index = async function (req, res) { 
    try {
        // Busca todos os produtos no MongoDB
        const produtos = await Produto.find({});

        // Verifica se a busca retornou resultados
        const tem_produtos = produtos.length > 0;

        // Passa os produtos para a view 'index.hbs'
        res.render('index', {
            title: 'Catálogo de Produtos | E-Commerce Tech',
            titulo_pagina: 'Produtos em Destaque',
            tem_produtos: tem_produtos,
            produtos: produtos // Variável adicionada para a view
        });

    } catch (error) {
        // Tratamento de erro local, já que next(error) não será usado.
        console.error(" Erro ao buscar produtos:", error);

        // Renderiza a página de erro padrão com status 500
        res.status(500).render('error', {
            message: "Erro interno ao carregar produtos.",
            error: {}
        });
    }
};