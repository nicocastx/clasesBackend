import {
    contenedorMDB
} from "./persMongo/Contenedor.js";
import {
    cartModel
} from './models/carrito.js'
import {
    dbProductos
} from './productoPerst.js'
import mongoose from "mongoose";
import {
    contenedorFB
} from "./persFB/Contenedor.js";
import { FieldValue } from "firebase/firestore";

/*
export class dbCarritos extends contenedorMDB {
    constructor() {
        super(cartModel)
    }

    async save() {
        return this.model.insertMany({
            timestamp: Date.now(),
            productos: []
        })
    }

    async addProdCarrito(idCart, idProd) {
        const prod = await new dbProductos().getById(idProd)
        return await this.model.updateOne({
            _id: mongoose.Types.ObjectId(idCart)
        }, {
            $push: {
                productos: prod[0]
            }
        })
    }

    async delProdCarrito(idCart, idProd) {
        return await this.model.updateOne({
            _id: mongoose.Types.ObjectId(idCart)
        }, {
            $pull: {
                productos: {
                    _id: mongoose.Types.ObjectId(idProd)
                }
            }
        })
    }
}*/
export class dbCarritos extends contenedorFB {
    constructor() {
        super('carritos')
    }

    async save() {
        return await this.col.add({
            timestamp: Date.now(),
            productos: []
        })
    }

    async addProdCarrito(idCart, idProd) {
        const carrito = await this.getById(idCart)
        carrito.productos.push(await new dbProductos().getById(idProd))
        return await this.col.doc(idCart).set(carrito)
    }

    async delProdCarrito(idCart, idProd){
        const carrito = await this.getById(idCart)
        carrito.productos = carrito.productos.filter(item => item.id != idProd)
        return await this.col.doc(idCart).set(carrito)
    }
}
