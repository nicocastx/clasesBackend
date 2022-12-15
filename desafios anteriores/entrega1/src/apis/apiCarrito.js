const {Carrito, dbCarritos} = require('../persistencia/carritoPerst')

const DBCarritos = new dbCarritos()

const postCarrito = (req, res) =>{
    const carrito = new Carrito()
    DBCarritos.save(carrito)
    .then(id => res.send({idCarrito : id}))
    
}

const delCarrito = (req, res) =>{
    const {
        id
    } = req.params
    DBCarritos.delCarrito(id)
    res.send({
        exito: 'exito'
    })
}

const getCarrito = (req, res) =>{
    const {id} = req. params
    DBCarritos.getById(id)
    .then(data =>{
        if (data != undefined){
            res.send(data.productos)
            return
        }
        res.send({error: -2, descripcion: 'el carrito pedido no existe'})
    })
}
const postProdCarrito = (req, res) =>{
    const {id, idprod} = req.params
    DBCarritos.addProdCarrito(id, idprod)
    res.send({exito: 'exito'})
}

const delProdCarrito = (req, res) =>{
    const {id, idprod} = req.params
    DBCarritos.delProdCarrito(id, idprod)
    res.send({exito: 'exito'})
}

module.exports = {postCarrito: postCarrito,
delCarrito: delCarrito,
getCarrito: getCarrito,
postProdCarrito: postProdCarrito,
delProdCarrito: delProdCarrito}
