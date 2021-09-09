'use strict'

var express = require('express');
var productocontroller = require('../controllers/ProductoController');

var api = express.Router();
var auth = require('../Middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'})

//Productos
api.post('/registro_producto_admin', [auth.auth,path], productocontroller.registro_producto_admin);
api.get('/listar_productos_admin/:filtro?', auth.auth , productocontroller.listar_productos_admin);
api.get('/obtener_portada/:img',productocontroller.obtener_portada);
api.get('/obtener_producto_admin/:id',auth.auth , productocontroller.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', [auth.auth,path], productocontroller.actualizar_producto_admin)
api.delete('/eliminar_producto_admin/:id', auth.auth , productocontroller.eliminar_producto_admin);
api.put('/actualizar_producto_variedades_admin/:id' , auth.auth , productocontroller.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id', [auth.auth,path] , productocontroller.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id', auth.auth , productocontroller.eliminar_imagen_galeria_admin);

//Inventario
api.get('/listar_inventario_producto_admin/:id',auth.auth , productocontroller.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth ,productocontroller.eliminar_inventario_producto_admin); 
api.post('/registro_inventario_producto_admin' , auth.auth , productocontroller.registro_inventario_producto_admin);

//Publicos
api.get('/listar_productos_publico/:filtro?',productocontroller.listar_productos_publico);
api.get('/obtener_productos_slug_publico/:slug', productocontroller.obtener_productos_slug_publico);
api.get('/listar_productos_recomendados_publico/:categoria', productocontroller.listar_productos_recomendados_publico);
api.get('/listar_productos_nuevos_publico',productocontroller.listar_productos_nuevos_publico);
api.get('/listar_productos_masvendidos_publico',productocontroller.listar_productos_masvendidos_publico);
module.exports = api;