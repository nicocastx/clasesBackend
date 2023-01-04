//Importacion de dependencias requeridas
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import {optionsMDB} from './options/configmdb.js'
import { optionsSQLT } from './options/configsqlite.js'

import SqlContenedor from './sqlContenedor.js'

//Inicializacion de variables
const cProd = new SqlContenedor(optionsMDB, 'productos')
const cMsg = new SqlContenedor(optionsSQLT, 'mensajes')
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
let productos = []
cProd.getAll()
    .then(data => productos = data)
let mensajes = []
cMsg.getAll()
    .then(data => mensajes = data)

//configuracion de app
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(express.static('./public'))

app.engine('handlebars', handlebars.engine())

app.set('views', './views')
app.set('view engine', "handlebars")

//Enrutamiento
app.get('/', (req, res) => {
    cProd.getAll()
        .then(data => {
            console.log(data);
            res.render('formProd', {
                data: data,
                hasProd: data.length > 0
            })
        })

})

//Manejo de sockets
io.on('connection', socket => {
    console.log('nuevo cliente conectado');

    socket.emit('productos', productos)

    socket.on('newProd', nuevoProd => {
        nuevoProd.fecha = new Date().toLocaleString()
        productos.push(nuevoProd)
        io.sockets.emit('productos', productos)
        cProd.save(nuevoProd)
    })

    socket.emit('mensajes', mensajes)

    socket.on('newMsj', nuevoMsj => {
        nuevoMsj.fecha = new Date().toLocaleString()
        mensajes.push(nuevoMsj)
        io.sockets.emit('mensajes', mensajes)
        cMsg.save(nuevoMsj)
    })
})


const PORT = 8080

httpServer.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
})