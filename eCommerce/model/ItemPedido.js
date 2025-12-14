// model\ItemPedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('./server').sequelize; 

// Importa o Model Pedido APENAS para a referência do FK, mas não para associação
const Pedido = require('./Pedido'); 

// Definição do Model ItemPedido (Junction Table)
const ItemPedido = sequelize.define('ItemPedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Chave Estrangeira para o Pedido (SQL)
    pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido, 
            key: 'id' 	
        }
    },
    // Chave de Ligação HÍBRIDA: Armazena o ID do Produto do MongoDB (string)
    produto_mongo_id: { 
        type: DataTypes.STRING(24), 
        allowNull: false
    },
    quantidade: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    preco_unitario: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'item_pedido', 
    timestamps: false
});


module.exports = ItemPedido;