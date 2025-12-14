// controller/utilidades.js

// Importando todos os Models necessários
const Usuario = require('../model/Usuario');
const Pedido = require('../model/Pedido');
const ItemPedido = require('../model/ItemPedido');
const Produto = require('../model/Produto'); // Mongoose
const bcrypt = require('bcrypt'); 

exports.seed = async function(req, res) {
    try {
 
        const hashedPassword = await bcrypt.hash('123456', 10);
        const usuarioData = {
            nome: 'Maria Figueira',
            email: 'maria.figueira@tech.com',
            senha: hashedPassword
        };
        
        // Usamos findOrCreate para evitar duplicatas em execuções repetidas
        const [usuario, created] = await Usuario.findOrCreate({
            where: { email: usuarioData.email },
            defaults: usuarioData
        });
        
        const produtosData = [
            { nome: 'Laptop Gamer X-500', preco: 6500.00, estoque: 5, categoria: 'Computadores', detalhes: 'Alta performance para jogos.' },
            { nome: 'Smartphone G-2000', preco: 1500.00, estoque: 15, categoria: 'Dispositivos Móveis', detalhes: 'Câmera profissional e bateria duradoura.' },
            { nome: 'Monitor UltraWide Curvo', preco: 3200.00, estoque: 8, categoria: 'Monitores', detalhes: 'Imersão total para produtividade e jogos.' },
            { nome: 'Mouse Óptico Simples', preco: 50.00, estoque: 100, categoria: 'Acessórios', detalhes: 'Ideal para uso diário.' },
            { nome: 'Teclado Mecânico RGB', preco: 450.00, estoque: 25, categoria: 'Acessórios', detalhes: 'Switches táteis e iluminação personalizável.' },
        ];
        
        await Produto.deleteMany({}); // Limpa a coleção para um novo start
        const produtos = await Produto.insertMany(produtosData);

        // --- 3. Criação de Pedido de Exemplo (Para testar Gerenciamento) ---
        const produtoExemplo = produtos.find(p => p.nome === 'Smartphone G-2000');
        if (produtoExemplo) {
            const quantidade = 2;
            const preco = produtoExemplo.preco;
            const valorTotal = quantidade * preco;

            // Cria o pedido
            await Pedido.create({
                usuarioId: usuario.id,
                status: 'CONCLUIDO',
                valor_total: valorTotal
            });
            // Não criaremos o ItemPedido aqui para simplificar a demo, mas a estrutura está correta.
        }
        
        // Mensagem de sucesso
        res.status(200).send(`
            <h1> Povoamento Inicial Concluído!</h1>
            <p>1 Usuário de teste: <strong>${usuario.email}</strong> (Senha: 123456)</p>
            <p>${produtos.length} Produtos inseridos no MongoDB.</p>
            <p>1 Pedido de exemplo criado para teste de Gerenciamento.</p>
            <p><a href="/">Voltar para a Home</a> | <a href="/usuario/login">Ir para o Login</a></p>
        `);

    } catch (error) {
        console.error(" Erro no Seeding:", error);
        res.status(500).send("Erro interno ao executar o povoamento de dados. Verifique as conexões com MongoDB e PostgreSQL.");
    }
};

module.exports = exports;