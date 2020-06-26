const express = require('express');
const router = express.Router();

// RETORNA TODOS AS POSTAGENS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'RETORNA TODAS AS POSTAGENS'
    });
});

// INSERE UMA NOVA POSTAGEM
router.post('/', (req, res, next) => {

    const post = {
    id_usuario: req.body.id_usuario,
    titulo: req.body.titulo
    };

    res.status(201).send({
        mensagem: 'CRIANDO POSTAGEM',
        postCriado: post
    });
});

// RETORNA OS DADOS DE UM POSTAGEM
router.get('/:id_postagem', (req, res, next) => {
    const id = req.params.id_postagem
        res.status(200).send({
            mensagem: 'INFORMAÇÕES DO POST'
//            id_postagem: id
        });
});

// ALTERA UMA POSTAGEM
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'EDITA POST'
    });
});

// DELTA UMA POSTAGEM
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'DELETA POST'
    });
});


module.exports = router;
