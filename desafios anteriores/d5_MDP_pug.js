
const express = require('express')
const handlebars = require("express-handlebars")
const Contenedor = require('./d2_contenedor.js')

const app = express()
const c1 = new Contenedor('./productos.txt')
const productos = []

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.set("views", "./views")
app.set("view engine", "pug")

app.get('/', (req, res) => {
    res.render('formProd')
})

app.post('/', (req,res) =>{
    c1.save(req.body)
    .then(res.redirect('/'))
})

app.get('/productos', (req, res) => {
    c1.getAll()
        .then(data => {
            res.render('productos', {
                data: data,
                hasProd: (data.length > 0)
            })
        })
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
})