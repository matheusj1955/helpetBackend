const mysql = require('../mysql').pool;

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
		conn.query(
		'INSERT INTO usuarios (nome, tel, email) VALUES (?,?,?)',
		[req.body.nome, req.body.tel, req.body.email],
            (error, result, field) => {
			    conn.release();
				if(error){ return res.status(500).send({ error: error }) }
				const response = {
					mensagem: 'Usuario inserido com sucesso',
					criandoUsuario: {
							id_usuario: result.id_usuario,
							nome: req.body.nome,
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
//
//    try {
//        const query = ` UPDATE usuarios
//                           SET nome         = ?,
//                               tel          = ?,
//                               email        = ?,
//                         WHERE id_usuario    = ?`;
//        await mysql.execute(query, [
//            req.body.nome,
//            req.body.tel,
//            req.body.email,
//            req.params.id_usuario
//        ]);
//        const response = {
//            message: 'usuario atualizado com sucesso',
//            atualizandoUsuario: {
//                id_usuario: req.params.id_usuario,
//                nome: req.body.nome,
//                email: req.body.email,
//                request: {
//                    type: 'GET',
//                    description: 'Retorna os detalhes de um usuario',
//                    url: process.env.URL_API + 'usuarios/' + req.params.id_usuario
//                }
//            }
//        }
//        return res.status(202).send(response);
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
};

exports.deleteUmUsuario = async (req, res, next) => {
//    try {
//        const query = `DELETE FROM usuarios WHERE id_usuario = ?`;
//        await mysql.execute(query, [req.params.id_usuario]);
//
//        const response = {
//            message: 'usuario removida com sucesso',
//            request: {
//                type: 'POST',
//                description: 'Insere um usuario',
//                url: process.env.URL_API + 'usuarios',
//                body: {
//                    nome: 'String',
//                    email: 'String'
//                }
//            }
//        }
//        return res.status(202).send(response);
//
//    } catch (error) {
//        return res.status(500).send({ error: error });
//    }
};

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