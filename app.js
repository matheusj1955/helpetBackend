const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaUsuarios = require('./routes/usuarios.js');
//const rotaPostagens = require('./routes/postagens.js');
//const rotaImagens = require('./routes/imagens.js');


//informações de cabeçalio
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*'); //permissão para o controle de acesso (*=todos - se tivesse site seria ele)
    //tipos de cabeçalio q aceito
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    //tipos de metodos q aceito
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // nossa pasta está disponivel publicamente
app.use(bodyParser.urlencoded({ extended: false})); // apenas dados simples
app.use(bodyParser.json());// tipo de entrada json no body


app.use('/usuarios', rotaUsuarios);
//app.use('/postagens', rotaPostagens);
//app.use('/imagens', rotaImagens);

app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});



module.exports = app;