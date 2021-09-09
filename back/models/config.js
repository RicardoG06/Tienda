'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = Schema({
    categorias: [{type: Object, required: true}],
    titulo: {type: String, required: true},
    logo: {type: String, required: true},
    serie: {type: String, required: true},
    correlativo: {type: String, required: true},
});

//El nombre 'admin' dentro del primer parametro , es para darle nombre a la tabla en moongose
module.exports = mongoose.model('config',ConfigSchema);