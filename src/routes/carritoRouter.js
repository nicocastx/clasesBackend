const {Router} = require('express')
const APICarrito = require('../apis/apiCarrito')

const routerCarrito = Router()

routerCarrito.post('/', APICarrito.postCarrito)

routerCarrito.delete('/:id', APICarrito.delCarrito)

routerCarrito.get('/:id/productos', APICarrito.getCarrito)

routerCarrito.post('/:id/productos/:idprod', APICarrito.postProdCarrito)

routerCarrito.delete('/:id/productos/:idprod', APICarrito.delProdCarrito)

module.exports = routerCarrito