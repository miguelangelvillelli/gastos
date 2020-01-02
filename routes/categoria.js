'use strict'

var express= require ('express');
var CategoriaController= require ('../controllers/categoria');
var router =express.Router();

//Rutas de article
router.post('/save', CategoriaController.save);
router.get('/list',  CategoriaController.getCategorias);
router.get('/find/:id',CategoriaController.getCategoria);
router.get('/search/:search',CategoriaController.search);

module.exports = router;