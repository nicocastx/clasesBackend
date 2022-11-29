const Contenedor = require("../d2_contenedor.js")
const express = require("express")

const app = express()
const c1 = new Contenedor("./productos.txt")
const PORT = 8080

app.get("/", (req, res) => {
    res.send("<h1>Bienvenido al desafio 3</h1>")
})

app.get("/productos", (req, res) => {
    c1.getAll().then(productos => {
        let listaProd = productos.map(prod => `Nombre: ${prod.nombre} \n
Precio: $ ${prod.precio} \n
ID: ${prod.id} \n`)
        res.send(`<p>${listaProd}</p>`)
    })
})

app.get("/productoRandom", (req, res) => {
    c1.getAll()
    .then(productos => {
        let prodRandom = productos[Math.round(Math.random() * (productos.length))]
        return prodRandom
    })
    .then(prodRandom => res.send(`<p>Nombre: ${prodRandom.nombre}, Precio: $${prodRandom.precio}, ID: ${prodRandom.id}</p>`))
})


const server = app.listen(8080, () => {
    console.log("escuchando a " + PORT);
})