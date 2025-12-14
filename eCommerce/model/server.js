// server.js
const { Sequelize } = require('sequelize');
// const Usuario = require('./Usuario');
// const Pedido = require('./Pedido');
// const ItemPedido = require('./ItemPedido');

// 1. Instância do Sequelize
const sequelize = new Sequelize(
    'ecommerce', // nome da base de dados
    'fullstack', // nome do usuário do banco de dados
    'senha_fullstack', // senha do usuário
    {
        host: 'localhost', // endereço do BD
        dialect: 'mysql', // dialeto do BD
        logging: false 
    }
);

module.exports = { sequelize: sequelize }; 

const Usuario = require('./Usuario'); 
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const Categoria = require('./Categoria'); // 🛠️ NOVO: Importa Categoria

// 3. Adiciona os Models ao objeto de exportação principal
module.exports.Usuario = Usuario;
module.exports.Pedido = Pedido;
module.exports.ItemPedido = ItemPedido;
module.exports.Categoria = Categoria; // 🛠️ NOVO: Exporta Categoria


Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' }); 

// Relacionamento 1:N entre Pedido e ItemPedido
Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });


// // Sincronizar com o servidor.
// sequelize.authenticate().then(() => {

//     console.log('Conexão com banco de dados estabelecida com sucesso.');

// }).catch((error) => {

//     console.log('Erro ao se conectar ao banco de dados: ', error);

// });



