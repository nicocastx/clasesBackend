/*Analisis de enunciado
 * ----ROUTING
 * 1. API/PRODUCTOS - PLANTEAR ROUTER:
 * a get id? puede recibir id o no, lista todos los productos o solo uno, depende
 * 1 - getbyid, :id no existe, get all
 * b post / incorporar un p   roductos al listado (solo admin)
 * c put :id actualiza un producto por id (solo admin)
 * d delete :id borra prod por id
 * 
 * 2. API/CARRITO 3 rutas disponibles para usuarios y admins
 * post / crear carrito y devuelvo un id
 * delete /:id vacio un carrito y lo elimino
 * get :id/productos listo los productos guardados en el carrito
 * post :id/productos incorporo productos al carrito por id de prod
 * delete /id/productos/idprod elimino un prod del carrito
 * 
 * ----isAdmin
 * hacer un bboleano admin, que siendo true o false me permite alcanzar las rutas indicadas
 * si una request no es permitida, devolver objeto:
 * {error: -1, descripcion: ruta x metodo y no autorizado}
 * 
 * ----DEFINICION CLASES
 * producto(id, timestamp, nombre, descripcion, codigo, foto - url, precio, stock)
 * carrito(id, timestamp carrito, productos{atributos productos})
 * ----TIMESTAMP
 * definido con Date.now()
 * ----PERSISTENCIA
 * La persistencia de guardara a traves un filesystem
 * ----REGLAS
 * VISTAS: TODAS LAS PETICIONES EN FORMATO JSON
 * RUTAS NO IMPLEMENTADAS: mostrar objeto
 * {error: -2, descripcion: ruta x metodo y no implementado}
 * DEFINICION PROYECTO: en 3 modulos, routing, api y persistencia
 * (OPCIONAL, PREGUNTAR) usar clases y constructores
 * TEST: ambito local, puerto: 8080 y en glitch
 */ 

//TODO: Plantear enrutamiento de apis

//Inicializacion de servidor
const express = require('express')
const routerCarrito = require('./src/routes/carritoRouter')
const routerProductos = require('./src/routes/productoRouter')




//functions
const errorNI= (ruta, metodo)=>{
    return {error: -2, descripcion: `ruta ${ruta} metodo ${metodo} no implementada`}
}

//inicio express
const app = express()

//configuracion app
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + './public'))



app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)
app.all('*', (req, res)=>{
    res.send(errorNI(req.path, req.method))
})


const PORT = process.env.PORT || 8080

app.listen(PORT, (err) =>{
    console.log('Escuchando en ' + PORT);
})





