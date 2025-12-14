// controller/usuario.js

const Usuario = require('../model/Usuario'); 
const bcrypt = require('bcrypt'); 


// GET /usuario/cadastro (Exibe o formulário de cadastro)
exports.formCadastro = async function(req, res) {
    try {
        res.render('form_cadastro', {
            title: 'Cadastro de Usuário',
        });

    } catch (error) {
        console.error(" Erro ao preparar formulário de cadastro:", error);
        res.status(500).render('error', { 
            message: "Erro interno.",
            error: {} 
        });
    }
};


//  POST /usuario/cadastro (Processa o cadastro do novo usuário)
exports.create = async function(req, res) {
    try {
        const { nome, email, senha } = req.body;

        // 1. Geração do Hash da Senha
        const senhaHashed = await bcrypt.hash(senha, 10);

        // 2. Criação do Usuário no banco de dados (Sequelize)
        await Usuario.create({
            nome,
            email,
            senha: senhaHashed // Salva o hash
        });

        res.redirect('/usuario/login'); 

    } catch (error) {
        console.error(" Erro ao criar novo usuário:", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('form_cadastro', {
                title: 'Cadastro de Usuário',
                errorMessage: 'Este e-mail já está cadastrado. Tente fazer login.'
            });
        }
        
        res.status(500).render('error', { 
            message: "Erro ao tentar salvar o usuário.",
            error: {} 
        });
    }
};


// GET /usuario/login (Exibe o formulário de login)
exports.formLogin = async function(req, res) {
    try {
        res.render('form_login', {
            title: 'Login de Usuário',
        });
    } catch (error) {
        console.error("❌ Erro ao preparar formulário de login:", error);
        res.status(500).render('error', { message: "Erro interno.", error: {} });
    }
};


//  POST /usuario/login (Processa a autenticação do usuário)
exports.login = async function(req, res) {
    try {
        const { email, senha } = req.body;

        // 1. Busca o Usuário pelo email (Sequelize: findOne)
        const usuario = await Usuario.findOne({ 
            where: { email: email } 
        });

        // Caso 1: Usuário não encontrado
        if (!usuario) {
            return res.render('form_login', { errorMessage: 'E-mail ou senha inválidos.' });
        }
        
        // 2. Compara a Senha
        // bcrypt.compare compara a senha pura com o hash do banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        // Caso 2: Senha incorreta
        if (!senhaCorreta) {
            return res.render('form_login', { errorMessage: 'E-mail ou senha inválidos.' });
        }

        // Caso 3: Sucesso - Inicia a Sessão
        req.session.usuarioId = usuario.id;
        req.session.usuarioNome = usuario.nome;
        
        // Redireciona para a página principal ou dashboard
        return res.redirect('/'); 

    } catch (error) {
        console.error(" Erro no login:", error);
        res.status(500).render('error', { message: "Erro interno ao tentar fazer login.", error: {} });
    }
};


//  POST /usuario/logout (Encerra a sessão)
exports.logout = async function(req, res) {
    // Destroi a sessão do usuário
    req.session.destroy(err => {
        if (err) {
            console.error(" Erro ao fazer logout:", err);
            // Poderia redirecionar para uma página de erro aqui
        }
        // Redireciona para a página de login após o logout
        res.redirect('/usuario/login');
    });
};