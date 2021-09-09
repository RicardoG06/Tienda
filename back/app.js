'use strict'

var express = require('express');
var app = express(); //Ya que traje express , lo inicializo
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    cors: {origin : '*'}
});

io.on('connection',function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
        console.log(data);
    });

    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
        console.log(data);
    });
});

var admin_route = require('./routes/admin')
var cliente_route = require('./routes/cliente');
var producto_route = require('./routes/producto');
var cupon_route = require('./routes/cupon');
var config_route = require('./routes/config');
var carrito_route = require('./routes/carrito');

//Conectar con la bd de datos dentro de Robo 3T el cual conecta con moongose , useunified y useurl es para quitar las alertas de de consola
mongoose.connect('mongodb://127.0.0.1:27017/Tienda',{useUnifiedTopology: true , useNewUrlParser: true},(err,res)=>{
    if(err){ //Si  hay un error de coneccion , me imprime el error
        console.log(err)
    }else{
        server.listen(port,function(){
            console.log('Servidor corriendo en el puerto' + port);
        })
    }
});

//Cuando se envia info del front al back del usuario , se debe parsear la data:
// urlencoded -> Obtener los datos del cliente en JSON 
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit: '50mb', extended:true}));

//Para una conexion estable, al estar el back y el front en diferentes puertos y servidores
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

//Inicializando las rutas
app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',producto_route);
app.use('/api',cupon_route);
app.use('/api',config_route);
app.use('/api',carrito_route);

module.exports = app;