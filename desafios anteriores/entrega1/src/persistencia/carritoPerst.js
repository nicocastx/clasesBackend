const fs = require('fs')
const {
    dbProducto
} = require('./productoPerst')

const asignarId = (info) => {
    let listaNum = info.map(({
        id
    }) => id)
    return listaNum.includes(listaNum.length + 1) ? (Math.max(...listaNum) + 1) : (listaNum.length + 1)
}
const DBProducto = new dbProducto()

const fsCarrito = './src/persistencia/carritos.txt'

class Carrito {
    constructor() {
        this.id = 0
        this.timestamp = Date.now()
        this.productos = []
    }
}

class dbCarritos {
    async save(carrito) {
        let id = await this.getAll()
            .then(data => {
                if (carrito.id == 0) {
                    carrito.id = asignarId(data)
                }
                let existeId = -1
                existeId = data.findIndex(carro => carro.id === carrito.id)
                if (existeId != -1) {
                    data[existeId] = carrito
                } else {
                    data.push(carrito)
                }
                fs.writeFile(fsCarrito, JSON.stringify(data, null, 2), (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                })
                return carrito.id
            })
            .then(id => id)
        console.log(id);
        return id
    }

    async getAll() {
        try {
            let lista = await fs.promises.readFile(fsCarrito, "utf-8")
                .then(data => {
                    if (data == "") {
                        data = "[]"
                    }
                    let info = JSON.parse(data)
                    return info
                })
            return lista
        } catch (err) {
            fs.promises.writeFile(fsCarrito, '[]')
        }
    }

    async delCarrito(id) {
        try {
            await this.getAll()
                .then(data => {
                    fs.writeFile(fsCarrito, JSON.stringify(data.filter(cart => cart.id != id), null, 2), (err) => {
                        if (err) {
                            throw new Error(err);
                        }
                    })
                })
        } catch (error) {

        }
    }

    async getById(id) {
        try {
            let carrito = await this.getAll()
                .then(data => {
                    return data.find(cart => cart.id == id)
                })
            return carrito
        } catch (error) {
            console.log("Se encontro un error al encontrar el archivo: " + error);
        }
    }

    async addProdCarrito(idCart, prod) {
        await this.getById(idCart)
            .then(cart => {
                DBProducto.getById(prod)
                .then(producto =>{
                    if(producto != null){
                        cart.productos.push(producto)
                        this.save(cart)
                    }
                })
            })
    }

    async delProdCarrito(idCart, idProd) {
        await this.getById(idCart)
            .then( carro => {
                let productoAEliminar = carro.productos.findIndex(prod => prod.id == idProd)
                if (productoAEliminar != -1) {
                    carro.productos.splice(productoAEliminar, 1)
                }
                this.save(carro)
            })
    }
}

module.exports = {
    Carrito: Carrito,
    dbCarritos: dbCarritos
}