const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
// TEM Q POR PARADA DE LOGIN

const PostagensController = require('../controllers/postagens-controller')

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
router.get('/', PostagensController.getPostagens);

// CRIE UMA NOVA POSTAGEM
router.post('/', upload.single('postagem_imagem'), login, PostagensController.postPostagens);

// RETORNA OS DADOS DE UMA POSTAGEM
router.get('/:id_postagem', PostagensController.getUmaPostagem);

// ALTERA UMA POSTAGEM// ALTERA UM USUARIO
router.patch('/', upload.single('postagem_imagem'), login, PostagensController.patchAtulizaPostagem);

// DELETA UMA POSTAGEM
router.delete('/',  PostagensController.deleteUmaPostagem);

router.post('/:id_postagem/imagem', upload.single('postagem_imagem'), PostagensController.postImagem);

router.get('/:id_postagem/imagens', PostagensController.getImagens)

module.exports = router;
