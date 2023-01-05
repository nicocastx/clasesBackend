
//Inicializacion de servidor
import express from 'express'
import { URL } from 'url'
import routerCarrito from './src/routes/carritoRouter.js'
import routerProductos from './src/routes/productoRouter.js'
import { conexionMDB } from './src/persistencia/configMDB.js'

//Inicio de conexion servidores
//conexionMDB

//functions
const errorNI= (ruta, metodo)=>{
    return {error: -2, descripcion: `ruta ${ruta} metodo ${metodo} no implementada`}
}

//inicio express
const app = express()

//configuracion app
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(new URL('.', import.meta.url).pathname + './public'))



app.use('/api/productos', routerProductos.routerProductos)
app.use('/api/carrito', routerCarrito.routerCarrito)
app.all('*', (req, res)=>{
    res.send(errorNI(req.path, req.method))
})


const PORT = process.env.PORT || 8080

app.listen(PORT, (err) =>{
    console.log('Escuchando en ' + PORT);
})





