import mongoose from "mongoose";

const mensjCol = "mensajes";

const msjSchema = mongoose.Schema({
  author: {
    mail: String,
    nombre: String,
    apellido: String,
    edad: Number,
    alias: String,
    avatar: String,
  },
  text: String
});

export const msjModel = mongoose.model(mensjCol, msjSchema);
