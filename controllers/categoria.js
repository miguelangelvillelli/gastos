"use strict";

var validator = require("validator");
var Categoria = require("../models/categoria");

var controller = {
  //METODO POST PARA INSERTAR DOCUMENTOS EN MONGO
  save: (req, res) => {
    // 1 - RECOGER PARAMETROS POR POST
    /* Tomo los valores que vienen en el body de la request */
    var params = req.body;

    // 2 - VALIDAR DATOS (VALIDATOR "YA INSTALADO") TIENE MUUUCHAS VALIDACIONES VER EN LA WEB
    try {
      var validate_nombre = !validator.isEmpty(params.nombre);
      var validate_tipo = !validator.isEmpty(params.tipo);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan enviar datos"
      });
    }

    if (validate_nombre && validate_tipo) {
      // 3 - CREAR EL OBJETO A GUARDAR
      var categoria = new Categoria();

      // 4 - ASIGNAR VALORES AL OBJETO
      categoria.nombre = params.nombre;
      categoria.tipo = params.tipo;
      
      // 5 - GUARDAR
      categoria.save((err, categoriaGuardada) => {
        if (err || !categoriaGuardada) {
          return res.status(500).send({
            status: "error",
            message: "La categoría no se ha guardado"
          });
        }
        // 6 - DEVOLVER UNA RESPUESTA
        return res.status(200).send({
          status: "success",
          categoria: categoriaGuardada
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
  getCategorias: (req, res) => {
    //USO el método FIND sin argumentos asi trae todos los articulos
    Categoria.find({}).exec((err, categorias) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error en el servidor"
        });
      } else if (!categorias || categorias.length<=0) {
        
        return res.status(404).send({
          status: "error",
          message: "No hay categorias para mostrar"
        });
      } else {
       
        return res.status(200).send({
          status: "success",
          categorias
        });
      }
    });
  }, //End Get

//-----------------------------------------------------------------
/*DEVOLVER UNA CATEGORIA ESPECIFICA*/
  getCategoria: (req, res) => {
    // 1-TOMAR EL ID DE LA URL
    var categoriaId = req.params.id;

    // 2-COMPROBAR QUE EXISTE
    if (!categoriaId || categoriaId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe la categoría."
      });
    }
    // 3-BUSCAR LA CATEGORIA
    Categoria.findById(categoriaId, (err, categoria) => {
      //SI HAY ERROR O NO EXISTE EL ARTICULO
      if (err || !categoria) {
        return res.status(404).send({
          status: "error",
          message: "No existe la categoría."
        });
      }

      // 4-DEVOLVERLO EN JSON
      //EL id fue encontrado
      return res.status(200).send({
        status: "success",
        categoria
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
    Categoria.find({
      $or: [
        { nombre: { $regex: searchString, $options: "i" } }
        
        //,{ tipo: { $regex: searchString, $options: "i" } }
      ]
    })
      .sort([["date", "descending"]])
      .exec((err, categorias) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Hubo un error en la peticion"
          });
        }

        //Si no hay categorias que coincidan con la buesqueda        
        if (!categorias || categorias.length<=0) {
          return res.status(404).send({
            status: "error",
            message: "No hay categorias que concidan con la busqueda"
          });
        }
        // si se encontro la cadena de busqueda devuelvo las categorias 
        //que contienen la busqueda
        return res.status(200).send({
          status: "success",
          categorias
        });
      });
  },

  //-----------------------------------------------------------------
   //BORRAR UN ID DETERMINADO
   delete: (req, res) => {
    //Tomar el string a buscar
    var categoriaId = req.params.id;
   // 2-COMPROBAR QUE EXISTE
    if (!categoriaId || categoriaId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe la categoría.",
        verCategoria: categoria
      });
    }
    // 3-BORRAR LA CATEGORIA
    //db.test_users.remove( {"_id": ObjectId("4d512b45cc9374271b02ec4f")});
    Categoria.remove ({"_id": ObjectId(categoriaId)}, (err, categoria) => {
      //console.log(categoriaId);
      //SI HAY ERROR O NO EXISTE EL ARTICULO
      if (err || !categoria) {
        
        return res.status(404).send({
          status: "error",
          verCategoria: categoriaId,
          message: "No existeEEEE la categoría."
          
        });
      }

      // 4-DEVOLVERLO EN JSON
      //EL id fue encontrado
      return res.status(200).send({
        status: "success",
        categoria
      });
    });
   
   } //FIN DELETE
}; //end controller

module.exports = controller;
