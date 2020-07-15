const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
// TEM Q POR PARADA DE LOGIN

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});


//condição pra filtar qual tipo de imagem vai aceitar
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}


// TAMAMHO MAXIMO DA IMAGEM
const upload = multer({
   storage: storage,
   limits: {
        fileSize: 1024 * 1024 * 5
   },
   fileFilter: fileFilter
});

// RETORNA TODOS AS POSTAGENS
router.get('/', (req, res, next) => {
 mysql.getConnection((error, conn) => {
     if(error) { return res.status(500).send({error: error})}
     conn.query( `SELECT postagens.id_postagem, postagens.titulo, postagens.descricao,
     postagens.postagem_imagem, usuarios.id_usuario, usuarios.nome, usuarios.email
                 FROM postagens
                 INNER JOIN usuarios ON usuarios.id_usuario = postagens.id_usuario;`,
         (error, result, fields) =>{
          if(error) { return res.status(500).send({error: error})}
         const response = {
             postagens: result.map(postagem => {
                 return {
                 id_postagem: postagem.id_postagem,
                 titulo: postagem.titulo,
                 descricao: postagem.descricao,
                 postagem_imagem: postagem.postagem_imagem,
                 usuario: {
                      id_usuario: postagem.id_usuario,
                      nome: postagem.nome,
                      email: postagem.email
                 },
                 request: {
                     tipo: 'GET',
                     descricao: 'Retorna os detalhes de uma postagem específico',
                     url: 'localhost:3000/postagens/' + postagem.id_postagem
                         }
                     }
                 })
             }
         return res.status(200).send(response);
         }
     )
   });
});


// CRIE UMA NOVA POSTAGEM
router.post('/', upload.single('postagem_imagem'), login, (req, res, next) => {
    console.log(req.file);
    mysql.getConnection
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
        'INSERT INTO postagens (id_usuario, titulo, descricao, postagem_imagem) VALUES (?,?,?,?)',
        [req.body.id_usuario, req.body.titulo, req.body.descricao, req.file.path],
        (error, result, field) =>{
                conn.release(); // libera conexão
                    if(error) { return res.status(500).send({error: error})}
                    const response = {
                        mensagem: 'Postagem criada com sucesso',
                        postagemCriada:{
                        id_postagem: result.id_postagem,
                        id_usuario: req.body.id_usuario,
                        titulo: req.body.titulo,
                        descricao: req.body.descricao,
                        postagem_imagem: req.file.path,
                        request: {
                                 tipo: 'GET',
                                 descricao: 'Retorna todas as postagens',
                                 url: 'localhost:3000/postagens'
                                 }
                        }
                    }
                return res.status(201).send(response);
            }
        )
    });
});


// RETORNA OS DADOS DE UMA POSTAGEM
router.get('/:id_postagem', (req, res, next) => {
      mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM postagens WHERE id_postagem = ?;',
            [req.params.id_postagem],
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}

                if(result.length == 0){
                    return res.status(404).send({
                    mensagem: 'Não foi encontrado nenhuma postagem com esse ID'
                })
            }
            const response = {
                postagem: {
                    id_postagem: result[0].id_postagem,
                    id_usuario: result[0].id_usuario,
                    titulo: result[0].titulo,
                    descricao: result[0].descricao,
                    postagem_imagem: result[0].postagem_imagem,
                    request: {
                         tipo: 'GET',
                         descricao: 'Retorna todas as postagens',
                         url: 'localhost:3000/postagens'
                             }
                         }
                    }
         return res.status(200).send(response);
           }
        )
    });
});

// ALTERA UMA POSTAGEM// ALTERA UM USUARIO
router.patch('/', upload.single('postagem_imagem'), login, (req, res, next) => {
 mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({error: error})}
      conn.query(
      'UPDATE postagens SET id_usuario = ?, titulo = ?, descricao = ?, postagem_imagem = ? WHERE id_postagem = ?',
             [req.body.id_usuario, req.body.titulo, req.body.descricao, req.file.path, req.body.id_postagem],
             (error, result, field) =>{
                     conn.release(); // libera conexão
                         if(error) { return res.status(500).send({error: error})}
                         const response = {
                             mensagem: 'Postagem criada com sucesso',
                             postagemCriada:{
                             id_postagem: result.id_postagem,
                             id_usuario: req.body.id_usuario,
                             titulo: req.body.titulo,
                             descricao: req.body.descricao,
                             postagem_imagem: req.file.path,
                             request: {
                                      tipo: 'GET',
                                      descricao: 'Retorna todas as postagens',
                                      url: 'localhost:3000/postagens'
                                      }
                             }
                         }
                     return res.status(201).send(response);
                 }
       )
    });
});

// DELETA UMA POSTAGEM
router.delete('/', login, (req, res, next) => {
     mysql.getConnection((error, conn) => {
            if(error) { return res.status(500).send({error: error})}
            conn.query(
            'DELETE FROM postagens WHERE id_postagem = ?',
                [req.body.id_postagem],
                (error, result, fields) =>{
                 conn.release();
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                    mensagem: 'Postagem removida com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Crie uma nova postagem',
                        url: 'localhost:3000/postagens',
                        body:{
                        titulo: 'String',
                        descricao: 'String'
                        }
                    }
                 }
                 return res.status(202).send(response);
            }
         )
    });
});


module.exports = router;
