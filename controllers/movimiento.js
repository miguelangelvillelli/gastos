"use strict";

var validator = require("validator");
var Movimiento = require("../models/movimiento");

var controller = {
  //METODO POST PARA INSERTAR DOCUMENTOS EN MONGO
  save: (req, res) => {
    // 1 - RECOGER PARAMETROS POR POST
    /* Tomo los valores que vienen en el body de la request */
    var params = req.body;

    // 2 - VALIDAR DATOS (VALIDATOR "YA INSTALADO") TIENE MUUUCHAS VALIDACIONES VER EN LA WEB
    try {
      var validate_detalle = !validator.isEmpty(params.detalle);
      var validate_tipo = !validator.isEmpty(params.tipo);
      var validate_monto = !validator.isEmpty(params.monto);

    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan enviar datos"
      });
    }

    if (validate_detalle && validate_tipo && validate_monto) {
      // 3 - CREAR EL OBJETO A GUARDAR
      var movimiento = new Movimiento();

      // 4 - ASIGNAR VALORES AL OBJETO
      movimiento.detalle = params.detalle;
      movimiento.tipo = params.tipo;
      movimiento.monto = params.monto;
      // 5 - GUARDAR
      movimiento.save((err, movimientoGuardado) => {
        if (err || !movimientoGuardado) {
          return res.status(500).send({
            status: "error",
            message: "El movimiento no se ha guardado"
          });
        }
        // 6 - DEVOLVER UNA RESPUESTA
        return res.status(200).send({
          status: "success",
          movimiento: movimientoGuardado
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son válidos"
      });
    }
  }, //End SAVE

//-----------------------------------------------------------------
//Método para Obtener la lista de categorías
  getMovimientos: (req, res) => {
    //USO el método FIND sin argumentos asi trae todos los articulos
    Movimiento.find({}).exec((err, movimientos) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error en el servidor"
        });
      } else if (!movimientos || movimientos.length<=0) {
        
        return res.status(404).send({
          status: "error",
          message: "No hay movimientos para mostrar"
        });
      } else {
       
        return res.status(200).send({
          status: "success",
          movimientos
        });
      }
    });
  }, //End Get

//-----------------------------------------------------------------
/*DEVOLVER UNA MOVIMIENTO ESPECIFICA*/
  getMovimiento: (req, res) => {
    // 1-TOMAR EL ID DE LA URL
    var movimientoId = req.params.id;

    // 2-COMPROBAR QUE EXISTE
    if (!movimientoId || movimientoId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el movimiento."
      });
    }
    // 3-BUSCAR LA MOVIMIENTO
    Movimiento.findById(movimientoId, (err, movimiento) => {
      //SI HAY ERROR O NO EXISTE EL ARTICULO
      if (err || !movimiento) {
        return res.status(404).send({
          status: "error",
          message: "No existe el movimiento."
        });
      }

      // 4-DEVOLVERLO EN JSON
      //EL id fue encontrado
      return res.status(200).send({
        status: "success",
        movimiento
      });
    });
  },
  //-----------------------------------------------------------------
   //BUSCAR UN STRING DETERMINADO
   search: (req, res) => {
    //Tomar el string a buscar
    var searchString = req.params.search;
    //Y Buscar con FInd el articulo dentro de la base de datos
    //En este caso busco dentro del array de articulos de mongo entonces uso el "OR" de mongo

    /*LA coGnsulta a mongo se leeria asi:
    SI el searchString esta incluido en el NOMBRE o el searchstring esta incluido en CONTENT
    Entonces extraeme el articulo de la DB
     */
    Movimiento.find({
      $or: [
        { detalle: { $regex: searchString, $options: "i" } }
        
        //,{ tipo: { $regex: searchString, $options: "i" } }
      ]
    })
      .sort([["date", "descending"]])
      .exec((err, movimientos) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Hubo un error en la peticion"
          });
        }

        //Si no hay movimientos que coincidan con la buesqueda        
        if (!movimientos || movimientos.length<=0) {
          return res.status(404).send({
            status: "error",
            message: "No hay movimientos que concidan con la busqueda"
          });
        }
        // si se encontro la cadena de busqueda devuelvo las movimientos 
        //que contienen la busqueda
        return res.status(200).send({
          status: "success",
          movimientos
        });
      });
  }
   
}; //end controller

module.exports = controller;
