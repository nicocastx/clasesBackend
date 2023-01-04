import { Router } from 'express'
import * as APIProductos from '../apis/apiProducto.js'

const routerProductos = Router()




routerProductos.get('/:id?', APIProductos.getProds)

routerProductos.post('/', APIProductos.postProds)

routerProductos.put('/:id', APIProductos.putProds)

routerProductos.delete('/:id', APIProductos.delProds)

export default {routerProductos}