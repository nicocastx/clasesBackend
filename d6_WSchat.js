//Importacion de dependencias requeridas
const express = require('express')
const Contenedor = require('./d2_contenedor.js')
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')
const handlebars = require('express-handlebars')

//Inicializacion de variables
const cProd = new Contenedor('./productos.txt')
const cMsg = new Contenedor('./mensajes.txt')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
let productos = []
cProd.getAll()
.then(data => productos = data)
let mensajes =[]
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
app.get('/', (req, res) =>{
    cProd.getAll()
    .then(data =>{
        res.render('formProd', {
            data: data,
            hasProd: data.length > 0
        })
    })
    
})

//Manejo de sockets
io.on('connection', socket =>{
    console.log('nuevo cliente conectado');

        socket.emit('productos', productos)

    socket.on('newProd', nuevoProd =>{
        productos.push(nuevoProd)
        io.sockets.emit('productos', productos)
        cProd.save(nuevoProd)
    })

    socket.emit('mensajes', mensajes)

    socket.on('newMsj', nuevoMsj =>{
        nuevoMsj.fecha = new Date().toLocaleString()
        mensajes.push(nuevoMsj)
        io.sockets.emit('mensajes', mensajes)
        cMsg.save(nuevoMsj)
    })
})


const PORT = 8080

httpServer.listen(PORT, () =>{
    console.log(`Escuchando en el puerto ${PORT}`);
})
