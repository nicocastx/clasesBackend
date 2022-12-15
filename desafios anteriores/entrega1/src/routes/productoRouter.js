const {Router} = require('express')
const APIProductos = require('../apis/apiProducto')

const routerProductos = Router()




routerProductos.get('/:id?', APIProductos.getProds)

routerProductos.post('/', APIProductos.postProds)

routerProductos.put('/:id', APIProductos.putProds)

routerProductos.delete('/:id', APIProductos.delProds)

module.exports = routerProductos