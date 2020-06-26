const express = require('express');
const router = express.Router();
const mysql = require('C:\\Users\\MATHEUS J\\AndroidStudioProjects\\helpet\\api_helpet\\mysql.js').pool;
//const mysql = require('../mysql.js').pool;

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({error: error})}
    conn.query(
    'SELECT * FROM usuarios;',
        (error, result, fields) =>{
         if(error) { return res.status(500).send({error: error})}
        const response = {
            usuarios: result.map(usu => {
                return {
                id_usuario: usu.id_usuario,
                nome: usu.nome,
                email: usu.email,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um usuarios específico',
                    url: 'localhost:3000/usuarios/' + usu.id_usuario
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
  });
});

// INSERE UM NOVO USUARIO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
        'INSERT INTO usuarios (nome, email) VALUES (?,?)',
        [req.body.nome, req.body.email],
        (error, result, field) =>{
                conn.release(); // libera conexão
                    if(error) { return res.status(500).send({error: error})}
                    const response = {
                        mensagem: 'Usuário inserido com sucesso',
                        usuarioCriado:{
                        id_usuario: result.id_usuario,
                        nome: req.body.nome,
                        email: req.body.email,
                        request: {
                                 tipo: 'GET',
                                 descricao: 'Retorna todos os usuários',
                                 url: 'localhost:3000/usuarios'
                                 }
                        }
                    }
                return res.status(201).send(response);
            }
        )
    });
});



// RETORNA OS DADOS DE UM USUARIO
router.get('/:id_usuario', (req, res, next) => {
      mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?;',
            [req.params.id_usuario],
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}

                if(result.length == 0){
                    return res.status(404).send({
                    mensagem: 'Não foi encontrado usuário com esse ID'
                })
            }
            const response = {
                usuario: {
                    id_usuario: result[0].id_usuario,
                    nome: result[0].nome,
                    email: result[0].email,
                    request: {
                         tipo: 'GET',
                         descricao: 'Retorna todos os usuários',
                         url: 'localhost:3000/usuarios'
                             }
                         }
                    }
         return res.status(200).send(response);
           }
        )
    });
});


// ALTERA UM USUARIO
router.patch('/', (req, res, next) => {
   mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
        'UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?',
            [req.body.nome, req.body.email, req.body.id_usuario],
            (error, result, fields) =>{
             if(error) { return res.status(500).send({error: error})}
                    const response = {
                    mensagem: 'Usuário atualizado com sucesso',
                    usuarioAtualizado:{
                    id_usuario: req.body.id_usuario,
                    nome: req.body.nome,
                    email: req.body.email,
                 request: {
                         tipo: 'GET',
                         descricao: 'Retorna os detalhes de um usuarios específico',
                         url: 'localhost:3000/usuarios/' + req.body.id_usuario
                          }
                    }
                }
                    return res.status(202).send(response);
                }
         )
      });
});

// DELETA UM USUARIO
router.delete('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {
            if(error) { return res.status(500).send({error: error})}
            conn.query(
            'DELETE FROM usuarios WHERE id_usuario = ?',
                [req.body.id_usuario],
                (error, result, fields) =>{
                 conn.release();
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                    mensagem: 'Usuário removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'localhost:3000/usuarios',
                        body:{
                        nome: 'String',
                        email: 'String'
                        }
                    }
                 }
                 return res.status(202).send(response);
            }
         )
    });
});


module.exports = router;
