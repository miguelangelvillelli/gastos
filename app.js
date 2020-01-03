'use strict'
// Crgando los modulos de node para crear el servidor
var express = require('express');
var bodyParser= require ('body-parser');
//Ejecutar Express
var app = express();

// Midelware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//RUTA DE PRUEBA

//Agrego rutas
var categoria_routes = require ('./routes/categoria');
var movimiento_routes = require ('./routes/movimiento');
//var user_routes = require ('./routes/user');

//Agrego prefijos de rutas
app.use('/api/categoria',categoria_routes);
app.use('/api/movimiento',movimiento_routes);
//app.use('/api/user',user_routes);
//exportar el modulo
module.exports=app;
