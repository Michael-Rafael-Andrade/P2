// server.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(

    'ecommerce', // nome da base de dados

    'fullstack', // nome do usuário do banco de dados

    'senha_fullstack', // senha do usuário
    {
        host: 'localhost', // endereço do BD
        dialect: 'mysql' // dialeto do BD
    }

);

// Sincronizar com o servidor.
sequelize.authenticate().then(() => {

    console.log('Conexão com banco de dados estabelecida com sucesso.');

}).catch((error) => {

    console.log('Erro ao se conectar ao banco de dados: ', error);

});



module.exports = sequelize; // exportar