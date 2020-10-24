const mysql = require('../mysql').pool;

exports.getPostagens =  (req, res, next) => {
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
		'SELECT * FROM helpet.postagens;',
			(error, result, fields) => {
			    conn.release();
				if(error){ return res.status(500).send({ error: error }) }
				const response = {
					postagens: result.map(posts => {
						return {
							id_postagem: posts.id_postagem,
							titulo: posts.titulo,
							descricao: posts.descricao,
							usuario: {
							    id_usuario: posts.id_usuario,
							},
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
};

exports.postPostagens = async (req, res, next) => {
    console.log(req.file);
	mysql.getConnection((error,conn) => {
		if(error){ return res.status(500).send({ error: error }) }
		conn.query(
		'SELECT * FROM helpet.postagens WHERE id_postagem = ?',
			[req.body.id_postagem],
			(error, result, fields) => {
				if(error){ return res.status(500).send({ error: error }) }
//			    	if(result.length == 0){
//					return res.status(404).send({
//						mensagem: 'Produto não encontrado'
//					})
//				}
				conn.query(
 					'INSERT INTO postagens (id_usuario, titulo, descricao, postagem_imagem) VALUES (?,?,?,?)',
            				[req.body.id_usuario, req.body.titulo, req.body.descricao, req.file.path],
                			(error, result, field) => {
                   				conn.release();
                    				if(error){ return res.status(500).send({ error: error }) }
                    				const response = {
                      					mensagem: 'Postagem criada com sucesso',
                        				criandoPostagem: {
                                				id_postagem: result.id_postagem,
                                				id_usuario: req.body.id_usuario,
                                				titulo: req.body.titulo,
                                				descricao: req.body.descricao,
                                				postagem_imagem: req.file.path,
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
			})
        });
};

exports.patchAtulizaPostagem = async (req, res, next)=> {
//    try {
//        const query = 'SELECT * FROM postagens WHERE postagemId = ?;';
//        const result = await mysql.execute(query, [req.params.postagemId]);
//
//        if (result.length == 0) {
//            return res.status(404).send({
//                message: 'Não foi encontrado postagem com este ID'
//            })
//        }
//        const response = {
//            product: {
//                postagemId: result[0].postagemId,
//                titulo: result[0].titulo,
//                descricao: result[0].descricao,
//                imagemPostagem: result[0].imagemPostagem,
//                request: {
//                    type: 'GET',
//                    description: 'Retorna todos os produtos',
//                    url: process.env.URL_API + 'postagens'
//                }
//            }
//        }
//        return res.status(200).send(response);
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
};

exports.patchAtulizaPostagem = async (req, res, next) => {
//
//    try {
//        const query = ` UPDATE postagens
//                           SET titulo         = ?,
//                               descricao        = ?
//                         WHERE postagemId    = ?`;
//        await mysql.execute(query, [
//            req.body.titulo,
//            req.body.descricao,
//            req.params.postagemId
//        ]);
//        const response = {
//            message: 'Postagem atualizado com sucesso',
//            atualizandoPostagem: {
//                postagemId: req.params.postagemId,
//                titulo: req.body.titulo,
//                descricao: req.body.descricao,
//                request: {
//                    type: 'GET',
//                    description: 'Retorna os detalhes de uma postagem',
//                    url: process.env.URL_API + 'postagens/' + req.params.postagemId
//                }
//            }
//        }
//        return res.status(202).send(response);
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
};

exports.deleteUmaPostagem = async (req, res, next) => {
//    try {
//        const query = `DELETE FROM postagens WHERE postagemId = ?`;
//        await mysql.execute(query, [req.params.postagemId]);
//
//        const response = {
//            message: 'Postagem removida com sucesso',
//            request: {
//                type: 'POST',
//                description: 'Insere uma postagem',
//                url: process.env.URL_API + 'postagens',
//                body: {
//                    titulo: 'String',
//                    descricao: 'String'
//                }
//            }
//        }
//        return res.status(202).send(response);
//
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
};
//
//exports.postImagem = async (req, res, next) => {
//    try {
//        const query = 'INSERT INTO imagensPostagem (postagemId, path) VALUES (?,?)';
//        const result = await mysql.execute(query, [
//            req.params.postagemId,
//            req.file.path
//        ]);
//
//        const response = {
//            message: 'Imagem inserida com sucesso',
//            createdImagem: {
//                postagemId: parseInt(req.params.postagemId),
//                imagemId: result.insertId,
//                path: req.file.path,
//                request: {
//                    type: 'GET',
//                    description: 'Retorna todos as imagens',
//                    url: process.env.URL_API + 'postagens/' + req.params.postagemId + '/imagens'
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
//        const query  = "SELECT * FROM imagensPostagem WHERE postagemId = ?;"
//        const result = await mysql.execute(query, [req.params.postagemId])
//        const response = {
//            imagens: result.map(img => {
//                return {
//                    postagemId: parseInt(req.params.postagemId),
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
