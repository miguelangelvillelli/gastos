"use strict";

//Me conecto a MONGO DB -----------------------------------
var mongoose = require("mongoose");
var app = require('./app');
var port =3900;

mongoose.Promise =global.Promise;

mongoose.set ('useFindAndModify',false);

mongoose
  .connect("mongodb://localhost:27017/gastos", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado a MONGO");
    //Creamos el servido y escuchamos peticiones http
    app.listen(port,()=>{
        console.log ('Servidor corriendo en //localhost:'+port);
    });
  });
//---------------------------------------------------------
