'use strict'

var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: {type: String},
    tipo: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);