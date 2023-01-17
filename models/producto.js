import mongoose from "mongoose";


const prodCol = 'productos'

const prodSchema = mongoose.Schema({
    nombre: {type: String},
    url: {type: String},
    precio: {type: Number}
})

export const prodModel =  mongoose.model(prodCol, prodSchema)