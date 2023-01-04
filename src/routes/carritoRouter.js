import {Router} from 'express'
import * as APICarrito from '../apis/apiCarrito.js'

const routerCarrito = Router()

routerCarrito.post('/', APICarrito.postCarrito)

routerCarrito.delete('/:id', APICarrito.delCarrito)

routerCarrito.get('/:id/productos', APICarrito.getCarrito)

routerCarrito.post('/:id/productos/:idprod', APICarrito.postProdCarrito)

routerCarrito.delete('/:id/productos/:idprod', APICarrito.delProdCarrito)

export default {routerCarrito}