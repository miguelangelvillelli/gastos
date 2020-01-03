'use strict'

var express= require ('express');
var MovimientoController= require ('../controllers/movimiento');
var router =express.Router();

//Rutas de article
router.post('/save', MovimientoController.save);
router.get('/list',  MovimientoController.getMovimientos);
router.get('/find/:id',MovimientoController.getMovimiento);
router.get('/search/:search',MovimientoController.search);

module.exports = router;