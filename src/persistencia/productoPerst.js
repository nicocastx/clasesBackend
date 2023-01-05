import { contenedorMDB } from "./persMongo/Contenedor.js";
import { prodModel } from './models/producto.js'

export class dbProductos extends contenedorMDB{
    constructor(){
        super(prodModel)
    }
}
