const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const carnetSchema = new Schema({
   
    nombre: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    carrera: {
      type: String,
      required: true
    },
    poesia: {
      type: String,
      required: true
    },
    genero: {
      type: String,
      required: true
    },
    numcarnet: {
      type: String,
      required: true
    },
    fecha: {
      type: String,
      required: true
    },
    edad: {
      type: String,
      required: true
    },
    imagen: {
        type: String,
        required: true
      },
      fechaconcurso: {
        type: String,
        required: true
      },
      nacimiento: {
        type: String,
        required: true
      },
      aprobado: {
        type: String,
        required: true
      }
  }, { collection: 'carnet' });

const Carnet = mongoose.model('Carnet', carnetSchema);

 module.exports = Carnet;