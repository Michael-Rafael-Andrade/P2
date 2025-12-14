// C:\Dev\Desenvolvimento Back-End-I\P2\eCommerce\model\Categoria.js
const { DataTypes } = require('sequelize');
s
const sequelize = require('./server').sequelize; 

// Definição do Model Categoria
const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'categoria', 
    timestamps: false 
});

module.exports = Categoria;