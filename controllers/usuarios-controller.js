const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsuarios = (req, res, next) => {
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
		'SELECT * FROM helpet.usuarios;',
			(error, result, fields) => {
			    conn.release();
				if(error){ return res.status(500).send({ error: error }) }
				const response = {
					usuarios: result.map(usu => {
						return {
							id_usuario: usu.id_usuario,
							nome: usu.nome,
							tel: usu.tel,
							email: usu.email,
								request: {
									tipo: 'GET',
									descricao: 'retorna todos os usuarios',
									url: 'http://localhost:3000/usuarios'
                                }
                            }
                        })
                    }
                return res.status(201).send(response);
            }
        )
    });
}

exports.postCriaUsuario = async (req, res, next) => {
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
        	if(error) { return res.status(500).send({ error: error }) }
        	if(results.length > 0) {
        		res.status(409).send({ mensagem: 'Usuário já cadastrado'})
        	}
        })
		bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
        	if(errBcrypt){ return res.status(500).send({ error: error }) }
		conn.query(
		'INSERT INTO usuarios (nome, tel, email, senha) VALUES (?,?,?,?)',
		[req.body.nome, req.body.tel, req.body.email, hash],
            (error, result, field) => {
			    conn.release();
				if(error){ return res.status(500).send({ error: error }) }
				const response = {
					mensagem: 'Usuario inserido com sucesso',
					criandoUsuario: {
							id_usuario: result.id_usuario,
							nome: req.body.nome,
							tel: req.body.tel,
							email: req.body.email,
								request: {
									tipo: 'GET',
									descricao: 'retorna todos os usuarios',
									url: 'http://localhost:3000/usuarios'
                                }
                            }
                    }
                return res.status(201).send(response);
            }
        )
    });
    })
};

exports.getUmUsuario = async (req, res, next)=> {
 	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
			'SELECT * FROM usuarios WHERE id_usuario = ?;',
			[req.params.id_usuario],
			(error, result, fields) => {
				if(error){ return res.status(500).send({ error: error }) }
				if(result.length == 0) {
					return res.status(404).send({
						mensagem: 'Não foi encontrado usuario com esse ID'
                       				 })
                  			  }
					const response = {
					usuario:{
						id_usuario: result[0].id_usuario,
						nome: result[0].nome,
						tel: result[0].tel,
						email: result[0].email,
							request: {
								tipo: 'GET',
								descricao: 'retorna todos os usuarios',
								url: 'http://localhost:3000/usuarios'
                             	}
                            }
                        }
                return res.status(201).send(response);
            }
        )
    });
}


exports.patchAtualizaUsuario = async (req, res, next) => {
mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
			'UPDATE usuarios SET nome = ?, tel = ?, email = ? WHERE id_usuario = ?;',
			[req.body.nome, req.body.tel, req.body.email, req.body.id_usuario],
			(error, result, fields) => {
				if(error){ return res.status(500).send({ error: error }) }
					const response = {
					usuarioAtualizado:{
						id_usuario: req.body.id_usuario,
						nome: req.body.nome,
						tel: req.body.tel,
						email: req.body.email,
							request: {
								tipo: 'GET',
								descricao: 'retorna todos os usuarios',
								url: 'http://localhost:3000/usuarios' + req.body.id_usuario
                             	}
                            }
                        }
                return res.status(201).send(response);
            }
        )
    });
};

exports.deleteUmUsuario = async (req, res, next) => {
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
		'DELETE FROM usuarios WHERE id_usuario = ?',
		[req.body.id_usuario],
			(error, result, fields) => {
			    conn.release();
				if(error){ return res.status(500).send({ error: error }) }
				const response = {
					mensagem: 'Usuário removido com sucesso',
						request: {
							tipo: 'POST',
							descricao: 'insere um usuário',
							url: 'http://localhost:3000/usuarios'

                            }
                    }
                return res.status(201).send(response);
            }
        )
    });
}
exports.postVerificaLogin = async (req, res, next) => {
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		const query = 'SELECT * FROM usuarios WHERE email = ?';
		conn.query(query, [req.body.email], (error, results, fields)=>{
			conn.release();
			if(error){ return res.status(500).send({ error: error })}
			if(results.length < 1) {
				return res.status(401).send({mensagem: 'Falha na autenticação'})
			}
			bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
				if(err) {
					return res.status(401).send({mensagem: 'Falha na autenticação'});
				}
				if(result){
				const token = jwt.sign({
                						id_usuario: results[0].id_usuario,
                						email: results[0].email
                					},
                					process.env.JWT_KEY,{
                						expiresIn: "1h"
                					} )
                					return res.status(200).send({
                						mensagem: 'Autenticado com sucesso',
                						token: token
                					});
                								}
				return res.status(401).send({mensagem: 'Falha na autenticação'});
			});
		});
	});
}

//exports.postImagem = async (req, res, next) => {
//    try {
//        const query = 'INSERT INTO imagensUsuario (usuarioId, path) VALUES (?,?)';
//        const result = await mysql.execute(query, [
//            req.params.usuarioId,
//            req.file.path
//        ]);
//
//        const response = {
//            message: 'Imagem inserida com sucesso',
//            createdImagem: {
//                usuarioId: parseInt(req.params.usuarioId),
//                imagemId: result.insertId,
//                path: req.file.path,
//                request: {
//                    type: 'GET',
//                    description: 'Retorna todos as imagens',
//                    url: process.env.URL_API + 'usuarios/' + req.params.usuarioId + '/imagens'
//                }
//            }
//        }
//        return res.status(201).send(response);
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
//};
//
//exports.getImages = async (req, res, next) => {
//    try {
//        const query  = "SELECT * FROM imagensUsuario WHERE usuarioId = ?;"
//        const result = await mysql.execute(query, [req.params.usuarioId])
//        const response = {
//            imagens: result.map(img => {
//                return {
//                    usuarioId: parseInt(req.params.usuarioId),
//                    imagemId: img.imagemId,
//                    path: process.env.URL_API + img.path
//                }
//            })
//        }
//        return res.status(200).send(response);
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
//};

