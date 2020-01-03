"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MovimientoSchema = Schema({
  detalle: { type: String },
  tipo: {
    type: Boolean,
    default: false
  },
  monto: { type: Number },
  fecha: { type: Date ,default: Date.now }
});

module.exports = mongoose.model("Movimiento", MovimientoSchema);
