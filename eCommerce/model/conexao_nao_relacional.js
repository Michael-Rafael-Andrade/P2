// model/conexao_nao_relacional.js
const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/ecommerce_produtos';

// Tenta realizar a conexão
mongoose.connect(DB_URL)
    .then(() => {
        console.log(' Conexão com banco de dados não-relacional (MongoDB) estabelecida com sucesso.');
    })
    .catch((error) => {
        console.log(' Erro ao se conectar ao MongoDB: ', error);
    });

// Exportar o Mongoose
module.exports = mongoose;