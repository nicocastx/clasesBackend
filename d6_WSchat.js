//Importacion de dependencias requeridas
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { conexionMDB } from "./options/optionsmdb.js";
import { faker } from "@faker-js/faker";
import { contenedorMDB } from "./ContenedorMDB.js";
import { msjModel } from "./models/mensajes.js";
import { prodModel } from "./models/producto.js";
import { normalize, denormalize, schema } from "normalizr";
import util from "util";

//Servidor mongoose
conexionMDB;

//Inicializacion de variables
const cProd = new contenedorMDB(prodModel);
const cMsg = new contenedorMDB(msjModel);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
let productos = [];
cProd.getAll().then((data) => (productos = data));
let productosTest = [];
let i = 0;
while (i < 5) {
  i++;
  let newProd = {
    nombre: faker.commerce.product(),
    precio: faker.commerce.price(200, 500),
    url: faker.image.fashion(),
  };
  productosTest.push(newProd);
}

//esquemas de normalizr
const schAuthor = new schema.Entity("author", {}, { idAttribute: "mail" });

const schMsj = new schema.Entity(
  "mensaje",
  {
    author: schAuthor,
  },
  { idAttribute: "id" }
);

const schMsjs = new schema.Entity("mensajes", {
  mensajes: [schMsj],
});

//Normalize
let normMsjs = [];
let msjsNotNorm = [];

cMsg.getAll().then((data) => {
  msjsNotNorm = {
    id: "1",
    mensajes: data.map((msj) => {
      return { ...msj._doc, id: msj._id.toString() };
    }),
  };
  normMsjs = normalize(msjsNotNorm, schMsjs);
});

//configuracion de app
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("./public"));

app.engine("handlebars", handlebars.engine());

app.set("views", "./views");
app.set("view engine", "handlebars");

//Enrutamiento
app.get("/", (req, res) => {
  cProd.getAll().then((data) => {
    res.render("formProd", {
      data: data,
      hasProd: data.length > 0,
    });
  });
});

app.get("/api/productos-test", async (req, res) => {
  res.render("prodTest", {
    data: productosTest,
    hasProd: productosTest.length > 0,
  });
});

//Manejo de sockets
io.on("connection", (socket) => {
  console.log("nuevo cliente conectado");

  socket.emit("productos", productos);

  socket.on("newProd", (nuevoProd) => {
    nuevoProd.fecha = new Date().toLocaleString();
    productos.push(nuevoProd);
    io.sockets.emit("productos", productos);
    cProd.save(nuevoProd);
  });

  socket.emit("mensajes", normMsjs);

  socket.on("newMsj", async (nuevoMsj) => {
    await cMsg.save(nuevoMsj);
    cMsg.getAll().then((data) => {
      msjsNotNorm.mensajes = data.map((msj) => {
        return { ...msj._doc, id: msj._doc._id.toString() };
      });
      normMsjs = normalize(msjsNotNorm, schMsjs);
      io.sockets.emit("mensajes", normMsjs);
    });
  });

  socket.emit("productosTest", productosTest);
});

//inicio de servidor
const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});