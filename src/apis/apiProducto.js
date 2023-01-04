//TODO: Crear manejo de req, res de las peticiones HTTP de productos
//const {Producto,dbProducto} = require('../persistencia/productoPerst')
import {dbProducto} from '../persistencia/productoPerstfs.js'


const isAdmin = true

const DBProducto = new dbProducto()
const errorAuth = (ruta, metodo) =>{
    return {error: -1, descripcion: `ruta ${ruta} metodo ${metodo} no autorizada}`}
}

const getProds = (req, res) => {
    const {
        id
    } = req.params
    if (id != undefined) {
        DBProducto.getById(id)
            .then(data => {
                res.send(data)
            })
        return
    }
    DBProducto.getAll()
        .then(data => {
            res.send(data)
        })
}

const postProds = (req, res) => {
    if (!isAdmin) {
        res.send(errorAuth(req.path, req.method))
        return
    }
    const {
        body
    } = req
    const prod = {nombre:body.nombre, descripcion: body.descripcion, codigo: body.codigo, url: body.url, precio: body.precio, stock: body.stock}
    DBProducto.save(prod)
    res.send({
        exito: 'exito'
    })
}

const putProds = (req, res) => {
    if (!isAdmin) {
        res.send(errorAuth(req.path, req.method))
        return
    }
    const {
        id
    } = req.params
    const {
        body
    } = req
    const prod = new Producto(body.nombre, body.descripcion, body.codigo, body.url, body.precio, body.stock)
    prod.id = Number(id)
    DBProducto.save(prod)
    res.send({
        id: id
    })
}

const delProds = (req, res) => {
    if (!isAdmin) {
        res.send(errorAuth(req.path, req.method))
        return
    }
    const {
        id
    } = req.params
    DBProducto.deleteById(id)
    res.send({
        exito: 'exito'
    })
}

export {getProds, postProds, putProds, delProds}
