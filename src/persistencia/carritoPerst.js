import {contenedorMDB } from "./persMongo/Contenedor.js";
import {cartModel} from './models/carrito.js'
import {dbProductos} from './productoPerst.js'
import mongoose from "mongoose";

export class dbCarritos extends contenedorMDB{
    constructor(){
        super(cartModel)
    }

    async save(){
        return this.model.insertMany({timestamp: Date.now(), productos: []})
    }

    async addProdCarrito(idCart, idProd){
        const prod = await new dbProductos().getById(idProd)
        return await this.model.updateOne({_id : mongoose.Types.ObjectId(idCart)}, {$push: {productos: prod[0]}})
    }

    async delProdCarrito(idCart, idProd){
        return await this.model.updateOne({_id : mongoose.Types.ObjectId(idCart)},  {$pull: {productos:{_id: mongoose.Types.ObjectId(idProd)}}})
    }
}


