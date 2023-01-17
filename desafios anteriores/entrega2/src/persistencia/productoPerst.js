import {
    contenedorMDB
} from "./persMongo/Contenedor.js";
import {
    prodModel
} from './models/producto.js'
import {
    contenedorFB
} from "./persFB/Contenedor.js";

/*
export class dbProductos extends contenedorMDB {
    constructor() {
        super(prodModel)
    }
}*/

export class dbProductos extends contenedorFB {
    constructor() {
        super('productos')
    }
}
