// controller/categoria.js
const Categoria = require('../model/Categoria'); 

// ... (exports.listAll, exports.formCreate, exports.create) ...

// GET /categorias/:id/editar (Exibe o formulário pré-preenchido)
exports.formEdit = async function(req, res) {
    try {
        const id = req.params.id;
        // 1. Usa findByPk() para buscar o registro pelo ID
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).render('error', { message: "Categoria não encontrada." });
        }
        
        // Renderiza a view, passando o objeto 'categoria'
        res.render('form_categoria', {
            title: 'Editar Categoria',
            titulo_pagina: `Editar Categoria: ${categoria.nome}`,
            categoria: categoria.toJSON(), // Converte para objeto JSON puro
            editMode: true // Flag para a View
        });

    } catch (error) {
        console.error(" Erro ao exibir form de edição:", error);
        res.status(500).render('error', { message: "Erro interno ao buscar a categoria para edição." });
    }
};

// PUT/POST /categorias/:id (Processa a atualização)
exports.update = async function(req, res) {
    try {
        const id = req.params.id;
        const { nome, descricao } = req.body;

        // 2. Usa o método update(novos_dados, { where: {condição} })
        const [linhasAfetadas] = await Categoria.update(
            { nome: nome, descricao: descricao },
            { where: { id: id } } // CRUCIAL: Atualiza apenas o registro com este ID
        ); 

        // Redireciona de volta para a lista
        res.redirect('/categorias'); 

    } catch (error) {
        console.error(" Erro ao atualizar categoria:", error);
        res.status(500).render('error', { 
            message: "Erro interno ao atualizar a categoria.",
            error: {} 
        });
    }
};



// DELETE /categorias/:id (Processa a exclusão)
exports.delete = async function(req, res) {
    try {
        const id = req.params.id;

        // 1. Usa o método destroy() com a cláusula where
        const linhasExcluidas = await Categoria.destroy({ 
            where: { id: id } // CRUCIAL: Remove apenas o registro com este ID
        }); 

        // 2. Redireciona de volta para a lista
        res.redirect('/categorias'); 

    } catch (error) {
        console.error(" Erro ao excluir categoria:", error);
        res.status(500).render('error', { 
            message: "Erro interno ao excluir a categoria.",
            error: {} 
        });
    }
};



