// model/Produto_Mongoose.js

const mongoose = require('./conexao_nao_relacional'); // 1. Importa a instância de conexão Mongoose

const ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
    },
    estoque: {
        type: Number,
        required: true,
        min: 0, 
    },
    detalhes: {
        // Campo 'Mixed' para dados flexíveis (como cor, tamanho, processador, etc.)
        type: mongoose.Schema.Types.Mixed,
        required: false,
    }
}, {

    timestamps: {
        createdAt: 'data_criacao',
        updatedAt: 'data_atualizacao'
    }
});

const Produto = mongoose.model('Produto', ProdutoSchema, 'Produto');

module.exports = Produto;