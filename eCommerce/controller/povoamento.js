// controller/povoamento.js

// 1. Importa o Model do Produto
const Produto = require('../model/Produto'); 

// Dados de teste para inserção (seguindo o padrão do material)
const dados_teste = [
    { nome: 'Laptop Gamer X400', preco: 4999.90, estoque: 15, detalhes: { cor: 'Preto', processador: 'i7' } },
    { nome: 'Mouse Óptico Pro', preco: 99.50, estoque: 50, detalhes: { cor: 'Branco' } },
    { nome: 'Teclado Mecânico RGB', preco: 350.00, estoque: 20, detalhes: { cor: 'Cinza' } },
    { nome: 'Monitor UltraWide 4K', preco: 2500.00, estoque: 0, detalhes: { cor: 'Preto' } },
    { nome: 'Webcam HD 1080p', preco: 150.00, estoque: 35, detalhes: { cor: 'Preto' } }
];

exports.index = async function(req, res) {
    try {
        // Limpar a coleção existente
        const deleteResult = await Produto.deleteMany({});
        console.log(` Documentos removidos: ${deleteResult.deletedCount}`);

        // Inserir os novos dados de teste
        const insertResult = await Produto.insertMany(dados_teste);
        console.log(` Documentos inseridos: ${insertResult.length}`);

        // Renderiza a view de sucesso
        res.render('povoamento_sucesso', { 
            title: 'Povoamento Concluído',
            mensagem: `${insertResult.length} produtos foram inseridos com sucesso!`,
            deletados: deleteResult.deletedCount,
            inseridos: insertResult.length
        });

    } catch (error) {
        console.error(" Erro durante o povoamento inicial:", error);
        
        // Renderiza a página de erro
        res.status(500).render('error', {
            message: "Erro ao executar o povoamento.",
            error: {}
        });
    }
};