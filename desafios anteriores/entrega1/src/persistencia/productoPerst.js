const fs = require('fs')


const asignarId = (info) => {
    let listaNum = info.map(({
        id
    }) => id)
    return listaNum.includes(listaNum.length + 1) ? (Math.max(...listaNum) + 1) : (listaNum.length + 1)
}

const fsProducto = './src/persistencia/productos.txt'

class Producto {
    constructor(nombre, descripcion, codigo, url, precio, stock) {
        this.id = 0
        this.timestamp = Date.now()
        this.nombre = nombre
        this.descripcion = descripcion
        this.codigo = codigo
        this.url = url
        this.precio = precio
        this.stock = stock
    }
}

class dbProducto {
    async save(producto) {
        try {
            await this.getAll()
                .then(data => {
                    console.log(producto.id);
                    if(producto.id == 0){
                        producto.id = asignarId(data)
                    }
                    let existeId = data.findIndex(prod => prod.id === producto.id)
                    console.log(existeId);
                    console.log(data);
                    if (existeId != -1) {
                        data[existeId] = producto
                    } else {
                        data.push(producto)
                    }
                    fs.writeFile(fsProducto, JSON.stringify(data, null, 2), (err) => {
                        if (err) {
                            throw new Error(err);
                        }
                    })
                })
        } catch (error) {
            console.log('Ocurrio un error al escribir el archivo : ' + error);
        }
    }
    async getAll() {
        try {
            let lista = await fs.promises.readFile(fsProducto, "utf-8")
                .then(data => {
                    if (data == "") {
                        data = "[]"
                    }
                    let info = JSON.parse(data)
                    return info
                })
            return lista
        }catch (err) {
            fs.promises.writeFile(fsProducto, '[]')
        }
    }
    async getById(id){
        try {
            let producto = await this.getAll()
            .then(data =>{
                return data.find(prod => prod.id == id)
            })
            return producto
        } catch (error) {
            console.log("Se encontro un error al encontrar el archivo: " + error);
        }
    }
    async deleteById(num){
        try {
            this.getAll()
            .then(data =>{
                fs.writeFile(fsProducto, JSON.stringify(data.filter(obj => obj.id != num), null, 2), (err) =>{
                    if (err){
                        throw new Error(err);
                    }
                })
            })
        } catch (error) {
            console.log("Ocurrio un error al borrar el archivo: \n" + error);
        }
    }
}


module.exports = {Producto: Producto, dbProducto: dbProducto}