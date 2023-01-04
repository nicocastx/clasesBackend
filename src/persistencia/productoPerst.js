import mongoose from "mongoose";
import { contenedorMDB } from "./persMongo/Contenedor.js";
import { prodModel } from './models/producto.js'

const URL = 'mongodb+srv://nicocastx:qwerty654321@coderbackend.pv6yegc.mongodb.net/productos?retryWrites=true&w=majority'

class dbProductos extends contenedorMDB{
    constructor(){
        super()
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }
}

const DBProductos = new dbProductos(prodModel)

try {
    console.log(await DBProductos.getAll());
} catch (error) {
    console.log(error);
}

