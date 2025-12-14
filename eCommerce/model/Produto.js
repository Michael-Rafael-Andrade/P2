// \model\Produto.js
const mongoose = require('./conexao_nao_relacional'); 

// Define o Schema (estrutura) do Produto
const ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
        min: 0.01
    },
    estoque: {
        type: Number,
        required: true,
        min: 0, 
    },
    categoria_sql_id: {
        type: Number, 
        required: true 
    },
  
    detalhes: {
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