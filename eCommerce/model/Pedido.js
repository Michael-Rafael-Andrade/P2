// C:\Dev\Desenvolvimento Back-End-I\P2\eCommerce\model\Pedido.js
const { DataTypes } = require('sequelize');
// 🛠️ CORREÇÃO: Acessa a propriedade .sequelize do objeto exportado.
const sequelize = require('./server').sequelize; 
const Usuario = require('./Usuario'); 
// O import de ItemPedido é removido para quebrar o ciclo, pois a associação será feita em server.js

// Definição do Model Pedido (sem alterações na estrutura principal)
const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, 
            key: 'id' 	
        }
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('CARRINHO', 'PENDENTE', 'CONCLUIDO', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'CARRINHO' 
    }
}, {
    tableName: 'pedido', 
    timestamps: true, 
});

// ⚠️ REMOVIDO: Bloco de Associações (foi centralizado em server.js)

module.exports = Pedido;