const express = require('express');
const router = express.Router();
const mysql = require('C:\\Users\\MATHEUS J\\AndroidStudioProjects\\helpet\\api_helpet\\mysql.js').pool;
//const mysql = require('../mysql.js').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

    //ERRO NA PARTE DE ALTERAR


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
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: error})}
        conn.query('SELECT * FROM usuarios WHERE email =?', [req.body.email], (error, results) => {
            if(error) { return res.status(500).send({error: error})}
            if(results.length > 0){
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else{
            bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if(errBcrypt) { return res.status(500).send ({ error: errBcrypt})}
        conn.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?)',
        [req.body.nome, req.body.email, hash],
        (error, results) =>{
                conn.release(); // libera conexão
                    if(error) { return res.status(500).send({error: error})}
                    const response = {
                        mensagem: 'Usuário criado com sucesso',
                        usuarioCriado: {
                        id_usuario: results.insertId,
                        nome: req.body.nome,
                        email: req.body.email,
                        }
                    }
                return res.status(201).send(response);
                  })
                });
            }
        })
    });
})



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

//Verifica Login
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        const query = 'SELECT * FROM usuarios WHERE email =?';
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release(); // libera conexão
            if(error) { return res.status(500).send({error: error})}
            if(results.length < 1){
               return res.status(401).send({ mensagem: 'Email e/ou Senha inválido(s)'})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) =>{
                if(err){
                   return res.status(401).send({ mensagem: 'Email e/ou Senha inválido(s)'})
                }
                if(result){
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        nome: results[0].nome,
                        email: results[0].email
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                    return res.status(200).send({
                    mensagem: 'Login efetuado com sucesso',
                    token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Email e/ou Senha inválido(s)'})
            });
        });
    });
})



module.exports = router;
