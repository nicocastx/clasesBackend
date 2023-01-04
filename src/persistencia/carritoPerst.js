import {contenedorMDB } from "./persMongo/Contenedor.js";
import {cartModel} from './models/carrito.js'

const URL = 'mongodb+srv://nicocastx:qwerty654321@coderbackend.pv6yegc.mongodb.net/carritos?retryWrites=true&w=majority'

const dbCarritos = new contenedorMDB(URL, cartModel)

