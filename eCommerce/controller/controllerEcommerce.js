// controller\controllerEcommerce.js

const Produto = require('../model/Produto');

// 🛠️ CORREÇÃO 2: Importa o objeto server para acessar os Models Sequelize sem desestruturação.
const server = require('../model/server');
const Usuario = server.Usuario;
const Pedido = server.Pedido;
const ItemPedido = server.Usuario; // O ItemPedido estava importado duas vezes no código original
const Categoria = server.Categoria; // Certifique-se de importar a Categoria também.

// Importa o operador Op do Sequelize (se necessário no controller)
const { Op } = require('sequelize');


// Variável global simples para simular um usuário logado (o primeiro cadastrado)
let usuario_padrao_id = 1;


exports.povoamento = async function (req, res) {
    try {
        // --- 1. Povoamento Relacional (Categoria e Usuario) ---

        const categoriaTecnologia = await Categoria.create({
            nome: 'Tecnologia'
        });
        const id_categoria_tecnologia = categoriaTecnologia.id; // Captura o ID Relacional

        // Usuários
        const usuario1 = await Usuario.create({
            nome: 'Alice Silva (Compradora)',
            email: 'alice@ecommerce.com.br',
            senha: '123'
        });
        await Usuario.create({
            nome: 'Bob Souza',
            email: 'bob@ecommerce.com.br',
            senha: '123'
        });
        await Usuario.create({
            nome: 'Carol Lima',
            email: 'carol@ecommerce.com.br',
            senha: '123'
        });

        usuario_padrao_id = usuario1.id; // Define o usuário padrão para as compras

        // --- 2. Povoamento Não-Relacional (Produto) ---

        // Produtos de tecnologia (10 produtos)
        const produtos_data = [
            { nome: 'Notebook Gamer Pro', preco: 4899.90, estoque: 15, detalhes: { processador: 'Intel i7', ram: '16GB DDR4', ssd: '512GB NVMe', gpu: 'RTX 4060' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Smartphone Ultra X', preco: 7250.00, estoque: 8, detalhes: { tela: 'AMOLED 6.7', bateria: '5000mAh', camera: '50MP', cor: 'Preto' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Tablet Educacional 10', preco: 850.50, estoque: 50, detalhes: { tela: '10.1 LCD', armazenamento: '64GB', android: '13', peso: '500g' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Mouse Sem Fio Ergonômico', preco: 99.90, estoque: 120, detalhes: { dpi: '2400', botoes: '6', cor: 'Grafite', conectividade: '2.4GHz' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Teclado Mecânico RGB', preco: 350.00, estoque: 30, detalhes: { tipo_switch: 'Red', layout: 'ABNT2', iluminacao: 'RGB', material: 'Alumínio' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Monitor 4K Curvo 32', preco: 2100.00, estoque: 10, detalhes: { resolucao: '3840x2160', taxa_refresco: '144Hz', tipo_painel: 'VA', conexoes: 'HDMI, DP' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Fone de Ouvido Bluetooth Cancelamento Ruído', preco: 450.00, estoque: 85, detalhes: { bateria: '30h', cancelamento: 'Ativo', cor: 'Prata', impedancia: '32ohm' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Webcam Full HD', preco: 180.00, estoque: 60, detalhes: { resolucao: '1080p', fps: '30', microfone: 'Embutido', foco: 'Automático' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Notebook Básico', preco: 1500.00, estoque: 25, detalhes: { processador: 'Intel Celeron', ram: '4GB', ssd: '128GB', sistema: 'Windows 11 Home' }, categoria_sql_id: id_categoria_tecnologia },
            { nome: 'Celular Compacto Mini', preco: 3199.00, estoque: 12, detalhes: { tela: 'OLED 5.4', bateria: '3200mAh', camera: '12MP', '5g': 'Sim' }, categoria_sql_id: id_categoria_tecnologia },
        ];

        // Remove todos os produtos existentes e insere os novos (para idempotência)
        await Produto.deleteMany({});
        await Produto.insertMany(produtos_data);

        console.log(' Povoamento de dados concluído com sucesso.');

        // Redirecionar para a tela principal
        res.redirect('/');

    } catch (error) {
        console.error('Erro no povoamento:', error);
        // Garante que o usuário veja o erro de validação (se houver)
        res.render('error', { message: 'Erro ao criar dados iniciais', error: error });
    }
}


exports.principal_get = async function (req, res) {
    try {
        // Consulta no MongoDB (Não-Relacional)
        const produtos = await Produto.find(
            {}, // Filtro vazio (todos os produtos)
            // Seleciona apenas os atributos necessários para o card
            ['nome', 'preco', 'estoque'],
            {
                limit: 8 // Limita a 8 produtos
            }
        ).exec(); // Executa a consulta

        const contexto = {
            titulo_pagina: "E-Commerce - Produtos",
            produtos: produtos.map(p => ({
                id: p._id.toString(), // Converte o ObjectId para string
                nome: p.nome,
                preco: p.preco.toFixed(2).replace('.', ','),
                estoque: p.estoque
            })),
            tem_produtos: produtos.length > 0
        };


        res.render('index', contexto);

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.render('error', { message: 'Erro ao carregar a tela principal', error: error });
    }
}


exports.detalhes_get = async function (req, res) {
    try {
        const idProduto = req.params.id;

        // Busca todos os atributos do produto, incluindo 'detalhes'
        const produto = await Produto.findById(idProduto).exec();

        if (!produto) {
            return res.status(404).render('error', { message: 'Produto não encontrado.' });
        }

        const contexto = {
            titulo_pagina: `Detalhes: ${produto.nome}`,
            // Converte o objeto do Mongoose em um objeto JS simples, e o ID para string
            produto: {
                id: produto._id.toString(),
                nome: produto.nome,
                preco: produto.preco.toFixed(2).replace('.', ','),
                estoque: produto.estoque,
                // O Handlebars conseguirá iterar sobre 'detalhes' se for um objeto simples
                detalhes: produto.detalhes || {}
            }
        };

        res.render('detalhesProduto', contexto);

    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        res.render('error', { message: 'Erro ao carregar detalhes do produto', error: error });
    }
}



exports.comprar_get = async function (req, res) {
    try {
        const idProduto = req.params.id;

        // Busca o produto no MongoDB, mas consulta a apenas os atributos principais
        const produto = await Produto.findById(
            idProduto,
            ['nome', 'preco', 'estoque'] // Apenas o necessário para a tela
        ).exec();

        if (!produto) {
            return res.status(404).render('error', { message: 'Produto não encontrado para compra.' });
        }

        const contexto = {
            titulo_pagina: 'Finalizar Compra',
            produto: {
                id: produto._id.toString(),
                nome: produto.nome,
                preco: produto.preco.toFixed(2).replace('.', ','),
                estoque: produto.estoque,
            },
      
            max_estoque: produto.estoque
        };

        res.render('comprarProduto', contexto);

    } catch (error) {
        console.error('Erro ao carregar tela de compra:', error);
        res.render('error', { message: 'Erro ao carregar tela de compra', error: error });
    }
}


exports.comprar_post = async function (req, res) {
    const { id_produto, quantidade_compra, preco_unitario_produto } = req.body;
    const quantidade = Number(quantidade_compra);
    const preco_unitario = Number(preco_unitario_produto);

    // Simula validações básicas
    if (quantidade <= 0 || !id_produto || !preco_unitario) {
        return res.redirect('/'); // Ou uma tela de erro mais específica
    }


    try {
        // 1. Verifica e Atualiza o Estoque no MongoDB
        const produto = await Produto.findById(id_produto);

        if (!produto || produto.estoque < quantidade) {
            return res.status(400).render('confirmacaoCompra', {
                titulo_pagina: 'Falha na Compra',
                mensagem: `Estoque insuficiente para ${produto ? produto.nome : 'o produto'}. Disponível: ${produto ? produto.estoque : 0}.`,
                erro: true
            });
        }

        // Diminui o estoque (operação atômica no Mongoose)
        await Produto.updateOne(
            { _id: id_produto },
            { $inc: { estoque: -quantidade } }
        );

        // O valor_total é calculado no back-end
        const valor_total_pedido = quantidade * preco_unitario;

        const novoPedido = await Pedido.create({
            status: 'CONCLUIDO', // Requisito: status "CONCLUIDO"
            valor_total: valor_total_pedido,
            usuario_id: usuario_padrao_id // Usando o ID do usuário padrão
        });

        // 3. Cria o ItemPedido (Sequelize)
        await ItemPedido.create({
            quantidade: quantidade,
            preco_unitario: preco_unitario,
            produto_mongodb_id: id_produto, // Chave do MongoDB no ItemPedido
            pedido_id: novoPedido.id // Relacionamento 1:N com Pedido
        });

        // Redireciona para a tela de confirmação, passando o ID do pedido
        res.redirect(`/confirmacao/${novoPedido.id}`);

    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        res.render('error', { message: 'Erro ao processar a compra', error: error });
    }
}

exports.confirmacao_get = async function (req, res) {
    try {
        const idPedido = req.params.id;

        // Busca o pedido, incluindo o nome do usuário (associação)
        const pedido = await Pedido.findByPk(idPedido, {
            include: [{ model: Usuario, attributes: ['nome'] }]
        });

        if (!pedido) {
            return res.status(404).render('error', { message: 'Pedido não encontrado.' });
        }

        const nomeUsuario = pedido.Usuario ? pedido.Usuario.nome : 'Usuário Desconhecido';

        const contexto = {
            titulo_pagina: 'Compra Concluída',
            mensagem: `Parabéns, ${nomeUsuario}! Seu pedido #${pedido.id} foi concluído com sucesso.`,
            nome_usuario: nomeUsuario
        };

        res.render('confirmacaoCompra', contexto);

    } catch (error) {
        console.error('Erro ao carregar confirmação:', error);
        res.render('error', { message: 'Erro ao carregar confirmação de compra', error: error });
    }
}



exports.dashboard_get = async function (req, res) {
    try {
        // Quantidade total de produtos cadastrados
        const totalProdutos = await Produto.countDocuments();

        // Quantidade de produtos com baixo estoque ( < 10 )
        const baixoEstoque = await Produto.countDocuments({ estoque: { $lt: 10 } });

        // Nomes de produtos relacionados a "computador", "pc" ou "notebook"
        const computadores = await Produto.countDocuments({
            nome: { $regex: /computador|pc|notebook/i } // Case-insensitive regex
        });

        // Nomes de produtos relacionados a "celular", "iphone", "tablet", "smarthphone"
        const moveis = await Produto.countDocuments({
            nome: { $regex: /celular|iphone|tablet|smartphone/i }
        });

        // Faixas de preço
        const precoFaixa1 = await Produto.countDocuments({ preco: { $gte: 0, $lte: 100 } });
        const precoFaixa2 = await Produto.countDocuments({ preco: { $gt: 100, $lte: 1000 } });
        const precoFaixa3 = await Produto.countDocuments({ preco: { $gt: 1000, $lte: 5000 } });
        const precoFaixa4 = await Produto.countDocuments({ preco: { $gt: 5000 } });

        const contexto = {
            titulo_pagina: 'Dashboard de Produtos',
            stats: {
                totalProdutos: totalProdutos,
                baixoEstoque: baixoEstoque,
                computadores: computadores,
                dispositivosMoveis: moveis,
                faixa0a100: precoFaixa1,
                faixa101a1000: precoFaixa2,
                faixa1001a5000: precoFaixa3,
                faixaAcima5000: precoFaixa4,
            }
        };

        res.render('dashboardProdutos', contexto);

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.render('error', { message: 'Erro ao carregar o dashboard', error: error });
    }
}

exports.pedidos_get = async function (req, res) {
    try {
        // Lista pedidos com status específicos e inclui o nome do usuário
        const pedidos = await Pedido.findAll({
            where: {
                // Filtra por status: CONCLUIDO, CANCELADO ou SUSPENSO
                status: {
                    [Op.in]: ['CONCLUIDO', 'CANCELADO', 'SUSPENSO', 'PENDENTE']
                }
            },
            include: [
                { model: Usuario, attributes: ['nome'] }, // Inclui o nome do usuário
                { model: ItemPedido, attributes: ['id'] } // Para contar produtos distintos
            ],
            order: [['data_criacao', 'DESC']] // Ordena pelo mais recente
        });

        const pedidos_formatados = pedidos.map(p => {
            return {
                id: p.id,
                dia_compra: p.dataValues.data_criacao.toLocaleDateString('pt-BR'),
                nome_usuario: p.Usuario ? p.Usuario.nome : 'N/A',
                dia_atualizacao: p.dataValues.data_atualizacao.toLocaleDateString('pt-BR'),
                valor_total: p.valor_total.toFixed(2).replace('.', ','),
                numero_produtos: p.ItemPedidos.length, // Conta o número de ItemPedido (produtos distintos)
                status: p.status
            };
        });

        const contexto = {
            titulo_pagina: 'Gerenciamento de Pedidos',
            pedidos: pedidos_formatados,
            tem_pedidos: pedidos_formatados.length > 0
        };

        res.render('gerenciamentoPedidos', contexto);

    } catch (error) {
        console.error('Erro ao carregar gerenciamento de pedidos:', error);
        res.render('error', { message: 'Erro ao carregar gerenciamento de pedidos', error: error });
    }
}

exports.pedidos_altera_status = async function (req, res) {
    const idPedido = req.params.id;
    const novoStatus = req.params.novoStatus.toUpperCase();

    // Validação de segurança simples para status permitidos
    const statusPermitidos = ['CONCLUIDO', 'CANCELADO', 'SUSPENSO'];
    if (!statusPermitidos.includes(novoStatus)) {
        return res.status(400).send('Status inválido.');
    }

    try {
        // Atualiza o status do pedido
        await Pedido.update(
            { status: novoStatus },
            { where: { id: idPedido } }
        );

        // Volta para a tela de gerenciamento de pedidos
        res.redirect('/pedidos');

    } catch (error) {
        console.error('Erro ao alterar status do pedido:', error);
        res.render('error', { message: 'Erro ao alterar status do pedido', error: error });
    }
}
