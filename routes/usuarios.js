const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios-controller')

// RETORNA TODOS OS USUARIOS
router.get('/', UsuariosController.getUsuarios);

// INSERE UM NOVO USUARIO
router.post('/cadastro', UsuariosController.postCriaUsuario);



// RETORNA OS DADOS DE UM USUARIO
router.get('/:id_usuario', UsuariosController.getUmUsuario);


// ALTERA UM USUARIO
router.patch('/', UsuariosController.patchAtualizaUsuario);

// DELETA UM USUARIO
router.delete('/', UsuariosController.deleteUmUsuario);

//Verifica Login
router.post('/login', UsuariosController.postVerificaLogin);

module.exports = router;
