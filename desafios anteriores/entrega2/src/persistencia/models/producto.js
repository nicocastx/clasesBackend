import mongoose from "mongoose";


const prodCol = 'productos'

const prodSchema = mongoose.Schema({
    timestamp: {type: Date},
    nombre: {type: String},
    descripcion: {type: String},
    codigo: {type: String},
    url: {type: String},
    precio: {type: Number},
    stock: {type: Number}
})

export const prodModel =  mongoose.model(prodCol, prodSchema)